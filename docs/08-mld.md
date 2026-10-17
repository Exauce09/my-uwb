# MLD — Modèle Logique de Données (PostgreSQL cible)

**Statut :** proposition technique phase 2.1 — **aucune migration métier** dans cette phase.  
**Schéma E1 confirmé :** `users`, `roles`, `user_roles` (Alembic existant).

Types : `UUID` PK sauf `roles` (integer E1). Timestamps `timestamptz`. Soft-delete : `deleted_at`. Append-only : **pas** de `UPDATE`/`DELETE` applicatif.

---

## 0. Convention de classification

| Marqueur | Signification |
|----------|----------------|
| ✓ E1 | Déjà en production schema E1 |
| ○ Prop | Proposition technique |
| ◌ Attente | Décision métier UWB requise |

---

## 1. Domaine D — Auth (E1 + extension)

### `roles` ✓ E1

| Colonne | Type | Notes |
|---------|------|--------|
| id | SERIAL PK | |
| name | VARCHAR UNIQUE | student, teacher, finance, admin (+ academic_affairs proposé) |
| description | TEXT NULL | |
| created_at | TIMESTAMPTZ | |

### `users` ✓ E1 + ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| email | VARCHAR UNIQUE NOT NULL | |
| hashed_password | VARCHAR NOT NULL | |
| full_name | VARCHAR NULL | Transition : redondant vs `persons` si `person_id` |
| is_active | BOOLEAN | |
| created_at / updated_at | TIMESTAMPTZ | |
| **person_id** | UUID NULL FK → persons | ○ Prop — extension E1 ; UNIQUE si renseigné |

**Conséquences `person_id` :** identité affichée = `persons` ; `full_name` devient cache ou est déprécié progressivement. Ne pas casser E1 tant que la migration d’extension n’est pas planifiée.

### `user_roles` ✓ E1

`(user_id, role_id)` UNIQUE.

### `permissions` / `role_permissions` ○ Prop (reporté D-013)

Matrice à valider : admin général ≠ scolarité ≠ finance ≠ enseignant (notes uniquement sur ses offerings).

### `audit_logs` ○ Prop

`id`, `actor_user_id` NULL, `action`, `entity_type`, `entity_id`, `payload` JSONB, `created_at` — **append-only**.

---

## 2. Domaine A — Structure

### `institutions` ○ Prop

`id`, `name`, `short_name`, `created_at`, `deleted_at`

### `academic_units` ○ Prop

`id`, `institution_id` FK, `code` UNIQUE(institution), `name`, `unit_type` ◌, `status`, `deleted_at`

**Cardinalité Department :** `academic_units` **1 — 0..N** `departments`. Créer `departments` **seulement si** UWB confirme l’existence de départements réels. Sinon staff rattaché à `academic_units`.

### `departments` ○ Prop (conditionnel)

`id`, `academic_unit_id` FK NOT NULL, `code`, `name`, `deleted_at`  
UNIQUE(`academic_unit_id`, `code`)

### `programs` ○ Prop

`id`, `academic_unit_id` FK, `code`, `title`, `cycle` ◌, `degree_label` ◌, `deleted_at`

### `academic_years` ○ Prop

`id`, `label`, `starts_on` ◌, `ends_on` ◌, `is_current` BOOLEAN

### `program_levels` ○ Prop

`id`, `code`, `label`, `sort_order` — **niveau d’études** (L1, L2…), **pas** une promotion.

### `cohorts` ○ Prop (Promotion)

`id`, `code`, `entry_year` ◌, `label` — **promotion / cohorte d’entrée**, **distinct** de `program_levels`.  
Création **conditionnelle** à validation Q33.

### `courses` ○ Prop

`id`, `code`, `title`, `credits` ◌, `deleted_at`

### `course_offerings` ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| course_id | FK → courses | |
| program_id | FK → programs | Association **Program — CourseOffering** corrigée (N offerings par program) |
| academic_year_id | FK → academic_years | |
| program_level_id | FK NULL → program_levels | |
| term_label | VARCHAR NULL | ◌ semestre |
| deleted_at | TIMESTAMPTZ NULL | Soft-delete |

UNIQUE proposé : (`course_id`, `program_id`, `academic_year_id`, `program_level_id`) — à affiner ◌.

**Nomenclature :** table unique `course_offerings` (plus de `program_course_offerings`).

---

## 3. Domaine B — Personnes & inscriptions

### `persons` ○ Prop — **source de vérité identité**

`id`, `last_name`, `first_name`, `other_names`, `email`, `phone`, `birth_date` ◌, `created_at`, `updated_at`, `deleted_at`  
Lorsqu’un `users.person_id` pointe ici, les attributs d’identité font foi sur `persons`.

### `student_profiles` ○ Prop

`id`, `person_id` UNIQUE FK, `student_number` UNIQUE (portée ◌ Q7 multi-établissements), `entry_date` ◌, `status`, `deleted_at`

### `staff_profiles` ○ Prop

