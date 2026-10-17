"""
Verrou commun pour les mutations pouvant supprimer le dernier administrateur actif.

Pourquoi un simple SELECT … FOR UPDATE sur les admins existants ne suffit pas :
- si deux transactions verrouillent des sous-ensembles disjoints (ou un ensemble vide),
  elles peuvent chacune croire qu’il restera un admin ;
- l’ensemble des lignes « admin actif » peut changer pendant la course ;
- sans ligne à verrouiller, FOR UPDATE n’acquiert aucun verrou.

Mécanisme retenu :
- PostgreSQL : `pg_advisory_xact_lock` (verrou de transaction, libéré au commit/rollback).
- Autres dialectes (SQLite tests) : `threading.Lock` processus — sérialise les sections
  critiques dans le même processus uniquement ; ne prouve pas la concurrence multi-processus.

Aucune table supplémentaire → pas de migration.
"""

from __future__ import annotations

import threading
from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import text
from sqlalchemy.orm import Session

# Clé stable (int64) dédiée aux mutations « dernier admin ».
_ADMIN_MUTATION_LOCK_KEY = 0x53494755_41444D49  # "SIGU" + "ADMI" compact

_process_lock = threading.Lock()


@contextmanager
def admin_mutation_guard(db: Session) -> Iterator[None]:
    """
    Sérialise les opérations qui comptent puis mutent les administrateurs actifs.
    """
    bind = db.get_bind()
    dialect = bind.dialect.name if bind is not None else ""

    if dialect == "postgresql":
        # Verrou transactionnel : tenu jusqu’au commit ou rollback de `db`.
        db.execute(
            text("SELECT pg_advisory_xact_lock(:lock_key)"),
            {"lock_key": _ADMIN_MUTATION_LOCK_KEY},
        )
        yield
        return

    # SQLite / tests locaux : exclusion mutuelle intra-processus.
    with _process_lock:
        yield
