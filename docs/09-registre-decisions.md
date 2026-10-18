# Registre des décisions — données SIGU-UWB

Document vivant. Distingue **confirmé (doc dépôt)**, **proposé (conception phase 2 / 2.1)**, **rejeté / reporté**, **non décidé (attente UWB)**, **intérimaire projet** (déblocage E3 en attendant visa formel).

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
| D-015 | — | Échelles de notes, pondérations, règles de délibération | **Non décidé** | Hors E3 V1 — reporté |
| D-016 | 2026-10-18 | Référentiel V1 = 7 unités `verified` ; IFMP/EHEC/SCF exclus ; pas de `departments` | **Intérimaire projet** | `13` §1 ; visa UWB formel en attente |
| D-017 | Phase 2 | Soft-delete + audit pour données sensibles | **Proposé** | Conservation à valider |
| D-018 | Phase 2.1 | Nomenclature unique : **CourseOffering** (abandon de ProgramCourseOffering) | **Proposé** | Harmonisation A01 |
| D-019 | Phase 2.1 | `persons` = source de vérité identité si `users.person_id` lié | **Proposé** | Extension E1 nullable |
| D-020 | 2026-10-18 | Pas de `course_registrations` en E3 V1 ; dossier = inscriptions annuelles | **Intérimaire projet** | `13` §9 / Q32 = Non |
| D-021 | 2026-10-18 | Niveaux = promotions formulaire inscription ; **pas** de table `cohorts` | **Intérimaire projet** | `13` §7–§8 / Q5+Q33 |
| D-022 | 2026-10-18 | Unicité Enrollment **option A** UNIQUE(student, program, year) | **Intérimaire projet** | `13` §4 / Q6 |
| D-023 | Phase 2.1 | Reçu (`receipts`) émis **uniquement** si paiement `confirmed` | **Proposé** | Règle technique |
| D-024 | Phase 2.1 | `grade_change_logs` append-only : acteur, date, old/new, motif | **Proposé** | |
| D-025 | Phase 2.1 | Vocabulaire : **AiThread** / `ai_threads` ; **ExternalSystemLink** / `external_system_links` | **Proposé** | Backlog pour messagerie/IA |
| D-026 | Phase 2.1 | Messagerie + assistant IA **hors** première migration métier | **Proposé** | Backlog |
| D-027 | Phase 2.1 | Séparation responsabilités : admin / scolarité (`academic_affairs`) / finance / teacher | **Proposé — à valider** | Permissions D-013 |
| D-028 | Phase 2.1 | Tables append-only vs soft-delete documentées ; restriction si notes/paiements | **Proposé** | Rétention légale = UWB |
| D-029 | 2026-10-18 | Matricule UNIQUE global ; format libre VARCHAR(64) ; génération manuelle | **Intérimaire projet** | `13` §5–§6 / Q10+Q34 |
| D-030 | Phase 2.1 | `departments` créés seulement si UWB confirme des départements formels | **Proposé** | Q3 = Non en V1 intérimaire |
| D-031 | 2026-10-18 | Migration académique E3 (dossier V1 lecture seule) | **Autorisé (intérimaire)** | Conditions `13` remplies en intérimaire ; visa UWB formel à confirmer |

## Phase 3 — audit puis déblocage intérimaire (2026-10-18)

1. Audit initial : fiche `13` vide → E3 bloqué (commit `dd954c1`).  
2. Instrument de collecte : `docs/13-fiche-reponses-uwb-e3.md`.  
3. **Déblocage code :** porteur projet SIGU adopte les cases de `13` (options déjà documentées + niveaux du formulaire public) pour autoriser E3 V1 **sans inventer de barème de notes (D-015)**.  
4. Un PV / mail rectorat remplacera le statut « Intérimaire projet » par **Confirmé** avec référence officielle.

## Mode d’emploi

1. Toute décision UWB écrite (PV, mail officiel) → passer la ligne en **Confirmé** avec référence.  
2. Ne pas implémenter de notes / délibérations tant que D-015 reste ouvert.  
3. Ne pas écraser ce registre : ajouter des lignes.  
4. Les options d’unicité non retenues restent documentées dans `06` / `08` pour traçabilité.  
5. Statut **Intérimaire projet** ≠ faux PV : il autorise le schéma E3 réversible en attendant le visa formel.
