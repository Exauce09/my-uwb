# Registre des décisions — données SIGU-UWB

Document vivant. Distingue **confirmé (doc dépôt)**, **proposé (conception phase 2 / 2.1)**, **rejeté / reporté**, **non décidé (attente UWB)**.

| ID | Date | Décision | Statut | Source / commentaire |
|----|------|----------|--------|----------------------|
| D-001 | — | Stack site public : React, TS, Vite, Tailwind | **Confirmé** | `apps/website/` |
| D-002 | — | Portail métier prévu : `apps/sigu-web` (PWA) | **Confirmé** (cible) | README ; app non initialisée |
| D-003 | — | Backend : FastAPI + PostgreSQL | **Confirmé** | `backend/README.md` |
| D-004 | E1 | Auth : JWT cookie httpOnly (+ Bearer tests) | **Confirmé** (technique) | backend E1 |
| D-005 | E1 | Hash mots de passe bcrypt ; pas de secret en dur | **Confirmé** | backend E1 |
| D-006 | E1 | Rôles : student, teacher, finance, admin | **Confirmé** (socle) | `RoleName` — affinable |
| D-007 | E1 | Tables users / roles / user_roles | **Confirmé** (socle) | modèles + migration initiale E1 |
| D-008 | Phase 2 | Séparer Person et User | **Proposé** | Conception données |
| D-009 | Phase 2 | Année académique obligatoire sur inscriptions, offres, créances, délibérations | **Proposé** | `06` / `08` |
| D-010 | Phase 2.1 | Statuts paiement : `pending`, `confirmed`, `failed`, `cancelled`, `refunded` ; remboursement lié via `original_payment_id` | **Proposé** | Remplace libellés « initiated/rejected » ; à valider UWB |
| D-011 | Phase 2 | Ne pas reconstruire une LMS ; intégrer e-learning existant | **Proposé** | URL officielle dans `site.ts` |
| D-012 | Phase 2 | Assistant IA limité au corpus approuvé + ACL user | **Proposé** | Confidentialité ; backlog migration |
| D-013 | Phase 2 | Permissions fines (table permissions) | **Reporté** | Après stabilisation des rôles |
| D-014 | — | Montants, devises, grilles tarifaires | **Non décidé** | Absents du site / docs |
| D-015 | — | Échelles de notes, pondérations, règles de délibération | **Non décidé** | Absents des docs |
| D-016 | — | Liste figée des facultés / IFMP / EHEC / SCF | **Non décidé** | `05-questions-uwb.md` |
| D-017 | Phase 2 | Soft-delete + audit pour données sensibles | **Proposé** | Conservation à valider |
| D-018 | Phase 2.1 | Nomenclature unique : **CourseOffering** (abandon de ProgramCourseOffering) | **Proposé** | Harmonisation A01 |
| D-019 | Phase 2.1 | `persons` = source de vérité identité si `users.person_id` lié | **Proposé** | Extension E1 nullable |
| D-020 | Phase 2.1 | Introduire **CourseRegistration** (`course_registrations`) ; notes liées via offering + registration | **Proposé — à valider** | Q32 |
| D-021 | Phase 2.1 | Distinguer **ProgramLevel** (niveau) et **Cohort/Promotion** | **Proposé — à valider** | Q33 ; ne pas fusionner |
| D-022 | Phase 2.1 | Unicité Enrollment : options A/B/C documentées, aucune imposée | **Non décidé** | Q6 |
| D-023 | Phase 2.1 | Reçu (`receipts`) émis **uniquement** si paiement `confirmed` | **Proposé** | Règle technique |
| D-024 | Phase 2.1 | `grade_change_logs` append-only : acteur, date, old/new, motif | **Proposé** | |
| D-025 | Phase 2.1 | Vocabulaire : **AiThread** / `ai_threads` ; **ExternalSystemLink** / `external_system_links` | **Proposé** | Backlog pour messagerie/IA |
| D-026 | Phase 2.1 | Messagerie + assistant IA **hors** première migration métier | **Proposé** | Backlog |
| D-027 | Phase 2.1 | Séparation responsabilités : admin / scolarité (`academic_affairs`) / finance / teacher | **Proposé — à valider** | Permissions D-013 |
| D-028 | Phase 2.1 | Tables append-only vs soft-delete documentées ; restriction si notes/paiements | **Proposé** | Rétention légale = UWB |
| D-029 | Phase 2.1 | Unicité matricule : portée institution vs global si multi-établissements | **Non décidé** | Q7 / Q34 |
| D-030 | Phase 2.1 | `departments` créés seulement si UWB confirme des départements formels | **Proposé** | Q3 — pas d’imposition structurelle |

## Mode d’emploi

1. Toute décision UWB écrite (PV, mail officiel) → passer la ligne en **Confirmé** avec référence.  
2. Ne pas implémenter de migration métier tant que D-014, D-015, D-016 (et Q32–Q34 pour inscriptions pédagogiques / promo / matricule) restent ouverts pour le module concerné.  
3. Ne pas écraser ce registre : ajouter des lignes.  
4. Les options d’unicité (D-022) et la présence de Cohort (D-021) restent documentées dans `06` / `08` jusqu’à réponse UWB — **ne pas inventer** la règle.
