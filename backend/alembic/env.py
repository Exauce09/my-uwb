"""Alembic — URL lue depuis SIGU_DATABASE_URL (jamais de secret en dur)."""

from __future__ import annotations

import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.database import Base
from app.models import Person, Role, User  # noqa: F401 — metadata (pas de migration Module 2 ici)


config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    url = os.environ.get("SIGU_DATABASE_URL")
    if not url:
        raise RuntimeError(
            "SIGU_DATABASE_URL est requis pour les migrations Alembic."
        )
    # Garde-fou optionnel : base de test SIGU uniquement (campagne I1 / CI).
    from app.db_url_guard import (
        DatabaseUrlGuardError,
        require_test_db_for_migration_if_configured,
    )

    try:
        require_test_db_for_migration_if_configured()
    except DatabaseUrlGuardError as exc:
        raise RuntimeError(str(exc)) from exc
    return url


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url = get_url()
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = url
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
