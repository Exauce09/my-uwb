from fastapi import APIRouter

from app import __version__

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """Endpoint public — aucun secret, aucune donnée personnelle."""
    return {"status": "ok", "service": "sigu-backend", "version": __version__}
