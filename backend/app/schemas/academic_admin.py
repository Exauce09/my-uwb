"""Schémas admin E3 — profils étudiants et inscriptions (sans notes)."""

from __future__ import annotations

from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.academic import EnrollmentStatus
from app.schemas.person import PersonPublic

_ENROLLMENT_STATUSES = tuple(s.value for s in EnrollmentStatus)


class ProgramRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    title: str
    academic_unit_name: str


class AcademicYearRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    label: str
    starts_on: date | None
    ends_on: date | None
    is_current: bool


class ProgramLevelRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    label: str
    sort_order: int


class EnrollmentAdminPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_profile_id: UUID
    status: str
    kind: str | None
    enrolled_on: date | None
    closed_on: date | None
    program: ProgramRef
    academic_year: AcademicYearRef
    program_level: ProgramLevelRef | None
    created_at: datetime
    updated_at: datetime


class StudentProfilePublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    student_number: str
    status: str
    entry_date: date | None
    person: PersonPublic
    enrollments: list[EnrollmentAdminPublic] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None


class StudentProfileListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    student_number: str
    status: str
    entry_date: date | None
    person_last_name: str
    person_first_name: str
    person_email: str | None
    enrollment_count: int


class StudentProfileListResponse(BaseModel):
    items: list[StudentProfileListItem]
    total: int
    page: int
    page_size: int


class StudentProfileCreate(BaseModel):
    person_id: UUID
    student_number: str = Field(min_length=1, max_length=64)
    status: str = Field(default="active", max_length=32)
    entry_date: date | None = None


class StudentProfileUpdate(BaseModel):
    student_number: str | None = Field(default=None, min_length=1, max_length=64)
    status: str | None = Field(default=None, max_length=32)
    entry_date: date | None = None


class EnrollmentCreate(BaseModel):
    student_profile_id: UUID
    program_id: UUID
    academic_year_id: UUID
    program_level_id: UUID | None = None
    status: Literal[
        "draft",
        "active",
        "completed",
        "withdrawn",
        "cancelled",
        "deferred",
    ] = "active"
    kind: str | None = Field(default=None, max_length=32)
    enrolled_on: date | None = None


class EnrollmentUpdate(BaseModel):
    status: (
        Literal[
            "draft",
            "active",
            "completed",
            "withdrawn",
            "cancelled",
            "deferred",
        ]
        | None
    ) = None
    kind: str | None = Field(default=None, max_length=32)
    program_id: UUID | None = None
    academic_year_id: UUID | None = None
    program_level_id: UUID | None = None
    enrolled_on: date | None = None
    closed_on: date | None = None


class CatalogLists(BaseModel):
    programs: list[ProgramRef]
    academic_years: list[AcademicYearRef]
    program_levels: list[ProgramLevelRef]


class AcademicUnitRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    name: str
    kind: str


class ProgramPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    title: str
    cycle: str | None
    academic_unit_id: UUID
    academic_unit_code: str
    academic_unit_name: str
    deleted_at: datetime | None


class ProgramListResponse(BaseModel):
    items: list[ProgramPublic]
    total: int
    page: int
    page_size: int


class ProgramCreate(BaseModel):
    academic_unit_id: UUID
    code: str = Field(min_length=1, max_length=64)
    title: str = Field(min_length=1, max_length=255)
    cycle: str | None = Field(default=None, max_length=64)


class ProgramUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=64)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    cycle: str | None = Field(default=None, max_length=64)
    academic_unit_id: UUID | None = None


class AcademicYearPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    label: str
    starts_on: date | None
    ends_on: date | None
    is_current: bool


class AcademicYearListResponse(BaseModel):
    items: list[AcademicYearPublic]
    total: int
    page: int
    page_size: int


class AcademicYearCreate(BaseModel):
    label: str = Field(min_length=1, max_length=32)
    starts_on: date | None = None
    ends_on: date | None = None
    is_current: bool = False


class AcademicYearUpdate(BaseModel):
    label: str | None = Field(default=None, min_length=1, max_length=32)
    starts_on: date | None = None
    ends_on: date | None = None
    is_current: bool | None = None


class ProgramLevelPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    label: str
    sort_order: int


class ProgramLevelListResponse(BaseModel):
    items: list[ProgramLevelPublic]
    total: int


class ProgramLevelCreate(BaseModel):
    code: str = Field(min_length=1, max_length=32)
    label: str = Field(min_length=1, max_length=100)
    sort_order: int = Field(default=0, ge=0, le=9999)


class ProgramLevelUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=32)
    label: str | None = Field(default=None, min_length=1, max_length=100)
    sort_order: int | None = Field(default=None, ge=0, le=9999)
