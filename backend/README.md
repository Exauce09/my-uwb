# Backend SIGU-UWB

API FastAPI + PostgreSQL pour le Système Intégré de Gestion Universitaire.

**Statut E1 :** socle initial (santé, utilisateurs, rôles, authentification).  
Les modules métier (notes, finances, paiements) ne sont **pas** inclus.

Le site public (`apps/website/`) n’est pas modifié par ce backend.

## Architecture retenue

| Élément | Choix |
|---------|--------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x |
| Migrations | Alembic (versionnées) |
| BDD cible | PostgreSQL (`postgresql+psycopg://…`) |
| Auth | JWT dans cookie **httpOnly** (+ Bearer pour tests/API) |
| Mots de passe | bcrypt (passlib) — jamais en clair |
| RBAC | Contrôle serveur (`require_roles`) |

**Pourquoi JWT + cookie httpOnly :** adapté à une API consommée ensuite par `apps/sigu-web`. Le navigateur ne doit **pas** stocker le jeton dans `localStorage`. Le Bearer reste disponible pour les tests et clients machine-à-machine.

### Limitation des tentatives de login

Compteur **en mémoire** par processus (`SIGU_LOGIN_RATE_LIMIT_ATTEMPTS` / `SIGU_LOGIN_RATE_LIMIT_WINDOW_SECONDS`), clés email + IP ASGI (`request.client.host` — pas d’en-têtes `X-Forwarded-For` falsifiables). Échecs uniquement ; succès réinitialise les clés. HTTP 429 avec message générique.

**Limite :** avec plusieurs workers uvicorn / instances, chaque processus a son propre compteur. Un magasin partagé (ex. Redis) n’est **pas** dans le déploiement documenté (`uvicorn … --reload` mono-processus) et n’a pas été ajouté.

### Limites de sécurité (E1)

- Pas encore de refresh token ni CSRF dédié.
- Rate-limit login : mémoire processus uniquement (voir ci-dessus).
- `Secure` cookie à activer dès HTTPS (`SIGU_COOKIE_SECURE=true` / `SIGU_ENVIRONMENT=production`).
- La sécurité n’est **pas** « garantie » : revue et durcissement nécessaires avant production.

## Installation locale

```powershell
cd backend
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements-dev.txt
copy .env.example .env
# Éditer .env : SIGU_SECRET_KEY (aléatoire ≥ 32 car.) et SIGU_DATABASE_URL PostgreSQL
```

### Bases PostgreSQL de test (garde-fou)

| Variable | Rôle |
|----------|------|
| `SIGU_DATABASE_URL` | Runtime + Alembic |
| `SIGU_TEST_DATABASE_URL` | Campagne concurrence PG I1 (PG-0…PG-6) |
| `SIGU_MIGRATION_REQUIRE_TEST_DB=1` | Avant `alembic upgrade` : refuse toute base qui n’est pas `sigu_test_*` |

Règles pour une URL de **test** (module `app/db_url_guard.py`) :

- schéma `postgresql` / `postgresql+psycopg` ;
- nom de base commençant par `sigu_test_` ;
- utilisateur commençant par `sigu_test_` ;
- mot de passe non vide / non placeholder (`CHANGE_ME`, etc.) ;
- **interdiction** d’utiliser une base d’un autre projet.

Si `SIGU_TEST_DATABASE_URL` et `SIGU_DATABASE_URL` sont toutes deux définies, elles doivent désigner la **même cible** (pilote, hôte, port, base, utilisateur) avant migration ou test d’intégration.

Les tests unitaires pytest restent sur SQLite mémoire ; la campagne PG I1 est **ignorée** si `SIGU_TEST_DATABASE_URL` est absente, et **échoue** si elle est présente mais invalide.

Générer une clé :

```powershell
py -c "import secrets; print(secrets.token_hex(32))"
```

## Lancer l’API

PostgreSQL doit être joignable selon `SIGU_DATABASE_URL`.

```powershell
# Migrations (uniquement sur une base autorisée) — obligatoires avant le bootstrap
alembic upgrade head

# Optionnel : premier admin (mot de passe UNIQUEMENT via env pour cette commande).
# Le script ne crée pas les tables : le schéma Alembic doit déjà être présent.
$env:SIGU_BOOTSTRAP_EMAIL="admin@example.com"
$env:SIGU_BOOTSTRAP_PASSWORD="..."   # choisir un mot de passe fort
python -m app.scripts.create_admin
Remove-Item Env:SIGU_BOOTSTRAP_PASSWORD

uvicorn app.main:app --reload --port 8000
```

- Santé : `GET http://127.0.0.1:8000/health`
- Docs (hors production) : `http://127.0.0.1:8000/docs`

## Tests (sans PostgreSQL)

