# SIGU-web — espace applicatif

Interface administrateur du Système Intégré de Gestion Universitaire (UWB).

Stack : React 19, Vite, TypeScript, Tailwind CSS 4, React Router.

## Prérequis

- Backend SIGU démarré avec schéma Alembic **E2** sur PostgreSQL (cible runtime).
- Compte avec rôle `admin` (script `create_admin`, jamais sur une base inconnue).
- CORS backend : inclure `http://localhost:5175` (`SIGU_CORS_ORIGINS`).
- **Ports** : le site public utilise souvent `5173`/`5174` ; le shell SIGU démarre
  sur **`5175`**. Si `8000` est déjà pris par un autre projet, lancez l’API sur
  `8001` et alignez `VITE_API_BASE_URL`.

## Lancement

```powershell
cd apps/sigu-web
copy .env.example .env
npm install
npm run dev
```

Ouvre `http://localhost:5175`.

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
