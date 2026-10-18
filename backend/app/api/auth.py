from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, require_roles
from app.config import Settings, get_settings
from app.database import get_db
from app.models.academic import Enrollment, Program, StudentProfile
from app.models.person import Person
from app.models.role import RoleName
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.dossier import (
    AcademicDossierSection,
    DossierPublic,
    EnrollmentPublic,
)
from app.schemas.person import PersonPublic
from app.schemas.user import UserPublic
from app.security.login_rate_limit import (
    client_ip_from_request,
    get_login_rate_limiter,
)
from app.security.passwords import verify_password
from app.security.tokens import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

_GENERIC_AUTH_FAILURE = "Identifiants incorrects."
_GENERIC_RATE_LIMIT = "Trop de tentatives. Réessayez plus tard."


def _user_public(user: User) -> UserPublic:
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


def _login_rate_keys(email: str, request: Request) -> list[str]:
    keys = [f"email:{email}"]
    client_ip = client_ip_from_request(request)
    if client_ip:
        keys.append(f"ip:{client_ip}")
    return keys


def _raise_if_login_rate_limited(keys: list[str], settings: Settings) -> None:
    limiter = get_login_rate_limiter()
    max_attempts = settings.login_rate_limit_attempts
    window = float(settings.login_rate_limit_window_seconds)
    for key in keys:
        if limiter.is_limited(
            key, max_attempts=max_attempts, window_seconds=window
        ):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=_GENERIC_RATE_LIMIT,
            )


def _register_login_failures(keys: list[str], settings: Settings) -> None:
    limiter = get_login_rate_limiter()
    max_attempts = settings.login_rate_limit_attempts
    window = float(settings.login_rate_limit_window_seconds)
    for key in keys:
        limiter.register_failure(
            key, max_attempts=max_attempts, window_seconds=window
        )


def _clear_login_failures(keys: list[str]) -> None:
    limiter = get_login_rate_limiter()
    for key in keys:
        limiter.reset_key(key)


@router.post("/login", response_model=TokenResponse)
def login(
    body: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    email = body.email.lower().strip()
    rate_keys = _login_rate_keys(email, request)
    _raise_if_login_rate_limited(rate_keys, settings)

    try:
        user = (
            db.query(User)
            .options(joinedload(User.roles))
            .filter(User.email == email)
            .first()
        )
    except (OperationalError, ProgrammingError):
        # Schéma absent / DB injoignable — ne pas renvoyer 500 opaque.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service de données indisponible. Vérifiez les migrations et la base.",
        ) from None

    # Message générique — ne pas indiquer si l’e-mail existe.
    if user is None or not verify_password(body.password, user.hashed_password):
        _register_login_failures(rate_keys, settings)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=_GENERIC_AUTH_FAILURE,
        )
    if not user.is_active:
        _register_login_failures(rate_keys, settings)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=_GENERIC_AUTH_FAILURE,
        )

    _clear_login_failures(rate_keys)

    roles = sorted(user.role_names())
    token = create_access_token(subject=user.id, roles=roles, settings=settings)

    secure = settings.cookie_secure or settings.is_production
    response.set_cookie(
        key=settings.access_cookie_name,
        value=token,
        httponly=True,
        secure=secure,
        samesite=settings.cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return TokenResponse(access_token=token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    settings: Settings = Depends(get_settings),
) -> None:
    response.delete_cookie(
        key=settings.access_cookie_name,
        path="/",
        httponly=True,
        samesite=settings.cookie_samesite,
        secure=settings.cookie_secure or settings.is_production,
    )


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)) -> UserPublic:
    return _user_public(user)


def _own_person_or_none(db: Session, user: User) -> Person | None:
    """Person liée au compte courant uniquement — jamais un id fourni par le client."""
    if user.person_id is None:
        return None
    return (
        db.query(Person)
        .filter(Person.id == user.person_id, Person.deleted_at.is_(None))
        .first()
    )


@router.get("/me/person", response_model=PersonPublic)
def me_person(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PersonPublic:
    """
    Fiche Person liée au compte authentifié uniquement.
    404 si aucune liaison ou fiche soft-deleted — pas d’accès cross-compte.
    """
    person = _own_person_or_none(db, user)
    if person is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucune fiche Person liée à ce compte.",
        )
    return PersonPublic.model_validate(person)


def _academic_section_for_user(db: Session, user: User) -> AcademicDossierSection:
    """Inscriptions du seul StudentProfile lié à ``user.person_id`` (pas d’id client)."""
    if user.person_id is None:
        return AcademicDossierSection(
            status="not_provisioned",
            message=(
                "Aucune fiche Person liée à ce compte. Les données académiques "
                "ne sont pas disponibles."
            ),
        )

    profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.person_id == user.person_id,
            StudentProfile.deleted_at.is_(None),
        )
        .first()
    )
    if profile is None:
        return AcademicDossierSection(
            status="not_provisioned",
            message=(
                "Aucun profil étudiant (matricule) n’est encore enregistré pour "
                "ce compte. Aucune information fictive n’est affichée."
            ),
        )

    rows = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.program).joinedload(Program.academic_unit),
            joinedload(Enrollment.academic_year),
            joinedload(Enrollment.program_level),
        )
        .filter(
            Enrollment.student_profile_id == profile.id,
            Enrollment.deleted_at.is_(None),
        )
        .order_by(Enrollment.created_at.desc())
        .all()
    )

    enrollments: list[EnrollmentPublic] = []
    for row in rows:
        level = row.program_level
        enrollments.append(
            EnrollmentPublic(
                id=row.id,
                status=row.status,
                kind=row.kind,
                academic_year_label=row.academic_year.label,
                program_code=row.program.code,
                program_title=row.program.title,
                academic_unit_name=row.program.academic_unit.name,
                program_level_code=level.code if level else None,
                program_level_label=level.label if level else None,
            )
        )

    if not enrollments:
        return AcademicDossierSection(
            status="empty",
            message=(
                "Profil étudiant trouvé, mais aucune inscription académique "
                "enregistrée pour le moment. Les notes restent hors périmètre "
                "(D-015)."
            ),
            student_number=profile.student_number,
            enrollments=[],
        )

    return AcademicDossierSection(
        status="ready",
        message=(
            "Inscriptions académiques en lecture seule. Aucune note ni "
            "délibération n’est exposée tant que D-015 n’est pas validée."
        ),
        student_number=profile.student_number,
        enrollments=enrollments,
    )


@router.get("/me/dossier", response_model=DossierPublic)
def me_dossier(
    user: User = Depends(require_roles(RoleName.student.value)),
    db: Session = Depends(get_db),
) -> DossierPublic:
    """
    Dossier étudiant en lecture seule pour le compte authentifié.

    - Identité : Person liée à ``user.person_id`` (pas de person_id en query).
    - Académique : StudentProfile + enrollments du même person_id uniquement.
    - Notes : non exposées (D-015).
    """
    person = _own_person_or_none(db, user)
    return DossierPublic(
        person=PersonPublic.model_validate(person) if person else None,
        academic=_academic_section_for_user(db, user),
    )
