"""Dossier portail — lecture seule, identité réelle + section académique non encore provisionnée."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.person import PersonPublic


class AcademicDossierSection(BaseModel):
    """
    Placeholder explicite : pas d’inscriptions / notes tant que le modèle UWB
    n’est pas validé (D-015, D-022, Q32–Q34).
    """

    status: Literal["not_provisioned"] = "not_provisioned"
    message: str = Field(
        default=(
            "Les données académiques (inscriptions, année, programme, notes) "
            "ne sont pas encore enregistrées dans SIGU. Aucune information "
            "fictive n’est affichée."
        )
    )
    enrollments: list[dict] = Field(default_factory=list)


class DossierPublic(BaseModel):
    """Dossier du compte authentifié uniquement (jamais un person_id client)."""

    person: PersonPublic | None
    academic: AcademicDossierSection
