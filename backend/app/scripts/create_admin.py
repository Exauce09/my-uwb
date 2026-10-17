"""
Création ponctuelle d’un compte administrateur.

Usage (depuis backend/, venv activé) :
  set SIGU_BOOTSTRAP_EMAIL=...
  set SIGU_BOOTSTRAP_PASSWORD=...
  python -m app.scripts.create_admin

Prérequis : schéma appliqué via Alembic (`alembic upgrade head`).
Ce script ne crée jamais les tables ; il refuse de démarrer si le schéma manque.

Aucun mot de passe par défaut. Les variables ne doivent pas rester dans .env.
"""

from __future__ import annotations

import os
import sys

from sqlalchemy import inspect
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import get_engine
from app.models import Role, RoleName, User
from app.security.passwords import hash_password

# Tables / colonnes requises (alignées sur la migration E1 et les modèles).
REQUIRED_SCHEMA: dict[str, frozenset[str]] = {
    "users": frozenset(
        {
            "id",
            "email",
            "hashed_password",
            "full_name",
            "is_active",
            "created_at",
            "updated_at",
        }
    ),
    "roles": frozenset({"id", "name", "description", "created_at"}),
    "user_roles": frozenset({"user_id", "role_id"}),
}


class SchemaNotReadyError(RuntimeError):
    """Le schéma attendu n’est pas présent — migrations Alembic requises."""


def ensure_required_schema(engine: Engine) -> None:
    """Vérifie la présence des tables E1 sans les créer."""
    insp = inspect(engine)
    existing_tables = set(insp.get_table_names())
    missing_tables = [
        name for name in REQUIRED_SCHEMA if name not in existing_tables
    ]
    if missing_tables:
        raise SchemaNotReadyError(
            "Schéma absent ou incomplet : tables manquantes "
            f"({', '.join(missing_tables)}). "
            "Appliquez les migrations Alembic (`alembic upgrade head`) "
            "avant de créer un administrateur."
        )

    for table_name, required_cols in REQUIRED_SCHEMA.items():
        present = {col["name"] for col in insp.get_columns(table_name)}
        missing_cols = sorted(required_cols - present)
        if missing_cols:
            raise SchemaNotReadyError(
                f"Schéma incomplet : colonnes manquantes sur `{table_name}` "
                f"({', '.join(missing_cols)}). "
                "Appliquez les migrations Alembic (`alembic upgrade head`)."
            )


def bootstrap_admin(db: Session, email: str, password: str) -> None:
    """
    Crée le compte administrateur.

    Lève ValueError si l’e-mail existe déjà (pas de doublon).
    """
    if db.query(User).filter(User.email == email).first():
        raise ValueError("un compte avec cet e-mail existe déjà")

    admin_role = db.query(Role).filter(Role.name == RoleName.admin.value).first()
    if admin_role is None:
        admin_role = Role(name=RoleName.admin.value, description="Administrateur")
        db.add(admin_role)
        db.flush()

    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name="Administrateur",
        roles=[admin_role],
    )
    db.add(user)
    db.commit()


def run_bootstrap(engine: Engine, email: str, password: str) -> int:
    """Point d’entrée testable : retourne un code de sortie processus."""
    try:
        ensure_required_schema(engine)
    except SchemaNotReadyError as exc:
        print(f"Erreur : {exc}", file=sys.stderr)
        return 1

    session_factory = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    db = session_factory()
    try:
        try:
            bootstrap_admin(db, email=email, password=password)
        except ValueError as exc:
            # Message sans secret ; pas de détail d’e-mail superflu en prod si besoin —
            # on conserve le message métier actuel.
            print(f"Erreur : {exc}.", file=sys.stderr)
            return 1
        print("Compte administrateur créé.")
        return 0
    finally:
        db.close()


def _read_bootstrap_credentials() -> tuple[str, str] | None:
    """Lit email/mot de passe depuis l’environnement. None si incomplets."""
    email = os.environ.get("SIGU_BOOTSTRAP_EMAIL", "").strip().lower()
    password = os.environ.get("SIGU_BOOTSTRAP_PASSWORD", "")
    if not email or not password:
        return None
    return email, password


def main() -> int:
    credentials = _read_bootstrap_credentials()
    if credentials is None:
        print(
            "Erreur : définir SIGU_BOOTSTRAP_EMAIL et SIGU_BOOTSTRAP_PASSWORD "
            "uniquement pour cette exécution.",
            file=sys.stderr,
        )
        return 1

    email, password = credentials
    if len(password) < 8:
        print("Erreur : mot de passe trop court (min. 8).", file=sys.stderr)
        return 1

    return run_bootstrap(get_engine(), email=email, password=password)


if __name__ == "__main__":
    raise SystemExit(main())
