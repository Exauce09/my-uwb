"""Gestion administrative des personnes (identité) — rôle admin, V1."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.database import get_db
from app.models.person import Person
from app.models.role import RoleName
from app.models.user import User
from app.schemas.person import (
    PersonCreate,
    PersonListResponse,
    PersonPublic,
    PersonUpdate,
)

router = APIRouter(prefix="/persons", tags=["persons"])

_ADMIN = RoleName.admin.value


def _to_public(person: Person) -> PersonPublic:
    return PersonPublic.model_validate(person)


def _active_persons_filter():
    return Person.deleted_at.is_(None)


def _get_person_or_404(
    db: Session,
    person_id: UUID,
    *,
    include_deleted: bool = False,
) -> Person:
    query = db.query(Person).filter(Person.id == person_id)
    if not include_deleted:
        query = query.filter(_active_persons_filter())
    person = query.first()
    if person is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Personne introuvable.",
        )
    return person


@router.post("", response_model=PersonPublic, status_code=status.HTTP_201_CREATED)
def create_person(
    body: PersonCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> PersonPublic:
    person = Person(
        last_name=body.last_name.strip(),
        first_name=body.first_name.strip(),
        other_names=body.other_names.strip() if body.other_names else None,
        email=str(body.email).lower().strip() if body.email else None,
        phone=body.phone.strip() if body.phone else None,
        birth_date=body.birth_date,
    )
    db.add(person)
    db.commit()
    db.refresh(person)
    return _to_public(person)


@router.get("", response_model=PersonListResponse)
def list_persons(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, max_length=200),
) -> PersonListResponse:
    filters = [_active_persons_filter()]
    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        filters.append(
            or_(
                func.lower(Person.last_name).like(term),
                func.lower(Person.first_name).like(term),
                func.lower(func.coalesce(Person.other_names, "")).like(term),
                func.lower(func.coalesce(Person.email, "")).like(term),
                func.lower(func.coalesce(Person.phone, "")).like(term),
            )
        )

    total = db.query(func.count(Person.id)).filter(*filters).scalar() or 0
    persons = (
        db.query(Person)
        .filter(*filters)
        .order_by(Person.last_name.asc(), Person.first_name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return PersonListResponse(
        items=[_to_public(p) for p in persons],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{person_id}", response_model=PersonPublic)
def get_person(
    person_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> PersonPublic:
    return _to_public(_get_person_or_404(db, person_id))


@router.patch("/{person_id}", response_model=PersonPublic)
def update_person(
    person_id: UUID,
    body: PersonUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> PersonPublic:
    person = _get_person_or_404(db, person_id)
    data = body.model_dump(exclude_unset=True)
    if "last_name" in data and data["last_name"] is not None:
        person.last_name = data["last_name"].strip()
    if "first_name" in data and data["first_name"] is not None:
        person.first_name = data["first_name"].strip()
    if "other_names" in data:
        raw = data["other_names"]
        person.other_names = raw.strip() if raw else None
    if "email" in data:
        raw_email = data["email"]
        person.email = str(raw_email).lower().strip() if raw_email else None
    if "phone" in data:
        raw_phone = data["phone"]
        person.phone = raw_phone.strip() if raw_phone else None
    if "birth_date" in data:
        person.birth_date = data["birth_date"]
    db.commit()
    db.refresh(person)
    return _to_public(person)


@router.delete("/{person_id}", response_model=PersonPublic)
def soft_delete_person(
    person_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> PersonPublic:
    """Suppression logique — ne supprime pas le compte User lié."""
    person = _get_person_or_404(db, person_id)
    if person.deleted_at is None:
        person.deleted_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(person)
    return _to_public(person)
