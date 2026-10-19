"""E3 — index uniques partiels pour soft-delete (actifs seulement).

Revision ID: 20260419_0004
Revises: 20260418_0003
Create Date: 2026-04-19

"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260419_0004"
down_revision: Union[str, None] = "20260418_0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _drop_unique(table: str, *names: str) -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing = {c["name"] for c in inspector.get_unique_constraints(table)}
    for name in names:
        if name in existing:
            op.drop_constraint(name, table, type_="unique")


def upgrade() -> None:
    _drop_unique("enrollments", "uq_enrollments_student_program_year")
    op.create_index(
        "uq_enrollments_student_program_year_active",
        "enrollments",
        ["student_profile_id", "program_id", "academic_year_id"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
    )

    _drop_unique(
        "student_profiles",
        "student_profiles_person_id_key",
        "student_profiles_student_number_key",
        "uq_student_profiles_person_id",
        "uq_student_profiles_student_number",
    )
    op.create_index(
        "uq_student_profiles_person_active",
        "student_profiles",
        ["person_id"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
    )
    op.create_index(
        "uq_student_profiles_number_active",
        "student_profiles",
        ["student_number"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
    )

    _drop_unique("programs", "programs_code_key", "uq_programs_code")
    op.create_index(
        "uq_programs_code_active",
        "programs",
        ["code"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
    )


def downgrade() -> None:
    op.drop_index("uq_programs_code_active", table_name="programs")
    op.create_unique_constraint("programs_code_key", "programs", ["code"])

    op.drop_index("uq_student_profiles_number_active", table_name="student_profiles")
    op.drop_index("uq_student_profiles_person_active", table_name="student_profiles")
    op.create_unique_constraint(
        "student_profiles_student_number_key", "student_profiles", ["student_number"]
    )
    op.create_unique_constraint(
        "student_profiles_person_id_key", "student_profiles", ["person_id"]
    )

    op.drop_index(
        "uq_enrollments_student_program_year_active", table_name="enrollments"
    )
    op.create_unique_constraint(
        "uq_enrollments_student_program_year",
        "enrollments",
        ["student_profile_id", "program_id", "academic_year_id"],
    )
