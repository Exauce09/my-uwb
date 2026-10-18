"""Référentiel académique E3 V1 — inscriptions annuelles (sans notes / sans course_registrations)."""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.person import Person


class EnrollmentStatus(str, enum.Enum):
    """Statuts Q8 — liste technique adoptée (intérimaire)."""

    draft = "draft"
    active = "active"
    completed = "completed"
    withdrawn = "withdrawn"
    cancelled = "cancelled"
    deferred = "deferred"


class AcademicUnit(Base):
    __tablename__ = "academic_units"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    kind: Mapped[str] = mapped_column(String(32), nullable=False, default="faculte")
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    programs: Mapped[list[Program]] = relationship(back_populates="academic_unit")


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    academic_unit_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_units.id", ondelete="RESTRICT"),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    cycle: Mapped[str | None] = mapped_column(String(64), nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    academic_unit: Mapped[AcademicUnit] = relationship(back_populates="programs")
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="program")


class AcademicYear(Base):
    __tablename__ = "academic_years"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    label: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    starts_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    ends_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="academic_year")


class ProgramLevel(Base):
    __tablename__ = "program_levels"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    sort_order: Mapped[int] = mapped_column(nullable=False, default=0)

    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="program_level")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    person_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("persons.id", ondelete="RESTRICT"),
        unique=True,
        nullable=False,
    )
    # D-029 : unicité globale ; format libre (pas de CHECK masque).
    student_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="active")
    entry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
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

    person: Mapped[Person] = relationship()
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="student_profile")


class Enrollment(Base):
    """Inscription académique annuelle — unicité D-022 option A."""

    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint(
            "student_profile_id",
            "program_id",
            "academic_year_id",
            name="uq_enrollments_student_program_year",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )
    program_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("programs.id", ondelete="RESTRICT"),
        nullable=False,
    )
    academic_year_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_years.id", ondelete="RESTRICT"),
        nullable=False,
    )
    program_level_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("program_levels.id", ondelete="SET NULL"),
        nullable=True,
    )
    kind: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, default=EnrollmentStatus.active.value
    )
    enrolled_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    closed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
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

    student_profile: Mapped[StudentProfile] = relationship(back_populates="enrollments")
    program: Mapped[Program] = relationship(back_populates="enrollments")
    academic_year: Mapped[AcademicYear] = relationship(back_populates="enrollments")
    program_level: Mapped[ProgramLevel | None] = relationship(
        back_populates="enrollments"
    )
