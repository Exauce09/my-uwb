"""FastAPI entrypoint — SIGU-UWB backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.api import auth, health, users
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title='SIGU-UWB API',
    description=(
        'API du Systeme Integre de Gestion Universitaire (Universite William Booth). '
        'Socle E1 : sante, authentification, roles. '
        'Les modules metier (notes, finances, etc.) ne sont pas inclus.'
    ),
    version=__version__,
    docs_url='/docs' if not settings.is_production else None,
    redoc_url='/redoc' if not settings.is_production else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allow_headers=['Authorization', 'Content-Type'],
)

app.include_router(health.router)
app.include_router(auth.router, prefix='/api/v1')
app.include_router(users.router, prefix='/api/v1')
