"""
Peuple le référentiel E3 V1 (unités verified, niveaux formulaire, année 2026-2027).

Usage (backend/, venv, env PG test) :
  python -m app.scripts.seed_academic_e3_catalog

Idempotent : ignore si le code existe déjà. Aucune note / inscription étudiant.
"""

from __future__ import annotations

import sys

from sqlalchemy.orm import sessionmaker

from app.database import get_engine
from app.models import AcademicUnit, AcademicYear, Program, ProgramLevel

_UNITS: list[tuple[str, str, str, str, str]] = [
    # code_unit, name, kind, code_program, title_program
    (
        "INFO_IA",
        "Faculté des Sciences Informatiques & Intelligence Artificielle",
        "faculte",
        "INFO_IA_CURSUS",
        "Cursus en Sciences Informatiques & IA",
    ),
    (
        "SIC",
        "Faculté de Science de l’Information et de la Communication",
        "faculte",
        "SIC_CURSUS",
        "Cursus en Sciences de l’Information et de la Communication",
    ),
    (
        "ECO_GEST",
        "Faculté des Sciences Économiques et de Gestion",
        "faculte",
        "ECO_GEST_CURSUS",
        "Cursus en Sciences Économiques et de Gestion",
    ),
    (
        "MED",
        "Faculté de Médecine",
        "faculte",
        "MED_CURSUS",
        "Cursus de Médecine",
    ),
    (
        "DROIT",
        "Faculté de Droit",
        "faculte",
        "DROIT_CURSUS",
        "Cursus en Droit",
    ),
    (
        "THEO",
        "Faculté de Théologie",
        "faculte",
        "THEO_CURSUS",
        "Cursus en Théologie",
    ),
    (
        "ISTM",
        "Institut Supérieur des Techniques Médicales",
        "institut",
        "ISTM_CURSUS",
        "Formations en techniques médicales",
    ),
]

_LEVELS: list[tuple[str, str, int]] = [
    ("L1_LMD", "L1 LMD", 1),
    ("L2_LMD", "L2 LMD", 2),
    ("L3_LMD", "L3 LMD", 3),
    ("L1_ANC", "L1 ANCIEN SYSTEME", 4),
    ("L2_ANC", "L2 ANCIEN SYSTEME", 5),
    ("MASTER_COMP", "MASTER COMPLÉMENTAIRE", 6),
    ("MASTER_1", "MASTER 1", 7),
    ("MASTER_2", "MASTER 2", 8),
]


def main() -> int:
    Session = sessionmaker(bind=get_engine(), autocommit=False, autoflush=False)
    db = Session()
    try:
        for code, label, order in _LEVELS:
            if db.query(ProgramLevel).filter(ProgramLevel.code == code).first():
                continue
            db.add(ProgramLevel(code=code, label=label, sort_order=order))

        if not db.query(AcademicYear).filter(AcademicYear.label == "2026-2027").first():
            db.add(AcademicYear(label="2026-2027", is_current=True))

        for unit_code, name, kind, prog_code, prog_title in _UNITS:
            unit = db.query(AcademicUnit).filter(AcademicUnit.code == unit_code).first()
            if unit is None:
                unit = AcademicUnit(code=unit_code, name=name, kind=kind)
                db.add(unit)
                db.flush()
            if not db.query(Program).filter(Program.code == prog_code).first():
                db.add(
                    Program(
                        academic_unit_id=unit.id,
                        code=prog_code,
                        title=prog_title,
                    )
                )

        db.commit()
        print("Référentiel E3 V1 peuplé (idempotent).")
        return 0
    except Exception as exc:  # noqa: BLE001 — script CLI
        db.rollback()
        print(f"Erreur : {exc}", file=sys.stderr)
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
