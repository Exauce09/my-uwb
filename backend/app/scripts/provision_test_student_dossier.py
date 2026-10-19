"""
Provisionne un dossier étudiant synthétique (StudentProfile + Enrollment) — base test uniquement.

Usage (backend/, venv) :
  .\\_pg_test_env.ps1
  python -m app.scripts.provision_test_student_dossier

Variables optionnelles :
  SIGU_E3_TEST_EMAIL          (défaut : student@example.com)
  SIGU_E3_TEST_MATRICULE      (défaut : TEST-E3-001)
  SIGU_E3_TEST_PROGRAM_CODE   (défaut : INFO_IA_CURSUS)
  SIGU_E3_TEST_YEAR_LABEL     (défaut : 2026-2027 — année synthétique de test)
  SIGU_E3_TEST_LEVEL_CODE     (défaut : L1_LMD)

Refuse toute écriture si SIGU_DATABASE_URL / SIGU_TEST_DATABASE_URL n’est pas sigu_test_*.
Idempotent. Aucune note. Ne journalise jamais mot de passe ni jeton.
"""

from __future__ import annotations

import os
import sys

from sqlalchemy.orm import Session, joinedload, sessionmaker

from app.database import get_engine
from app.db_url_guard import (
    DatabaseUrlGuardError,
    assert_sigu_test_database_url,
    redact_database_url,
)
from app.models import (
    AcademicYear,
    Enrollment,
    Program,
    ProgramLevel,
    Role,
    RoleName,
    StudentProfile,
    User,
)

_DEFAULT_EMAIL = "student@example.com"
_DEFAULT_MATRICULE = "TEST-E3-001"
_DEFAULT_PROGRAM = "INFO_IA_CURSUS"
_DEFAULT_YEAR = "2026-2027"
_DEFAULT_LEVEL = "L1_LMD"


def _require_test_engine_url() -> str:
    raw = (
        os.environ.get("SIGU_TEST_DATABASE_URL", "").strip()
        or os.environ.get("SIGU_DATABASE_URL", "").strip()
    )
    if not raw:
        raise DatabaseUrlGuardError(
            "SIGU_TEST_DATABASE_URL ou SIGU_DATABASE_URL requis."
        )
    target = assert_sigu_test_database_url(raw)
    if target.host not in {"127.0.0.1", "localhost"}:
        raise DatabaseUrlGuardError(
            "Hôte refusé pour le provisionnement E3 test (127.0.0.1 / localhost)."
        )
    if target.port not in {5434, None}:
        # Port explicite hors cluster de test local documenté.
        if target.port != 5434:
            raise DatabaseUrlGuardError(
                "Port refusé : provisionnement limité au cluster de test (5434)."
            )
    print(f"cible_ok {redact_database_url(raw)}")
    print(f"database {target.database} host {target.host} port {target.port}")
    return raw


def _find_student(db: Session, email: str) -> User:
    user = (
        db.query(User)
        .options(joinedload(User.roles))
        .filter(User.email == email)
        .first()
    )
    if user is None:
        raise ValueError(
            f"Compte introuvable ({email}). Créez-le via create_portal_user "
            "avant le provisionnement E3."
        )
    if RoleName.student.value not in user.role_names():
        raise ValueError(f"Le compte {email} n’a pas le rôle student.")
    if user.person_id is None:
        raise ValueError(
            f"Le compte {email} n’a pas de Person liée (users.person_id)."
        )
    if not user.is_active:
        raise ValueError(f"Le compte {email} est inactif.")
    return user


def provision(
    db: Session,
    *,
    email: str,
    matricule: str,
    program_code: str,
    year_label: str,
    level_code: str,
) -> dict[str, str]:
    user = _find_student(db, email)
    assert user.person_id is not None

    program = (
        db.query(Program)
        .filter(Program.code == program_code, Program.deleted_at.is_(None))
        .first()
    )
    if program is None:
        raise ValueError(
            f"Programme {program_code} absent — exécutez seed_academic_e3_catalog."
        )

    year = db.query(AcademicYear).filter(AcademicYear.label == year_label).first()
    if year is None:
        year = AcademicYear(label=year_label, is_current=True)
        db.add(year)
        db.flush()
        year_action = "created_synthetic"
    else:
        year_action = "reused"

    level = db.query(ProgramLevel).filter(ProgramLevel.code == level_code).first()
    if level is None:
        raise ValueError(
            f"Niveau {level_code} absent — exécutez seed_academic_e3_catalog."
        )

    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.person_id == user.person_id)
        .first()
    )
    if profile is None:
        other = (
            db.query(StudentProfile)
            .filter(StudentProfile.student_number == matricule)
            .first()
        )
        if other is not None:
            raise ValueError(
                f"Matricule {matricule} déjà utilisé par un autre profil."
            )
        profile = StudentProfile(
            person_id=user.person_id,
            student_number=matricule,
            status="active",
        )
        db.add(profile)
        db.flush()
        profile_action = "created"
    else:
        profile_action = "reused"
        if profile.student_number != matricule:
            # Ne pas écraser un matricule existant différent — signaler.
            raise ValueError(
                f"Profil déjà présent avec matricule {profile.student_number} "
                f"(attendu {matricule})."
            )

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_profile_id == profile.id,
            Enrollment.program_id == program.id,
            Enrollment.academic_year_id == year.id,
            Enrollment.deleted_at.is_(None),
        )
        .first()
    )
    if enrollment is None:
        enrollment = Enrollment(
            student_profile_id=profile.id,
            program_id=program.id,
            academic_year_id=year.id,
            program_level_id=level.id,
            status="active",
            kind="initial",
        )
        db.add(enrollment)
        enrollment_action = "created"
    else:
        enrollment_action = "reused"

    db.commit()
    return {
        "email": email,
        "matricule": profile.student_number,
        "program": program.code,
        "year": year.label,
        "year_action": year_action,
        "profile_action": profile_action,
        "enrollment_action": enrollment_action,
        "enrollment_id": str(enrollment.id),
    }


def main() -> int:
    try:
        _require_test_engine_url()
    except DatabaseUrlGuardError as exc:
        print(f"Erreur garde-fou : {exc}", file=sys.stderr)
        return 1

    email = os.environ.get("SIGU_E3_TEST_EMAIL", _DEFAULT_EMAIL).strip().lower()
    matricule = os.environ.get("SIGU_E3_TEST_MATRICULE", _DEFAULT_MATRICULE).strip()
    program_code = os.environ.get(
        "SIGU_E3_TEST_PROGRAM_CODE", _DEFAULT_PROGRAM
    ).strip()
    year_label = os.environ.get("SIGU_E3_TEST_YEAR_LABEL", _DEFAULT_YEAR).strip()
    level_code = os.environ.get("SIGU_E3_TEST_LEVEL_CODE", _DEFAULT_LEVEL).strip()

    SessionLocal = sessionmaker(bind=get_engine(), autocommit=False, autoflush=False)
    db = SessionLocal()
    try:
        result = provision(
            db,
            email=email,
            matricule=matricule,
            program_code=program_code,
            year_label=year_label,
            level_code=level_code,
        )
        print("provision_ok")
        for key, value in result.items():
            print(f"{key}={value}")
        return 0
    except ValueError as exc:
        db.rollback()
        print(f"Erreur : {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001
        db.rollback()
        print(f"Erreur inattendue : {type(exc).__name__}", file=sys.stderr)
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
