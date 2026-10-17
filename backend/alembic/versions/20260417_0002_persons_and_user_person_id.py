"""persons table and users.person_id (Module 2 V1)

Revision ID: 20260417_0002
Revises: 20260417_0001
Create Date: 2026-10-17

Migration additive : crée `persons` et le lien nullable `users.person_id`.
Ne modifie pas les tables E1 existantes au-delà de l’ajout de colonne.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260417_0002"
down_revision: Union[str, None] = "20260417_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "persons",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("other_names", sa.String(length=200), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("users", sa.Column("person_id", sa.Uuid(), nullable=True))
    op.create_unique_constraint("uq_users_person_id", "users", ["person_id"])
    op.create_foreign_key(
        "fk_users_person_id_persons",
        "users",
        "persons",
        ["person_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_person_id_persons", "users", type_="foreignkey")
    op.drop_constraint("uq_users_person_id", "users", type_="unique")
    op.drop_column("users", "person_id")
    op.drop_table("persons")
