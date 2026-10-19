"""Administration E3 — profils étudiants et inscriptions (rôle admin uniquement)."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_roles
from app.database import get_db
from app.models.academic import (
    AcademicYear,
    Enrollment,
    EnrollmentStatus,
    Program,
    ProgramLevel,
    StudentProfile,
)
from app.models.person import Person
from app.models.role import RoleName
from app.models.user import User
from app.schemas.academic_admin import (
    AcademicYearRef,
    CatalogLists,
    EnrollmentAdminPublic,
    EnrollmentCreate,
    EnrollmentUpdate,
    ProgramLevelRef,
    ProgramRef,
    StudentProfileCreate,
    StudentProfileListItem,
    StudentProfileListResponse,
    StudentProfilePublic,
    StudentProfileUpdate,
)
from app.schemas.person import PersonPublic

router = APIRouter(tags=["academic-admin"])

_ADMIN = RoleName.admin.value
_ALLOWED_STATUSES = {s.value for s in EnrollmentStatus}


def _program_ref(program: Program) -> ProgramRef:
    return ProgramRef(
        id=program.id,
        code=program.code,
        title=program.title,
        academic_unit_name=program.academic_unit.name,
    )


def _year_ref(year: AcademicYear) -> AcademicYearRef:
    return AcademicYearRef.model_validate(year)


def _level_ref(level: ProgramLevel | None) -> ProgramLevelRef | None:
    if level is None:
        return None
    return ProgramLevelRef.model_validate(level)


def _enrollment_public(row: Enrollment) -> EnrollmentAdminPublic:
    return EnrollmentAdminPublic(
        id=row.id,
        student_profile_id=row.student_profile_id,
        status=row.status,
        kind=row.kind,
        enrolled_on=row.enrolled_on,
        closed_on=row.closed_on,
        program=_program_ref(row.program),
        academic_year=_year_ref(row.academic_year),
        program_level=_level_ref(row.program_level),
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def _profile_public(profile: StudentProfile) -> StudentProfilePublic:
    enrollments = [
        _enrollment_public(e)
        for e in profile.enrollments
        if e.deleted_at is None
    ]
    enrollments.sort(key=lambda e: e.created_at, reverse=True)
    return StudentProfilePublic(
        id=profile.id,
        person_id=profile.person_id,
        student_number=profile.student_number,
        status=profile.status,
        entry_date=profile.entry_date,
        person=PersonPublic.model_validate(profile.person),
        enrollments=enrollments,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        deleted_at=profile.deleted_at,
    )


def _enrollment_load_options():
    return (
        joinedload(Enrollment.program).joinedload(Program.academic_unit),
        joinedload(Enrollment.academic_year),
        joinedload(Enrollment.program_level),
    )


def _get_active_person(db: Session, person_id: UUID) -> Person:
    person = (
        db.query(Person)
        .filter(Person.id == person_id, Person.deleted_at.is_(None))
        .first()
    )
    if person is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Personne introuvable.",
        )
    return person


def _get_profile_or_404(db: Session, profile_id: UUID) -> StudentProfile:
    profile = (
        db.query(StudentProfile)
        .options(
            joinedload(StudentProfile.person),
            joinedload(StudentProfile.enrollments)
            .joinedload(Enrollment.program)
            .joinedload(Program.academic_unit),
            joinedload(StudentProfile.enrollments).joinedload(
                Enrollment.academic_year
            ),
            joinedload(StudentProfile.enrollments).joinedload(
                Enrollment.program_level
            ),
        )
        .filter(
            StudentProfile.id == profile_id,
            StudentProfile.deleted_at.is_(None),
        )
        .first()
    )
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil étudiant introuvable.",
        )
    return profile


def _get_enrollment_or_404(db: Session, enrollment_id: UUID) -> Enrollment:
    row = (
        db.query(Enrollment)
        .options(*_enrollment_load_options())
        .filter(Enrollment.id == enrollment_id, Enrollment.deleted_at.is_(None))
        .first()
    )
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inscription introuvable.",
        )
    return row


@router.get("/academic/catalog", response_model=CatalogLists)
def academic_catalog(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> CatalogLists:
    programs = (
        db.query(Program)
        .options(joinedload(Program.academic_unit))
        .filter(Program.deleted_at.is_(None))
        .order_by(Program.code.asc())
        .all()
    )
    years = (
        db.query(AcademicYear)
        .order_by(AcademicYear.label.desc())
        .all()
    )
    levels = (
        db.query(ProgramLevel)
        .order_by(ProgramLevel.sort_order.asc(), ProgramLevel.code.asc())
        .all()
    )
    return CatalogLists(
        programs=[_program_ref(p) for p in programs],
        academic_years=[_year_ref(y) for y in years],
        program_levels=[ProgramLevelRef.model_validate(lv) for lv in levels],
    )


@router.get("/student-profiles", response_model=StudentProfileListResponse)
def list_student_profiles(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, max_length=200),
) -> StudentProfileListResponse:
    filters = [StudentProfile.deleted_at.is_(None)]
    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        filters.append(
            or_(
                func.lower(StudentProfile.student_number).like(term),
                func.lower(Person.last_name).like(term),
                func.lower(Person.first_name).like(term),
                func.lower(func.coalesce(Person.email, "")).like(term),
            )
        )

    total = (
        db.query(func.count(StudentProfile.id))
        .join(Person)
        .filter(*filters)
        .scalar()
        or 0
    )
    rows = (
        db.query(StudentProfile)
        .join(Person)
        .options(joinedload(StudentProfile.person))
        .filter(*filters)
        .order_by(Person.last_name.asc(), Person.first_name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items: list[StudentProfileListItem] = []
    for profile in rows:
        count = (
            db.query(func.count(Enrollment.id))
            .filter(
                Enrollment.student_profile_id == profile.id,
                Enrollment.deleted_at.is_(None),
            )
            .scalar()
            or 0
        )
        items.append(
            StudentProfileListItem(
                id=profile.id,
                person_id=profile.person_id,
                student_number=profile.student_number,
                status=profile.status,
                entry_date=profile.entry_date,
                person_last_name=profile.person.last_name,
                person_first_name=profile.person.first_name,
                person_email=profile.person.email,
                enrollment_count=count,
            )
        )

    return StudentProfileListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post(
    "/student-profiles",
    response_model=StudentProfilePublic,
    status_code=status.HTTP_201_CREATED,
)
def create_student_profile(
    body: StudentProfileCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> StudentProfilePublic:
    _get_active_person(db, body.person_id)
    existing = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.person_id == body.person_id,
            StudentProfile.deleted_at.is_(None),
        )
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette personne a déjà un profil étudiant.",
        )

    profile = StudentProfile(
        person_id=body.person_id,
        student_number=body.student_number.strip(),
        status=(body.status or "active").strip() or "active",
        entry_date=body.entry_date,
    )
    db.add(profile)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Matricule déjà utilisé ou contrainte d’unicité violée.",
        ) from None

    return _profile_public(_get_profile_or_404(db, profile.id))


@router.get("/student-profiles/{profile_id}", response_model=StudentProfilePublic)
def get_student_profile(
    profile_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> StudentProfilePublic:
    return _profile_public(_get_profile_or_404(db, profile_id))


@router.patch("/student-profiles/{profile_id}", response_model=StudentProfilePublic)
def update_student_profile(
    profile_id: UUID,
    body: StudentProfileUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> StudentProfilePublic:
    profile = _get_profile_or_404(db, profile_id)
    data = body.model_dump(exclude_unset=True)
    if "student_number" in data and data["student_number"] is not None:
        profile.student_number = data["student_number"].strip()
    if "status" in data and data["status"] is not None:
        profile.status = data["status"].strip() or profile.status
    if "entry_date" in data:
        profile.entry_date = data["entry_date"]
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Matricule déjà utilisé ou contrainte d’unicité violée.",
        ) from None
    return _profile_public(_get_profile_or_404(db, profile.id))


@router.post(
    "/enrollments",
    response_model=EnrollmentAdminPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_enrollment(
    body: EnrollmentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> EnrollmentAdminPublic:
    profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.id == body.student_profile_id,
            StudentProfile.deleted_at.is_(None),
        )
        .first()
    )
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil étudiant introuvable.",
        )

    program = (
        db.query(Program)
        .filter(Program.id == body.program_id, Program.deleted_at.is_(None))
        .first()
    )
    if program is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Programme introuvable.",
        )

    year = (
        db.query(AcademicYear)
        .filter(AcademicYear.id == body.academic_year_id)
        .first()
    )
    if year is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Année académique introuvable.",
        )

    level = None
    if body.program_level_id is not None:
        level = (
            db.query(ProgramLevel)
            .filter(ProgramLevel.id == body.program_level_id)
            .first()
        )
        if level is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Niveau d’études introuvable.",
            )

    if body.status not in _ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Statut d’inscription invalide.",
        )

    enrollment = Enrollment(
        student_profile_id=profile.id,
        program_id=program.id,
        academic_year_id=year.id,
        program_level_id=level.id if level else None,
        status=body.status,
        kind=body.kind.strip() if body.kind else None,
        enrolled_on=body.enrolled_on,
    )
    db.add(enrollment)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Une inscription existe déjà pour cet étudiant, "
                "ce programme et cette année (unicité A)."
            ),
        ) from None

    return _enrollment_public(_get_enrollment_or_404(db, enrollment.id))


@router.get("/enrollments/{enrollment_id}", response_model=EnrollmentAdminPublic)
def get_enrollment(
    enrollment_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> EnrollmentAdminPublic:
    return _enrollment_public(_get_enrollment_or_404(db, enrollment_id))


@router.patch("/enrollments/{enrollment_id}", response_model=EnrollmentAdminPublic)
def update_enrollment(
    enrollment_id: UUID,
    body: EnrollmentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(_ADMIN)),
) -> EnrollmentAdminPublic:
    row = _get_enrollment_or_404(db, enrollment_id)
    data = body.model_dump(exclude_unset=True)
    if "status" in data and data["status"] is not None:
        if data["status"] not in _ALLOWED_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Statut d’inscription invalide.",
            )
        row.status = data["status"]
    if "kind" in data:
        raw = data["kind"]
        row.kind = raw.strip() if raw else None
    if "program_level_id" in data:
        level_id = data["program_level_id"]
        if level_id is None:
            row.program_level_id = None
        else:
            level = (
                db.query(ProgramLevel)
                .filter(ProgramLevel.id == level_id)
                .first()
            )
            if level is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Niveau d’études introuvable.",
                )
            row.program_level_id = level.id
    if "enrolled_on" in data:
        row.enrolled_on = data["enrolled_on"]
    if "closed_on" in data:
        row.closed_on = data["closed_on"]
    db.commit()
    return _enrollment_public(_get_enrollment_or_404(db, row.id))