`id`, `person_id` UNIQUE FK, `employee_number` NULL, `deleted_at`

### `applications` ○ Prop (optionnel)

`id`, `person_id`, `program_id`, `academic_year_id`, `status`, …

### `enrollments` ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| student_profile_id | FK | |
| program_id | FK | |
| academic_year_id | FK | |
| program_level_id | FK NULL | niveau |
| cohort_id | FK NULL → cohorts | promotion — si retenu |
| kind | VARCHAR | ◌ initiale / réinscription… |
| **status** | VARCHAR NOT NULL | draft, active, completed, withdrawn, cancelled, deferred |
| enrolled_on / closed_on | DATE NULL | clôture |
| deleted_at | NULL | Soft-delete **restreint** si notes/paiements liés |

**Unicité — options ◌ Q6 (aucune imposée) :**

| Option | Contrainte | Conséquence |
|--------|------------|-------------|
| A | UNIQUE(student, program, year) | Une ligne / programme / année |
| B | UNIQUE(student, program, year) WHERE status = 'active' | Plusieurs historiques, un seul actif |
| C | UNIQUE(student, year) | Un seul programme par année |

### `enrollment_documents` ○ Prop

`id`, `enrollment_id` FK, `doc_type`, `storage_uri`, `validation_status`, `uploaded_at`, `deleted_at`

### `course_registrations` ○ Prop — **à valider (Q32)**

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| student_profile_id | FK | |
| course_offering_id | FK | |
| enrollment_id | FK NULL | cadre académique cohérent |
| status | VARCHAR | registered, withdrawn, completed… |
| registered_at | TIMESTAMPTZ | |
| deleted_at | NULL | Soft-delete restreint si grades |

UNIQUE proposé : (`student_profile_id`, `course_offering_id`)

**Lien notes :** une `grades` ligne n’est cohérente que si existe une `course_registrations` pour le même étudiant et la même offering que l’`assessments.course_offering_id`.

---

## 4. Domaine C — Affectations

### `staff_assignments` ○ Prop

`id`, `staff_profile_id`, `academic_unit_id` NULL, `department_id` NULL, `role_label`, `starts_on`, `ends_on`

### `course_assignments` ○ Prop

`id`, `staff_profile_id`, `course_offering_id`, `role` (titulaire…), UNIQUE(staff, offering, role)

---

## 5. Domaine E — Notes & délibérations

### `assessments` ○ Prop

`id`, `course_offering_id` FK, `code`, `label`, `weight` ◌, `max_score` ◌, `scheduled_at` NULL

### `grades` ○ Prop

`id`, `assessment_id` FK, `student_profile_id` FK, `score` / `grade_label` ◌, `is_published`, `recorded_at`, `recorded_by_user_id`  
UNIQUE(assessment_id, student_profile_id)  
**Pas de suppression physique** si publié / délibéré — restriction ou soft uniquement selon politique ◌.

### `grade_change_logs` ○ Prop — **append-only**

| Colonne | Type | Obligatoire |
|---------|------|-------------|
| id | UUID PK | oui |
| grade_id | FK → grades | oui |
| actor_user_id | FK → users | oui (acteur) |
| changed_at | TIMESTAMPTZ | oui (date) |
| old_value | JSONB ou TEXT | oui (ancienne valeur) |
| new_value | JSONB ou TEXT | oui (nouvelle valeur) |
| reason | TEXT | oui (motif) |

Interdit : UPDATE/DELETE applicatif sur cette table.

### `deliberations` ○ Prop — structure sans inventer les règles

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| academic_year_id | FK | |
| program_id | FK | |
| program_level_id | FK NULL | |
| session_label | VARCHAR | ex. session principale — libellé libre |
| held_on | DATE NULL | |
| status | VARCHAR | draft, closed… — **critères de passage ◌ attente** |
| notes | TEXT NULL | |
| created_at | TIMESTAMPTZ | |

### `deliberation_items` ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| deliberation_id | FK | |
| enrollment_id | FK | étudiant dans le cadre de l’année/programme |
| decision_code | VARCHAR | **codes et sens ◌ attente UWB** — ne pas inventer |
| decision_label | VARCHAR NULL | |
| comment | TEXT NULL | |
| decided_at | TIMESTAMPTZ NULL | |

UNIQUE(`deliberation_id`, `enrollment_id`) proposé.

---

## 6. Domaine F — Finances

### `fee_types` ○ Prop

`id`, `code`, `label`, `default_amount` ◌, `currency` DEFAULT 'CDF' ou 'USD' ◌

### `student_charges` ○ Prop

`id`, `student_profile_id`, `academic_year_id`, `fee_type_id`, `amount`, `due_on`, `status`, `deleted_at` (restreint)

### `payments` ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| student_profile_id | FK | |
| amount | NUMERIC | |
| currency | VARCHAR | |
| method | VARCHAR | ◌ |
| **status** | VARCHAR | `pending`, `confirmed`, `failed`, `cancelled`, `refunded` |
| paid_at | TIMESTAMPTZ NULL | |
| external_ref | VARCHAR NULL | |
| **original_payment_id** | FK NULL → payments | remboursements liés au paiement d’origine |
| created_at | TIMESTAMPTZ | |

