"""Gestion administrative des utilisateurs et rôles — réservée au rôle admin."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_roles
from app.database import get_db
from app.models.person import Person
from app.models.role import Role, RoleName
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserListResponse,
    UserPersonLink,
    UserPublic,
    UserRoleAssign,
    UserStatusUpdate,
)
from app.security.admin_guard import admin_mutation_guard
from app.security.passwords import hash_password

router = APIRouter(prefix="/users", tags=["users"])

_ADMIN = RoleName.admin.value


def _to_public(user: User) -> UserPublic:
    return UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        roles=sorted(user.role_names()),
        person_id=user.person_id,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


def _ensure_roles(db: Session, names: list[str]) -> list[Role]:
    valid = {r.value for r in RoleName}
    roles: list[Role] = []
    for name in names:
        if name not in valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rôle invalide.",
            )
        role = db.query(Role).filter(Role.name == name).first()
        if role is None:
            role = Role(name=name, description=f"Rôle {name}")
            db.add(role)
            db.flush()
        roles.append(role)
    return roles


def _get_user_or_404(db: Session, user_id: UUID) -> User:
    user = (
        db.query(User)
        .options(joinedload(User.roles))
        .filter(User.id == user_id)
        .first()
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable.",
        )
    return user


def _count_active_admins(db: Session) -> int:
    return (
        db.query(User)
        .join(User.roles)
        .filter(User.is_active.is_(True), Role.name == _ADMIN)
        .distinct()
        .count()
    )


def _is_active_admin(user: User) -> bool:
    return user.is_active and _ADMIN in user.role_names()


@router.post("", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def create_user(
    body: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    email = body.email.lower().strip()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de créer ce compte.",
        )
    try:
        hashed = hash_password(body.password)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe invalide.",
        ) from None

    role_names = body.roles or [RoleName.student.value]
    roles = _ensure_roles(db, role_names)
    user = User(
        email=email,
        hashed_password=hashed,
        full_name=body.full_name,
        roles=roles,
    )
    db.add(user)
    db.commit()
    user = _get_user_or_404(db, user.id)
    return _to_public(user)


@router.get("", response_model=UserListResponse)
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, max_length=200),
) -> UserListResponse:
    filters = []
    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        filters.append(
            or_(
                func.lower(User.email).like(term),
                func.lower(func.coalesce(User.full_name, "")).like(term),
            )
        )

    total = db.query(func.count(User.id)).filter(*filters).scalar() or 0
    users = (
        db.query(User)
        .options(joinedload(User.roles))
        .filter(*filters)
        .order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return UserListResponse(
        items=[_to_public(u) for u in users],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{user_id}", response_model=UserPublic)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    return _to_public(_get_user_or_404(db, user_id))


@router.patch("/{user_id}/status", response_model=UserPublic)
def update_user_status(
    user_id: UUID,
    body: UserStatusUpdate,
    db: Session = Depends(get_db),
    actor: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    user = _get_user_or_404(db, user_id)

    if body.is_active == user.is_active:
        return _to_public(user)

    # Activation : pas de risque « zéro admin » → pas de verrou commun.
    if body.is_active:
        user.is_active = True
        db.commit()
        return _to_public(_get_user_or_404(db, user.id))

    # Désactivation : verrou commun puis relecture + contrôles + commit atomique.
    with admin_mutation_guard(db):
        try:
            user = _get_user_or_404(db, user_id)
            if user.is_active is False:
                return _to_public(user)

            # Dernier admin actif : 409 (y compris auto-désactivation).
            if _is_active_admin(user) and _count_active_admins(db) <= 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Impossible de désactiver le dernier administrateur actif.",
                )

            # Plusieurs admins : interdiction d’auto-désactivation.
            if actor.id == user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Impossible de désactiver votre propre compte.",
                )

            user.is_active = False
            db.commit()
        except HTTPException:
            db.rollback()
            raise

    return _to_public(_get_user_or_404(db, user_id))


@router.post("/{user_id}/roles", response_model=UserPublic)
def assign_role(
    user_id: UUID,
    body: UserRoleAssign,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    user = _get_user_or_404(db, user_id)
    role_name = body.role.strip().lower()
    roles = _ensure_roles(db, [role_name])
    role = roles[0]

    if role.name in user.role_names():
        return _to_public(user)

    user.roles.append(role)
    db.commit()
    user = _get_user_or_404(db, user.id)
    return _to_public(user)


@router.delete("/{user_id}/roles/{role_name}", response_model=UserPublic)
def remove_role(
    user_id: UUID,
    role_name: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    normalized = role_name.strip().lower()
    valid = {r.value for r in RoleName}
    if normalized not in valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rôle invalide.",
        )

    user = _get_user_or_404(db, user_id)
    if normalized not in user.role_names():
        return _to_public(user)

    # Retrait hors admin : pas de risque « zéro admin ».
    if normalized != _ADMIN:
        user.roles = [r for r in user.roles if r.name != normalized]
        db.commit()
        return _to_public(_get_user_or_404(db, user.id))

    with admin_mutation_guard(db):
        try:
            user = _get_user_or_404(db, user_id)
            if _ADMIN not in user.role_names():
                return _to_public(user)

            if _is_active_admin(user) and _count_active_admins(db) <= 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "Impossible de retirer le rôle administrateur "
                        "du dernier administrateur actif."
                    ),
                )

            user.roles = [r for r in user.roles if r.name != _ADMIN]
            db.commit()
        except HTTPException:
            db.rollback()
            raise

    return _to_public(_get_user_or_404(db, user_id))


@router.put("/{user_id}/person", response_model=UserPublic)
def link_user_person(
    user_id: UUID,
    body: UserPersonLink,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    """Lie un compte à une Person active. Idempotent si déjà la même liaison."""
    user = _get_user_or_404(db, user_id)
    person = (
        db.query(Person)
        .filter(Person.id == body.person_id, Person.deleted_at.is_(None))
        .first()
    )
    if person is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Personne introuvable.",
        )

    if user.person_id == person.id:
        return _to_public(user)

    if user.person_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce compte est déjà lié à une autre personne.",
        )

    other = db.query(User).filter(User.person_id == person.id).first()
    if other is not None and other.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette personne est déjà liée à un autre compte.",
        )

    user.person_id = person.id
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Liaison Person/User impossible (contrainte d’unicité).",
        ) from None
    return _to_public(_get_user_or_404(db, user.id))


@router.delete("/{user_id}/person", response_model=UserPublic)
def unlink_user_person(
    user_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> UserPublic:
    """Retire la liaison Person — ne supprime ni le compte ni la fiche."""
    user = _get_user_or_404(db, user_id)
    if user.person_id is None:
        return _to_public(user)
    user.person_id = None
    db.commit()
    return _to_public(_get_user_or_404(db, user.id))

