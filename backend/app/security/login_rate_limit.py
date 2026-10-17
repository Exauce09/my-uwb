"""
Limitation des tentatives de connexion — stockage en mémoire processus.

Adapté au déploiement documenté (uvicorn mono-processus / --reload).
Limite multi-instances : chaque worker a son propre compteur ; pour un
cluster, prévoir un magasin partagé (ex. Redis) — non requis tant que
Redis n’est pas dans l’architecture.

Ne journalise jamais mots de passe ni jetons.
"""

from __future__ import annotations

import threading
import time
from collections.abc import Callable


class InMemoryLoginRateLimiter:
    """Fenêtre glissante d’échecs par clé (email normalisé et/ou IP directe)."""

    def __init__(self, *, clock: Callable[[], float] | None = None) -> None:
        self._clock = clock or time.monotonic
        self._lock = threading.Lock()
        self._failures: dict[str, list[float]] = {}

    def clear(self) -> None:
        with self._lock:
            self._failures.clear()

    def reset_key(self, key: str) -> None:
        with self._lock:
            self._failures.pop(key, None)

    def _prune(self, stamps: list[float], *, now: float, window_seconds: float) -> list[float]:
        cutoff = now - window_seconds
        return [t for t in stamps if t > cutoff]

    def is_limited(
        self,
        key: str,
        *,
        max_attempts: int,
        window_seconds: float,
    ) -> bool:
        if max_attempts <= 0:
            return False
        now = self._clock()
        with self._lock:
            stamps = self._prune(
                self._failures.get(key, []),
                now=now,
                window_seconds=window_seconds,
            )
            self._failures[key] = stamps
            return len(stamps) >= max_attempts

    def register_failure(
        self,
        key: str,
        *,
        max_attempts: int,
        window_seconds: float,
    ) -> None:
        if max_attempts <= 0:
            return
        now = self._clock()
        with self._lock:
            stamps = self._prune(
                self._failures.get(key, []),
                now=now,
                window_seconds=window_seconds,
            )
            stamps.append(now)
            self._failures[key] = stamps


_limiter = InMemoryLoginRateLimiter()


def get_login_rate_limiter() -> InMemoryLoginRateLimiter:
    return _limiter


def client_ip_from_request(request) -> str | None:
    """
    Adresse vue par le serveur (ASGI client).

    N’utilise pas X-Forwarded-For / X-Real-IP : ces en-têtes sont falsifiables
    sans proxy de confiance configuré.
    """
    if request.client is None:
        return None
    host = request.client.host
    if not host:
        return None
    return host
