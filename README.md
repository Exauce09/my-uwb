# SIGU-UWB / Université William Booth

Monorepo du système d’information et du site institutionnel de l’Université William Booth (Kinshasa, RDC).

## Structure

```
apps/website/     Site institutionnel public (React + Vite + Tailwind)
apps/sigu-web/    Application SIGU (admin React) — V1 shell
backend/          API FastAPI + PostgreSQL (Modules 1–2)
docs/             Conception, MCD, décisions
```

## Site institutionnel

```bash
cd apps/website
npm install
npm run dev
```

Ouvre `http://localhost:5173`.

## Backend (API)

```bash
cd backend
py -3.14 -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
copy .env.example .env
# Renseigner SIGU_SECRET_KEY et SIGU_DATABASE_URL (PostgreSQL)
pytest -q
# Voir backend/README.md pour Alembic, uvicorn et create_admin
```

## Application SIGU (`apps/sigu-web`)

```bash
cd apps/sigu-web
copy .env.example .env
npm install
npm run dev
```

Ouvre `http://localhost:5175` (API attendue sur un port libre, souvent `8001`
si `8000` est déjà pris hors SIGU).

## Notes

- Les contenus marqués « à vérifier UWB » sont provisoires.
- Les images académiques sont illustratives, pas des photos officielles du campus.
- Le logo officiel est dans `apps/website/public/brand/logo-uwb.webp`.
