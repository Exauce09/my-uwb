"""Compte utilisateur — pas de données métier étudiant/finance dans E1."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.role import Role, user_roles

if TYPE_CHECKING:
    from app.models.person import Person


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
        UniqueConstraint("person_id", name="uq_users_person_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Lien optionnel vers Person (SoT identité). NULL = compte sans personne (ex. admin).
    # Nom FK aligné sur la migration 20260417_0002 (`fk_users_person_id_persons`).
    person_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey(
            "persons.id",
            name="fk_users_person_id_persons",
            ondelete="SET NULL",
        ),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    roles: Mapped[list[Role]] = relationship(
        secondary=user_roles, back_populates="users"
    )
    person: Mapped[Person | None] = relationship(
        back_populates="user",
    )

    def role_names(self) -> set[str]:
        return {role.name for role in self.roles}
