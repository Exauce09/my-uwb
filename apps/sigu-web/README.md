# SIGU-web — espace applicatif

Interface administrateur du Système Intégré de Gestion Universitaire (UWB).

Stack : React 19, Vite, TypeScript, Tailwind CSS 4, React Router.

## Prérequis

- Backend SIGU démarré (`uvicorn` sur le port 8000 par défaut).
- Compte avec rôle `admin`.
- CORS backend : inclure `http://localhost:5174` (`SIGU_CORS_ORIGINS`).

## Lancement

```powershell
cd apps/sigu-web
copy .env.example .env
npm install
npm run dev
```

Ouvre `http://localhost:5174`.

Variable publique uniquement :

| Variable | Rôle |
|----------|------|
| `VITE_API_BASE_URL` | URL de l’API (ex. `http://127.0.0.1:8000`) |

Aucun secret serveur dans ce frontend. Le jeton JWT est reçu via cookie httpOnly et/ou Bearer en mémoire (jamais `localStorage`).

## Fonctionnalités V1

- Connexion / déconnexion (`POST /api/v1/auth/login|logout`, `GET /me`)
- Tableau de bord (sans statistiques inventées)
- Personnes : liste, recherche, CRUD soft-delete
- Comptes : liste, création, activation, rôles, liaison Person
- Rôles : synthèse dérivée des comptes
- Institution : page « à venir »

## Build

```powershell
npm run build
```
