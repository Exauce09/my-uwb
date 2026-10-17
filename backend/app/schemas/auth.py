from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class TokenResponse(BaseModel):
    """Réponse de connexion — le jeton est aussi posé en cookie httpOnly."""

    token_type: str = "bearer"
    # Présent pour les clients API / tests ; le navigateur doit privilégier le cookie.
    access_token: str
    message: str = (
        "Authentification réussie. Stockez le jeton uniquement via cookie httpOnly "
        "côté application métier — jamais dans localStorage."
    )
