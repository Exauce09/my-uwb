# Démarrage local et validation E2E

## État observé (environnement de développement)

| Élément | Observation |
|---------|-------------|
| Git `main` / `origin/main` | Synchronisés au commit de référence du shell admin |
| `backend/.env` | Local uniquement (gitignored) — jamais committer |
| Port `8000` | Occupé ici par **`nic_api`** (hors SIGU) — ne pas y toucher ; utiliser **8001** |
| Port `5174` | Peut servir le **site public** — shell SIGU sur **5175** |
| PostgreSQL SIGU dédié | **Requis** pour un backend live avec migrations E1→E2 |
| Conteneurs `nic_postgres`, `spe-rdc-db-1` | **Interdits** pour SIGU |
| SQLite + Alembic E2 | **Échec** (`ALTER` contrainte UNIQUE non supporté hors batch) |

## Pourquoi SQLite ne suffit pas pour le live

La migration E2 (`users.person_id` + contrainte UNIQUE/FK) utilise `ALTER` non supporté
par le dialecte SQLite Alembic hors *batch mode*. Le schéma applicatif courant
(modèle `User` avec `person_id`) **exige E2**.  
Alembic sur SQLite échoue à E2 → **pas de serveur live Module 2 sans PostgreSQL**.

## Prérequis manquants pour un E2E complet

1. Instance PostgreSQL **dédiée** SIGU (idéalement `sigu_test_*` pour tests, autre `sigu_*` pour dev).
2. Fichier `backend/.env` local avec `SIGU_SECRET_KEY` (≥ 32 car. aléatoires) et
   `SIGU_DATABASE_URL` PostgreSQL — **sans** publier de secrets.
3. `SIGU_CORS_ORIGINS` incluant `http://localhost:5174`.
4. `alembic upgrade head` **uniquement** sur la base SIGU identifiée.
5. Bootstrap admin via `SIGU_BOOTSTRAP_EMAIL` / `SIGU_BOOTSTRAP_PASSWORD` (session unique).
6. API sur un port libre (ex. `8001` si `8000` est occupé par un autre projet).
7. `apps/sigu-web` sur le port **5175** avec `VITE_API_BASE_URL` alignée
   (éviter 5173/5174 souvent utilisés par le site public).

## Commandes (à adapter — ne pas inventer d’URL)

```powershell
# Backend
cd backend
.\.venv\Scripts\Activate.ps1
# Créer .env localement (secret + URL PostgreSQL SIGU)
alembic upgrade head
$env:SIGU_BOOTSTRAP_EMAIL="admin@example.com"
$env:SIGU_BOOTSTRAP_PASSWORD="..."   # fort, local uniquement
python -m app.scripts.create_admin
Remove-Item Env:SIGU_BOOTSTRAP_PASSWORD
uvicorn app.main:app --reload --port 8001

# Frontend
cd apps/sigu-web
copy .env.example .env   # aligner le port API
npm install
npm run dev
```

## Campagnes PostgreSQL (phase ultérieure)

- MIG puis I1 **séparément**, base jetable `sigu_test_*` uniquement.
- Voir `backend/README.md` — ne pas lancer tant que l’URL n’est pas fournie et validée.
