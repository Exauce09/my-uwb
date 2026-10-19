# Scénario de démonstration SIGU (Phase 6)

**Objet :** parcours reproductible pour démontrer l’intégration E1–E4 (auth, personnes, référentiel académique, dossiers étudiants, portail).  
**Données :** synthétiques / seed de test — **pas** un visa UWB formel. Le catalogue (7 unités, année `2026-2027`, niveaux D-021) est **intérimaire** (`docs/13`, `docs/09`).  
**Interdit dans ce document :** mots de passe, jetons, chaînes de connexion, secrets.

---

## 1. Services et URLs locales

| Service | URL | Remarque |
|---------|-----|----------|
| API | `http://127.0.0.1:8001` | Ne pas utiliser le port d’un autre projet |
| Administration (`sigu-web`) | `http://localhost:5175` | Compte **admin** uniquement pour les écritures |
| Portail public / espaces | `http://localhost:5174` | Login étudiant / enseignant |
| Base de test | hôte `127.0.0.1`, port **5434**, base `sigu_test_*` | Voir `backend/.env` local (non versionné) |

Ne jamais cibler les bases `nic_*`, `spe-*` ou d’autres projets.

---

## 2. Démarrage (ordre recommandé)

Prérequis : PostgreSQL de test SIGU démarré, `backend/.env` et `apps/sigu-web/.env` configurés localement, `apps/website` avec l’URL API alignée.

```powershell
# 1 — Base + migrations (backend/)
cd backend
.\.venv\Scripts\Activate.ps1
# Charger l’environnement local (SIGU_DATABASE_URL = sigu_test_* @ 5434)
$env:SIGU_MIGRATION_REQUIRE_TEST_DB = "1"
alembic upgrade head
# head attendu : 20260419_0004 (après E3 20260418_0003)

# 2 — Comptes (mots de passe via variables d’environnement, jamais commités)
# Admin
$env:SIGU_BOOTSTRAP_EMAIL = "admin@example.com"
$env:SIGU_BOOTSTRAP_PASSWORD = "<local-only>"
python -m app.scripts.create_admin
Remove-Item Env:SIGU_BOOTSTRAP_PASSWORD

# Étudiant / enseignant (scripts create_portal_user — voir README backend)
# E-mails de démo usuels (sans mot de passe ici) :
#   student@example.com  — rôle student
#   teacher@example.com  — rôle teacher

# 3 — Référentiel synthétique + dossier étudiant de démo
python -m app.scripts.seed_academic_e3_catalog
python -m app.scripts.provision_test_student_dossier
# Matricule synthétique par défaut : TEST-E3-001
# Programme seed : INFO_IA_CURSUS · année label 2026-2027 · niveau L1_LMD

# 4 — API
uvicorn app.main:app --reload --port 8001

# 5 — Admin UI (autre terminal)
cd apps/sigu-web
npm run dev
# → http://localhost:5175

# 6 — Portail (autre terminal)
cd apps/website
npm run dev
# → http://localhost:5174
```

---

## 3. Comptes de démonstration (références uniquement)

| Rôle | Identifiant (e-mail) | Usage |
|------|----------------------|--------|
| Admin | `admin@example.com` | `sigu-web` — personnes, dossiers, référentiel |
| Étudiant | `student@example.com` | Portail — dossier `TEST-E3-001` après provision |
| Enseignant | `teacher@example.com` | Portail — identité seule, pas d’API admin |

Les mots de passe sont définis **uniquement** en local (variables d’environnement / scripts). Ne pas les coller dans la doc, les tickets ou Git.

---

## 4. Données synthétiques attendues après seed + provision

| Élément | Contenu de démo | Statut |
|---------|-----------------|--------|
| Unités | 7 codes D-016 (INFO_IA, SIC, … ISTM) | Seed — **non** validé rectorat |
| Programmes | 1 cursus par unité (ex. `INFO_IA_CURSUS`) | Seed |
| Année | label `2026-2027`, dates NULL, `is_current` | Q7 intérimaire |
| Niveaux | 8 codes D-021 (L1_LMD … MASTER_2) | Intérimaire fiche 13 |
| Profil | matricule `TEST-E3-001` lié à `student@example.com` | Provision test |
| Inscription | programme INFO_IA + année + niveau L1_LMD | Provision test |