**Règles de cohérence (proposition technique) :**

1. `PaymentAllocation` : somme des allocations ≤ montant du paiement `confirmed` ; une allocation ne cible qu’une charge ouverte.  
2. Un paiement `refunded` (ou ligne de remboursement) référence `original_payment_id` ; le montant remboursé ≤ montant confirmé d’origine.  
3. Statuts : transitions contrôlées (ex. pending→confirmed|failed|cancelled ; confirmed→refunded partiel/total via ligne liée).  
4. **Pas de DELETE** sur paiements confirmés / remboursés — historique financier.

### `payment_allocations` ○ Prop

`id`, `payment_id` FK, `student_charge_id` FK, `amount`, UNIQUE ou contrôle anti-double allocation ◌

### `receipts` ○ Prop

| Colonne | Type | Notes |
|---------|------|--------|
| id | UUID PK | |
| **payment_id** | FK UNIQUE → payments | |
| receipt_number | VARCHAR UNIQUE | |
| issued_at | TIMESTAMPTZ | |
| issued_by_user_id | FK NULL | |

**Condition formelle :** un reçu **ne peut être émis** que si `payments.status = 'confirmed'`. Refus applicatif + contrainte / check documenté.

---

## 7. Domaines G–I — Backlog (hors première migration métier)

### `external_system_links` ○ Prop (vocabulaire unifié — anciennement ExternalSystemAccount)

`id`, `person_id` FK, `system_code` (ex. moodle), `external_user_id`, `metadata` JSONB, UNIQUE(person_id, system_code)

### Messagerie (tables conceptuelles, **non migrées en v1**)

`conversations`, `messages`, `message_recipients`, `attachments`, `notifications`

### Assistant IA (**AiThread** — vocabulaire unifié, hors v1)

`approved_knowledge_documents`, `ai_threads`, `ai_messages`  
Pas de table `ai_conversations` : le terme retenu est **AiThread** / `ai_threads`.

---

## 8. Soft-delete vs append-only

| Catégorie | Tables | Règle |
|-----------|--------|--------|
| **Soft-delete** (`deleted_at`) | persons, profiles, structure, courses, offerings, enrollments*, course_registrations*, charges* | Masquage ; **restriction** si dépendances historiques |
| **Append-only** | audit_logs, grade_change_logs, (évent. payment_events) | INSERT only |
| **Restriction forte** | grades publiées, payments confirmed/refunded, receipts, deliberation_items clos | Pas de purge ; correction via log / contre-écriture |

\* Suppression logique **interdite ou restreinte** s’il existe notes, paiements, reçus ou items de délibération liés — voir politique §9.

---

## 9. Règles de suppression / restriction (proposition)

| Situation | Comportement proposé |
|-----------|----------------------|
| Person / student avec enrollments historiques | Soft-delete profil ; conserver lignes |
| Enrollment avec grades ou charges | Interdire delete physique ; status terminal + soft éventuel |
| CourseOffering avec registrations / grades | Soft-delete offering ; pas de purge |
| Payment confirmed | Aucune suppression ; remboursement via nouveau flux |
| Receipt émis | Immutable |
| Grade | Modification → `grade_change_logs` ; pas d’effacement silencieux |

Politique exacte de rétention légale : **◌ attente UWB**.

---

## 10. RBAC — séparation des responsabilités (○ Prop, permissions à valider)

| Profil | Responsabilités proposées | Hors périmètre |
|--------|---------------------------|----------------|
| **admin** | Comptes, structure, paramétrage | Ne pas saisir notes métier au quotidien |
| **academic_affairs** (scolarité) | Inscriptions, dossiers, calendrier scolarité | Pas validation caisse |
| **finance** | Charges, paiements, reçus | Pas modification notes |
| **teacher** | Notes / assessments sur **ses** course_assignments | Pas inscriptions ni caisse |
| **student** | Lecture dossier / notes publiées / quittances | Pas écriture administrative |

Matrice fine `permissions` : reportée (D-013) — **à valider UWB**.

---

## 11. Ordre logique de création (hors messagerie / IA)

1. institutions → academic_units → [departments?] → programs → academic_years → program_levels → [cohorts?]  
2. courses → course_offerings  
3. persons → student_profiles / staff_profiles → users.person_id  
4. enrollments → enrollment_documents → course_registrations  
5. staff_assignments → course_assignments  
6. fee_types → student_charges → payments → payment_allocations → receipts  
7. assessments → grades → grade_change_logs  
8. deliberations → deliberation_items  
9. external_system_links (intégration)  
10. **Plus tard :** messagerie, ai_threads  

---

## 12. Hors première migration métier

- Toute table messagerie / IA  
- `permissions` détaillées (sauf rôles E1 déjà présents)  
- Montants officiels, barèmes, codes de délibération  
