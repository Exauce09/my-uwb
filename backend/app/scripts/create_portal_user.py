"""
Création ponctuelle d’un compte portail (student | teacher).

Usage (depuis backend/, venv activé) :
  set SIGU_BOOTSTRAP_EMAIL=...
  set SIGU_BOOTSTRAP_PASSWORD=...
  set SIGU_BOOTSTRAP_ROLE=student
  set SIGU_BOOTSTRAP_FULL_NAME=Étudiant Démo
  python -m app.scripts.create_portal_user

Prérequis : schéma Alembic appliqué. Pas de mot de passe par défaut.
"""

from __future__ import annotations

import os
import sys

from sqlalchemy.orm import Session, sessionmaker

from app.database import get_engine
from app.models import Role, RoleName, User
from app.scripts.create_admin import SchemaNotReadyError, ensure_required_schema
from app.security.passwords import hash_password

_PORTAL_ROLES = {RoleName.student.value, RoleName.teacher.value}


def bootstrap_portal_user(
    db: Session,
    *,
    email: str,
    password: str,
    role_name: str,
    full_name: str,
) -> None:
    if role_name not in _PORTAL_ROLES:
        raise ValueError(
            f"rôle invalide ({role_name}) — attendu : student ou teacher"
        )

    if db.query(User).filter(User.email == email).first():
        raise ValueError("un compte avec cet e-mail existe déjà")

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

    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        roles=[role],
    )
    db.add(user)
    db.commit()


def run_bootstrap(
    engine,
    *,
    email: str,
    password: str,
    role_name: str,
    full_name: str,
) -> int:
    try:
        ensure_required_schema(engine)
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
            )
        except ValueError as exc:
            print(f"Erreur : {exc}.", file=sys.stderr)
            return 1
        print(f"Compte portail créé ({role_name}).")
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
    )


if __name__ == "__main__":
    raise SystemExit(main())
