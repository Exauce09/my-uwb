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
3. `SIGU_CORS_ORIGINS` incluant `http://localhost:5175`.
4. `alembic upgrade head` **uniquement** sur la base SIGU identifiée (`SIGU_MIGRATION_REQUIRE_TEST_DB=1` pour les bases de test).
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

## Création d’une instance PostgreSQL de test SIGU (à autoriser)

Le garde-fou (`app/db_url_guard.py`) exige **strictement** :

| Élément | Règle |
|---------|--------|
| Nom de base | préfixe `sigu_test_` (ex. `sigu_test_local`, **pas** seulement `sigu_test`) |
| Utilisateur | préfixe `sigu_test_` (ex. `sigu_test_app`) |
| Pilote | `postgresql+psycopg` (ou `postgresql`) |
| Mot de passe | non vide, non placeholder (`CHANGE_ME`, `password`, …) |
| Interdit | tout nom contenant `nic_`, `spe-rdc`, etc. |

### Option A — conteneur dédié (recommandé, **après autorisation explicite**)

Ne pas réutiliser `nic_postgres` ni `spe-rdc-db-1`. Exemple de port local libre (à confirmer) : `5433`.

```powershell
# À n’exécuter qu’après autorisation — instance SIGU exclusive
docker run -d --name sigu-postgres-test `
  -e POSTGRES_USER=sigu_test_app `
  -e POSTGRES_PASSWORD=<mot_de_passe_fort_local> `
  -e POSTGRES_DB=sigu_test_local `
  -p 5433:5432 `
  postgres:16-alpine
```

Puis dans `backend/.env` (jamais committer) :

```text
SIGU_DATABASE_URL=postgresql+psycopg://sigu_test_app:<mdp>@127.0.0.1:5433/sigu_test_local
SIGU_TEST_DATABASE_URL=postgresql+psycopg://sigu_test_app:<mdp>@127.0.0.1:5433/sigu_test_local
SIGU_CORS_ORIGINS=http://localhost:5175,http://127.0.0.1:5175
```

Migrations / campagnes :

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:SIGU_MIGRATION_REQUIRE_TEST_DB="1"
alembic upgrade head
alembic current
# bootstrap admin (mot de passe uniquement via env, puis Remove-Item)
pytest -q tests/test_migration_persons_postgres.py   # MIG seule
# ensuite seulement :
pytest -q tests/test_admin_guard_postgres.py         # I1 seule
```

### Option B — PostgreSQL déjà installé hors Docker

Créer rôle + base `sigu_test_*` / `sigu_test_*` sur un serveur **dont vous confirmez qu’il n’appartient pas à un autre projet**, puis mêmes variables et commandes qu’en A.

### Arrêt obligatoire si

- Docker Desktop est arrêté et aucune instance SIGU n’est joignable ;
- le seul PostgreSQL visible est `nic_*` / `spe-*` ;
- `SIGU_TEST_DATABASE_URL` est absente ou refusée par le garde-fou.