IFMP / EHEC / SCF : **exclus** du seed. Pas de notes, pas de cohortes, pas d’inscriptions de cours.

---

## 5. Scénario de bout en bout

### A. Administrateur (`http://localhost:5175`)

| # | Étape | Résultat attendu |
|---|--------|------------------|
| A1 | Connexion admin | Accès au tableau de bord ; menus Personnes, Dossiers, Référentiel, Comptes |
| A2 | Personnes — recherche | Liste / détail ; soft-delete « Archiver » disponible |
| A3 | Référentiel — unités | Liste lecture seule des 7 unités ; pas de création d’unité |
| A4 | Référentiel — programmes | Liste + recherche ; détail ; édition ; archivage refusé si inscriptions actives |
| A5 | Référentiel — années / niveaux | Création / édition année ; niveaux limités aux codes D-021 |
| A6 | Dossiers — ouvrir `TEST-E3-001` | Matricule, inscriptions avec codes programme / niveau |
| A7 | Modifier statut / niveau d’une inscription | Persistance après rechargement |
| A8 | Ajouter une 2ᵉ inscription (autre programme, même année) | 201 — unicité D-022 option A (pas un seul programme/année) |
| A9 | Retirer (soft-delete) une inscription puis la recréer | Retrait OK ; recréation OK (index partiel E4) |
| A10 | Tenter un doublon actif (même triple) | 409 |
| A11 | Déconnexion | Retour login ; API admin → 401 sans session |

### B. Étudiant (`http://localhost:5174`)

| # | Étape | Résultat attendu |
|---|--------|------------------|
| B1 | Login `student@example.com` | Accès espace étudiant |
| B2 | Accueil | Identité / fiche Person si liée |
| B3 | Dossier universitaire | Matricule `TEST-E3-001` ; code + titre programme ; niveau (code + libellé) ; année |
| B4 | Appel API admin (ex. `/api/v1/student-profiles`) | 403 |
| B5 | Déconnexion puis `/espace-etudiant/dossier` | Refus / redirection login ; dossier API → 401 |

### C. Enseignant

| # | Étape | Résultat attendu |
|---|--------|------------------|
| C1 | Login `teacher@example.com` | Espace enseignant |
| C2 | Contenu affiché | Identité + liens institutionnels ; **pas** de saisie de notes / cours fictifs |
| C3 | API admin / catalogue académique écriture | 403 |
| C4 | Pas de dossier étudiant enseignant | Lien dossier réservé au rôle student |

---

## 6. Remise en état de la base de test

Options (choisir selon le risque) :

1. **Ré-idempotent (léger)**  
   - Relancer `seed_academic_e3_catalog` et `provision_test_student_dossier` (ne recrée pas les lignes existantes).  
   - Soft-delete manuel via l’admin des inscriptions / profils de démo indésirables.

2. **Remise à zéro schéma (destructif, base `sigu_test_*` uniquement)**  
   - Confirmer l’URL (`127.0.0.1:5434`, préfixe `sigu_test_`).  
   - `alembic downgrade base` puis `alembic upgrade head` **uniquement** sur cette base.  
   - Recréer admin / portal users / seed / provision.

3. **Ne pas** : `DROP` sur une base hors garde-fou ; toucher `nic_*` / `spe-*` ; `git clean` / force-push.

---

## 7. Vérifications hors navigateur automatisé

Si aucun navigateur automatisé n’est disponible, exécuter manuellement les tableaux A–C et cocher les résultats.  
Les tests pytest (RBAC, isolation dossier, soft-delete, catalogue) couvrent l’API ; ils **ne remplacent pas** la vérification visuelle des écrans.

---

## 8. Hors périmètre de la démo

- Chatbot, messagerie, e-learning SIGU  
- Notes / délibérations (D-015)  
- Cohortes (Q33 = non)  
- Inscriptions individuelles aux cours (Q32 = non)  
- Présentation du seed comme catalogue officiel UWB  

---

## 9. Références

- Décisions intérimaires : `docs/13-fiche-reponses-uwb-e3.md`, `docs/09-registre-decisions.md`  
- Démarrage local : `docs/11-demarrage-local-et-e2e.md`  
- Migrations : `20260418_0003` (E3), `20260419_0004` (index partiels soft-delete)  
