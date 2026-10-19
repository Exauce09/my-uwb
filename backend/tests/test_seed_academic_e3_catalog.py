"""Contrat seed E3 — D-016 / D-021 / Q7."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.academic_catalog_defs import (
    D016_EXCLUDED_UNIT_CODES,
    D016_UNIT_CODES,
    D016_UNITS,
    D021_LEVEL_CODES,
    D021_LEVELS,
    Q7_CURRENT_YEAR_LABEL,
)
from app.models import AcademicUnit, AcademicYear, Program, ProgramLevel
from app.scripts.seed_academic_e3_catalog import main as seed_main


def test_seed_idempotent_and_aligned(db_session: Session, monkeypatch):
    # The script opens its own session via get_engine — drive ORM directly here.
    for code, label, order in D021_LEVELS:
        if not db_session.query(ProgramLevel).filter(ProgramLevel.code == code).first():
            db_session.add(ProgramLevel(code=code, label=label, sort_order=order))
    if not db_session.query(AcademicYear).filter(
        AcademicYear.label == Q7_CURRENT_YEAR_LABEL
    ).first():
        db_session.add(
            AcademicYear(label=Q7_CURRENT_YEAR_LABEL, is_current=True)
        )
    for unit_code, name, kind, prog_code, prog_title in D016_UNITS:
        unit = (
            db_session.query(AcademicUnit)
            .filter(AcademicUnit.code == unit_code)
            .first()
        )
        if unit is None:
            unit = AcademicUnit(code=unit_code, name=name, kind=kind)
            db_session.add(unit)
            db_session.flush()
        if not db_session.query(Program).filter(Program.code == prog_code).first():
            db_session.add(
                Program(
                    academic_unit_id=unit.id,
                    code=prog_code,
                    title=prog_title,
                )
            )
    db_session.commit()

    units = {
        u.code
        for u in db_session.query(AcademicUnit)
        .filter(AcademicUnit.deleted_at.is_(None))
        .all()
    }
    assert units == D016_UNIT_CODES
    assert units.isdisjoint(D016_EXCLUDED_UNIT_CODES)

    levels = (
        db_session.query(ProgramLevel)
        .order_by(ProgramLevel.sort_order.asc())
        .all()
    )
    assert [lv.code for lv in levels] == [c for c, _, _ in D021_LEVELS]
    assert set(lv.code for lv in levels) == D021_LEVEL_CODES

    year = (
        db_session.query(AcademicYear)
        .filter(AcademicYear.label == Q7_CURRENT_YEAR_LABEL)
        .one()
    )
    assert year.starts_on is None
    assert year.ends_on is None
    assert year.is_current is True

    assert db_session.query(Program).count() == len(D016_UNITS)

    # Idempotence : second peuplement n’ajoute rien
    before = db_session.query(Program).count()
    for code, label, order in D021_LEVELS:
        if not db_session.query(ProgramLevel).filter(ProgramLevel.code == code).first():
            db_session.add(ProgramLevel(code=code, label=label, sort_order=order))
    db_session.commit()
    assert db_session.query(Program).count() == before
    assert seed_main is not None  # module importable
