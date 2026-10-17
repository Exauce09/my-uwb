from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserPublic(BaseModel):
    """Réponse sûre — jamais de mot de passe ni de secret."""

    id: UUID
    email: EmailStr
    full_name: str | None
    is_active: bool
    roles: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    """Création réservée aux administrateurs (pas d’auto-inscription publique)."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str | None = Field(default=None, max_length=200)
    roles: list[str] = Field(default_factory=list)


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserRoleAssign(BaseModel):
    role: str = Field(min_length=1, max_length=32)


class UserListResponse(BaseModel):
    items: list[UserPublic]
    total: int
    page: int
    page_size: int
