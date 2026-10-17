"""Configuration centralisée via variables d’environnement (préfixe SIGU_)."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="SIGU_",
        extra="ignore",
    )

    secret_key: str = Field(
        ...,
        min_length=32,
        description="Clé de signature JWT — jamais de valeur par défaut en code.",
    )
    database_url: str = Field(
        ...,
        description="URL SQLAlchemy PostgreSQL (postgresql+psycopg://...).",
    )
    environment: Literal["development", "staging", "production"] = "development"

    access_cookie_name: str = "sigu_access"
    access_token_expire_minutes: int = 60
    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    cors_origins: str = (
        "http://localhost:5173,http://localhost:5174,http://localhost:5175,"
        "http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175"
    )

    # Limitation des tentatives de login (mémoire processus — voir README).
    login_rate_limit_attempts: int = Field(
        default=5,
        ge=0,
        description="Nombre max d’échecs par clé dans la fenêtre (0 = désactivé).",
    )
    login_rate_limit_window_seconds: int = Field(
        default=60,
        ge=1,
        description="Fenêtre glissante en secondes pour compter les échecs.",
    )

    @field_validator("secret_key")
    @classmethod
    def reject_placeholder_secret(cls, value: str) -> str:
        lowered = value.strip().lower()
        if lowered in {"", "change_me", "changeme", "secret", "dev"}:
            raise ValueError("SIGU_SECRET_KEY doit être une clé aléatoire dédiée.")
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