Les tests utilisent SQLite en mémoire :

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pytest -q
```

Sans `SIGU_TEST_DATABASE_URL`, les scénarios PostgreSQL I1 (`tests/test_admin_guard_postgres.py`) sont **ignorés** : la concurrence réelle (`pg_advisory_xact_lock`) **n’est pas validée**.

## Campagne PostgreSQL I1 (concurrence)

Prérequis (à faire **hors** de la suite pytest, manuellement) :

1. Base dédiée `sigu_test_*` + utilisateur `sigu_test_*` (voir garde-fou ci-dessus).
2. Schéma E1 déjà appliqué : `SIGU_MIGRATION_REQUIRE_TEST_DB=1` puis `alembic upgrade head` sur cette base.
3. Aucun `create_all` : si les tables `users` / `roles` / `user_roles` manquent, les tests **échouent** avec un message explicite (pas de création automatique de schéma).
4. Pour PG-6, la base ne doit pas contenir d’autres administrateurs actifs hors du couple créé par le test.

Exécution :

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:SIGU_TEST_DATABASE_URL="postgresql+psycopg://sigu_test_…:…@127.0.0.1:5432/sigu_test_…"
pytest -q tests/test_admin_guard_postgres.py
# ou toute la suite :
pytest -q
Remove-Item Env:SIGU_TEST_DATABASE_URL
```

Comportement :

| Situation | Résultat |
|-----------|----------|
| `SIGU_TEST_DATABASE_URL` absente | skip (concurrence PG non validée) |
| URL présente mais invalide / hors `sigu_test_*` | **fail** (garde-fou) |
| Schéma E1 absent | **fail** (appliquer Alembic d’abord) |
| Campagne OK | PG-0…PG-6 (préflight, smoke verrou, courses, rollback, dernier admin) |

Ne jamais journaliser le mot de passe ni l’URL complète. Nettoyage : uniquement les utilisateurs créés par les tests.

## Campagne PostgreSQL — migration Module 2 (`persons`)

Fichier : `tests/test_migration_persons_postgres.py` (MIG-0…MIG-6).

Prérequis :

1. Base **exclusive** `sigu_test_*` (la campagne fait `alembic downgrade base` puis upgrade E1/E2).
2. `SIGU_TEST_DATABASE_URL` valide ; pendant la campagne, `SIGU_DATABASE_URL` est alignée et `SIGU_MIGRATION_REQUIRE_TEST_DB=1`.
3. Aucun `create_all` : schéma uniquement via Alembic.

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:SIGU_TEST_DATABASE_URL="postgresql+psycopg://sigu_test_…:…@127.0.0.1:5432/sigu_test_…"
pytest -q tests/test_migration_persons_postgres.py
Remove-Item Env:SIGU_TEST_DATABASE_URL
```

Sans URL : scénarios PG **ignorés** (un test hors-ligne vérifie uniquement l’alignement des noms de contraintes). **PostgreSQL n’est pas validé** tant que cette campagne n’a pas été exécutée avec succès.

Couverture : upgrade E1→E2, conservation des comptes, association Person/User, unicité `person_id`, `ON DELETE SET NULL`, downgrade E2→E1, re-upgrade.

## Endpoints E1

| Méthode | Chemin | Accès |
|---------|--------|--------|
| GET | `/health` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/logout` | Public (efface le cookie) |
| GET | `/api/v1/auth/me` | Authentifié |
| POST | `/api/v1/users` | Rôle `admin` |
| GET | `/api/v1/users` | Rôle `admin` (pagination, `q`) |
| GET | `/api/v1/users/{id}` | Rôle `admin` |
| PATCH | `/api/v1/users/{id}/status` | Rôle `admin` |
| POST | `/api/v1/users/{id}/roles` | Rôle `admin` |
| DELETE | `/api/v1/users/{id}/roles/{role}` | Rôle `admin` |
| PUT | `/api/v1/users/{id}/person` | Rôle `admin` (lier une Person) |
| DELETE | `/api/v1/users/{id}/person` | Rôle `admin` (délier) |
| POST | `/api/v1/persons` | Rôle `admin` |
| GET | `/api/v1/persons` | Rôle `admin` (pagination, `q`) |
| GET | `/api/v1/persons/{id}` | Rôle `admin` |
| PATCH | `/api/v1/persons/{id}` | Rôle `admin` |
| DELETE | `/api/v1/persons/{id}` | Rôle `admin` (soft-delete) |

Rôles prévus : `student`, `teacher`, `finance`, `admin`.  
Règles : pas d’auto-désactivation ; pas de retrait/désactivation du dernier administrateur actif.  
Concurrence : verrou commun (`pg_advisory_xact_lock` sur PostgreSQL ; lock processus sur SQLite de test) autour du compte + mutation.  
Personnes : identité distincte du compte ; e-mail Person = contact (non unique) ; listes excluent les fiches soft-deleted.
