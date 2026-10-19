"""
Peuple le référentiel E3 V1 (unités verified, niveaux formulaire, année 2026-2027).

Usage (backend/, venv, env PG test) :
  python -m app.scripts.seed_academic_e3_catalog

Idempotent : ignore si le code existe déjà. Aucune note / inscription étudiant.
"""

from __future__ import annotations

import sys

from sqlalchemy.orm import sessionmaker

from app.academic_catalog_defs import (
    D016_UNITS,
    D021_LEVELS,
    Q7_CURRENT_YEAR_LABEL,
)
from app.database import get_engine
from app.models import AcademicUnit, AcademicYear, Program, ProgramLevel


def main() -> int:
    Session = sessionmaker(bind=get_engine(), autocommit=False, autoflush=False)
    db = Session()
    try:
        for code, label, order in D021_LEVELS:
            if db.query(ProgramLevel).filter(ProgramLevel.code == code).first():
                continue
            db.add(ProgramLevel(code=code, label=label, sort_order=order))

        if not db.query(AcademicYear).filter(
            AcademicYear.label == Q7_CURRENT_YEAR_LABEL
        ).first():
            db.add(AcademicYear(label=Q7_CURRENT_YEAR_LABEL, is_current=True))

        for unit_code, name, kind, prog_code, prog_title in D016_UNITS:
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
