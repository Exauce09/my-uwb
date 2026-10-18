"""
Création ponctuelle d’un compte portail (student | teacher) lié à une Person.

Usage (depuis backend/, venv activé) :
  set SIGU_BOOTSTRAP_EMAIL=...
  set SIGU_BOOTSTRAP_PASSWORD=...
  set SIGU_BOOTSTRAP_ROLE=student
  set SIGU_BOOTSTRAP_FULL_NAME=Jean Dupont
  set SIGU_BOOTSTRAP_FIRST_NAME=Jean   (optionnel)
  set SIGU_BOOTSTRAP_LAST_NAME=Dupont  (optionnel)
  python -m app.scripts.create_portal_user

Prérequis : schéma Alembic (E1+E2) appliqué. Pas de mot de passe par défaut.
Le compte reçoit toujours une fiche Person liée (users.person_id).
"""

from __future__ import annotations

import os
import sys

from sqlalchemy import inspect
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import get_engine
from app.models import Person, Role, RoleName, User
from app.scripts.create_admin import SchemaNotReadyError, ensure_required_schema
from app.security.passwords import hash_password

_PORTAL_ROLES = {RoleName.student.value, RoleName.teacher.value}

_PORTAL_EXTRA_SCHEMA: dict[str, frozenset[str]] = {
    "persons": frozenset(
        {
            "id",
            "last_name",
            "first_name",
            "email",
            "created_at",
            "updated_at",
            "deleted_at",
        }
    ),
    "users": frozenset({"person_id"}),
}


def ensure_portal_schema(engine: Engine) -> None:
    """E1 (via create_admin) + colonnes/tables Person requises pour la liaison."""
    ensure_required_schema(engine)
    insp = inspect(engine)
    existing = set(insp.get_table_names())
    if "persons" not in existing:
        raise SchemaNotReadyError(
            "Schéma absent ou incomplet : table manquante (persons). "
            "Appliquez les migrations Alembic (`alembic upgrade head`)."
        )
    for table_name, required_cols in _PORTAL_EXTRA_SCHEMA.items():
        present = {col["name"] for col in insp.get_columns(table_name)}
        missing = sorted(required_cols - present)
        if missing:
            raise SchemaNotReadyError(
                f"Schéma incomplet : colonnes manquantes sur `{table_name}` "
                f"({', '.join(missing)}). "
                "Appliquez les migrations Alembic (`alembic upgrade head`)."
            )


def split_full_name(full_name: str) -> tuple[str, str]:
    """Retourne (first_name, last_name) à partir d’un nom affiché."""
    parts = [p for p in full_name.strip().split() if p]
    if not parts:
        return "Prénom", "Nom"
    if len(parts) == 1:
        return parts[0], parts[0]
    return parts[0], " ".join(parts[1:])


def bootstrap_portal_user(
    db: Session,
    *,
    email: str,
    password: str,
    role_name: str,
    full_name: str,
    first_name: str | None = None,
    last_name: str | None = None,
) -> None:
    if role_name not in _PORTAL_ROLES:
        raise ValueError(
            f"rôle invalide ({role_name}) — attendu : student ou teacher"
        )

    if db.query(User).filter(User.email == email).first():
        raise ValueError("un compte avec cet e-mail existe déjà")

    fn = (first_name or "").strip()
    ln = (last_name or "").strip()
    if not fn or not ln:
        auto_fn, auto_ln = split_full_name(full_name)
        fn = fn or auto_fn
        ln = ln or auto_ln

    role = db.query(Role).filter(Role.name == role_name).first()
    if role is None:
        role = Role(
            name=role_name,
            description=(
                "Étudiant" if role_name == RoleName.student.value else "Enseignant"
            ),
        )
        db.add(role)
        db.flush()

    person = Person(
        last_name=ln[:100],
        first_name=fn[:100],
        email=email,
    )
    db.add(person)
    db.flush()

    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        roles=[role],
        person_id=person.id,
    )
    db.add(user)
    db.commit()


def run_bootstrap(
    engine: Engine,
    *,
    email: str,
    password: str,
    role_name: str,
    full_name: str,
    first_name: str | None = None,
    last_name: str | None = None,
) -> int:
    try:
        ensure_portal_schema(engine)
    except SchemaNotReadyError as exc:
        print(f"Erreur : {exc}", file=sys.stderr)
        return 1

    session_factory = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    db = session_factory()
    try:
        try:
            bootstrap_portal_user(
                db,
                email=email,
                password=password,
                role_name=role_name,
                full_name=full_name,
                first_name=first_name,
                last_name=last_name,
            )
        except ValueError as exc:
            print(f"Erreur : {exc}.", file=sys.stderr)
            return 1
        print(f"Compte portail créé ({role_name}) avec fiche Person liée.")
        return 0
    finally:
        db.close()


def main() -> int:
    email = os.environ.get("SIGU_BOOTSTRAP_EMAIL", "").strip().lower()
    password = os.environ.get("SIGU_BOOTSTRAP_PASSWORD", "")
    role_name = os.environ.get("SIGU_BOOTSTRAP_ROLE", "").strip().lower()
    full_name = (
        os.environ.get("SIGU_BOOTSTRAP_FULL_NAME", "").strip()
        or ("Étudiant" if role_name == "student" else "Enseignant")
    )
    first_name = os.environ.get("SIGU_BOOTSTRAP_FIRST_NAME", "").strip() or None
    last_name = os.environ.get("SIGU_BOOTSTRAP_LAST_NAME", "").strip() or None

    if not email or not password or not role_name:
        print(
            "Erreur : définir SIGU_BOOTSTRAP_EMAIL, SIGU_BOOTSTRAP_PASSWORD "
            "et SIGU_BOOTSTRAP_ROLE (student|teacher).",
            file=sys.stderr,
        )
        return 1
    if len(password) < 8:
        print("Erreur : mot de passe trop court (min. 8).", file=sys.stderr)
        return 1

    return run_bootstrap(
        get_engine(),
        email=email,
        password=password,
        role_name=role_name,
        full_name=full_name,
        first_name=first_name,
        last_name=last_name,
    )


if __name__ == "__main__":
    raise SystemExit(main())
