"""Schémas Pydantic — Person (identité). Aucune route API dans cette étape."""

from __future__ import annotations

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class PersonPublic(BaseModel):
    """Réponse sûre — identité Person (pas de lien User obligatoire)."""

    id: UUID
    last_name: str
    first_name: str
    other_names: str | None
    email: EmailStr | None
    phone: str | None
    birth_date: date | None
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = {"from_attributes": True}


class PersonCreate(BaseModel):
    """Création d’une personne (V1 : last_name / first_name obligatoires)."""

    last_name: str = Field(min_length=1, max_length=100)
    first_name: str = Field(min_length=1, max_length=100)
    other_names: str | None = Field(default=None, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    birth_date: date | None = None


class PersonUpdate(BaseModel):
    """Mise à jour partielle — tous les champs optionnels."""

    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    other_names: str | None = Field(default=None, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    birth_date: date | None = None


class PersonListResponse(BaseModel):
    items: list[PersonPublic]
    total: int
    page: int
    page_size: int
