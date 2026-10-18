"""Dossier portail — lecture seule, identité + inscriptions E3 (sans notes)."""

from __future__ import annotations

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.person import PersonPublic


class EnrollmentPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: str
    kind: str | None = None
    academic_year_label: str
    program_code: str
    program_title: str
    academic_unit_name: str
    program_level_code: str | None = None
    program_level_label: str | None = None


class AcademicDossierSection(BaseModel):
    """
    - not_provisioned : pas de StudentProfile lié
    - empty : profil présent, aucune inscription non supprimée
    - ready : au moins une inscription
    Notes / délibérations : hors périmètre (D-015).
    """

    status: Literal["not_provisioned", "empty", "ready"]
    message: str
    student_number: str | None = None
    enrollments: list[EnrollmentPublic] = Field(default_factory=list)


class DossierPublic(BaseModel):
    """Dossier du compte authentifié uniquement (jamais un person_id client)."""

    person: PersonPublic | None
    academic: AcademicDossierSection
