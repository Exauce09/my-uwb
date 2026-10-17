# Architecture des données — SIGU-UWB

**Statut :** proposition de conception (phase 2.1, post-audit) — **non implémentée** en base PostgreSQL métier.  
**Périmètre :** conception uniquement. Aucune migration exécutable dans ce document.

Complète : `07-mcd.md`, `08-mld.md`, `09-registre-decisions.md`, `10-questions-validation-donnees.md`.  
`05-questions-uwb.md` reste la référence pour le **site public** (non modifié).

**Classification des éléments :**  
- **Confirmé (doc dépôt)** — stack, E1, filtres publics, URLs officielles.  
- **Proposition technique** — modèle proposé par l’équipe.  
- **Décision métier en attente** — options documentées, sans réponse inventée.

---

## 1. État des lieux de l’existant

### 1.1 Confirmé par la documentation du dépôt

| Décision | Source |
|----------|--------|
| Monorepo : `apps/website`, `apps/sigu-web`, `backend`, `docs` | `README.md` |
| Site public React + TypeScript + Vite + Tailwind | `apps/website/` |
| Portail métier prévu : `apps/sigu-web` (non initialisé) | `apps/sigu-web/README.md` |
| Backend FastAPI + PostgreSQL ; socle E1 | `backend/README.md` |
| Auth JWT cookie httpOnly (+ Bearer tests) ; bcrypt ; RBAC | `backend/README.md` |
| Rôles E1 : `student`, `teacher`, `finance`, `admin` | `backend/app/models/role.py` |
| Tables E1 : `users`, `roles`, `user_roles` (**sans** `person_id` aujourd’hui) | modèles E1 |
| Contenu public filtré par `verified` | `faculties.ts` |
| E-learning / bibliothèque via URLs uwbcongo.org | `site.ts` |
| Grilles tarifaires non publiées sur le site | `admissions.ts` |

### 1.2 Propositions techniques (phase 2.1)

- Séparation **Person** / **User** ; `persons` = source de vérité identité si compte lié.
- Extension future `users.person_id` (nullable) sans casser E1.
- `CourseOffering` (nom unique) + **`CourseRegistration`** (inscription pédagogique).
- Distinction **ProgramLevel** (niveau L1/L2…) vs **Cohort/Promotion** (cohorte d’entrée).
- Statuts de paiement + allocations + remboursements liés ; reçus uniquement sur paiement `confirmed`.
- Soft-delete vs tables append-only ; RESTRICT si historique notes/paiements.
- Intégration LMS existant ; IA sous ACL ; messagerie/IA en **backlog** (pas v1 migration).

### 1.3 Décisions métier en attente

Voir `10-questions-validation-donnees.md` et registre `09` (D-014 à D-016, D-018+).

---

## 2. Glossaire (harmonisé)

| Terme | Sens | Classification |
|-------|------|----------------|
| **Institution** | Entité racine UWB | Proposition / identité publique connue |
| **AcademicUnit** | Faculté, institut ou autre unité | Proposition — liste = **attente UWB** |
| **Department** | Subdivision éventuelle d’une AcademicUnit | **Attente** — créer seulement si confirmé |
| **Program** | Filière / programme de formation | **Attente** — intitulés |
| **AcademicYear** | Période académique officielle | **Attente** — dates |
| **ProgramLevel** | Niveau d’études dans un cursus (ex. L1, G2) — **pas** la cohorte | Proposition — nomenclature **attente** |
| **Cohort / Promotion** | Cohorte d’entrée (ex. promo 2024) distincte du niveau | Proposition — **attente** existence formelle |
| **Course** | UE / cours catalogue | Proposition |
| **CourseOffering** | Instance d’un cours pour un programme + année (+ niveau éventuel) | Proposition technique *(ex-ProgramCourseOffering)* |
| **CourseRegistration** | Inscription pédagogique étudiant ↔ offre de cours | Proposition — **à valider** |
| **Enrollment** | Inscription académique étudiant ↔ programme ↔ année | Proposition — règles **attente** |
| **Person** | Identité physique | Proposition |
| **User** | Compte de connexion | Confirmé E1 |
| **AiThread** | Fil de conversation assistant IA *(pas AiConversation)* | Proposition — backlog |
| **ExternalSystemLink** | Lien vers compte / ressource système externe (LMS) | Proposition |

---

## 3. Domaines fonctionnels

### A. Structure

`Institution`, `AcademicUnit`, `Department` (optionnel), `Program`, `AcademicYear`, `ProgramLevel`, `Cohort` (optionnel), `Course`, **`CourseOffering`**.

**Cardinalité AcademicUnit → Department (proposition) :**  
une `AcademicUnit` **0..N** `Department`. Un `Department` appartient à **exactement une** `AcademicUnit`.  
*Ne pas créer `departments` tant que l’UWB n’a pas confirmé l’existence formelle de départements (Q3).*

### B. Étudiants

`Person`, `StudentProfile`, `Application` (si distinct), `Enrollment`, `EnrollmentDocument`, **`CourseRegistration`**.

### C. Personnel

`StaffProfile`, `StaffAssignment`, `CourseAssignment`.

### D. Sécurité

E1 : `users`, `roles`, `user_roles`. Extension : `person_id`, `audit_logs`, permissions fines + rôle scolarité (**attente**).

### E. Notes

`Assessment`, `Grade`, `grade_change_logs`, `Deliberation`, `DeliberationItem`. Grade liée à une évaluation d’une offre **et** cohérente avec une `CourseRegistration` active.

### F. Finances

`FeeType`, `StudentCharge`, `Payment`, `PaymentAllocation`, `Receipt` (+ lien remboursement).

### G–I. Backlog (hors première migration)

E-learning (`external_system_links`, `learning_resource_refs`), messagerie, assistant IA (`approved_knowledge_documents`, `ai_threads`, `ai_messages`).

---

## 4. Années académiques, inscriptions et historique

1. Inscriptions académiques, offres, créances et délibérations rattachées à une `academic_year`.  
2. Nouvelle année = **nouvelles lignes** (pas d’écrasement).  
3. **Statuts d’enrollment (proposition technique, libellés à valider) :**  
   `draft` → `active` → `completed` | `withdrawn` | `cancelled` | `deferred`.  
   Les inscriptions des années passées restent en base avec statut terminal (`completed`, etc.).  
4. Corrections notes / paiements : **audit append-only** ou nouvelles lignes de statut — jamais suppression silencieuse.

### Unicité des inscriptions académiques — options (**attente UWB Q6**)

| Option | Contrainte | Conséquence |
|--------|------------|-------------|
| **A** | UNIQUE (student, program, year) | Une ligne par programme/année ; simple ; bloque le double cursus sur deux programmes la même année via une 2ᵉ ligne |
| **B** | UNIQUE partielle : un seul `status = 'active'` par (student, program, year) | Historiques multiples (withdrawn, completed…) ; un seul actif ; double cursus possible si deux programmes |
| **C** | UNIQUE (student, year) | Un seul programme par année académique ; le plus restrictif |

**Aucune option n’est imposée comme règle UWB.** Le MLD liste les trois ; choix gelé seulement après réponse Q6.

---

## 5. Identité : `persons` source de vérité

**Proposition technique :**

- Lorsque `users.person_id` est renseigné, les attributs d’identité affichés (nom, etc.) proviennent de **`persons`**.  
- `users.full_name` (E1) : conserve pour comptes non encore liés ; une fois liés, traité comme **cache déprécié** (ne plus le modifier comme source).  
- Ne pas fusionner Person et User.

### Extension E1 `users.person_id`

| État actuel (confirmé) | Extension proposée |
|------------------------|-------------------|
| Colonnes E1 sans `person_id` | Ajouter `person_id UUID NULL UNIQUE FK → persons` |
| Comptes admin bootstrap sans personne | Autorisé (`person_id` NULL) |
| Migration | Additive, non destructive ; **pas dans ce document** |

---

## 6. Rôles et séparation des responsabilités

| Rôle | Classification | Accès typique (proposition) |
|------|----------------|------------------------------|
| `student` | Confirmé E1 | Son dossier, notes publiées, soldes |
| `teacher` | Confirmé E1 | Offres assignées, saisie notes selon workflow |
| `finance` | Confirmé E1 | Créances, confirmation paiements, reçus — pas les notes |
| `admin` | Confirmé E1 | Référentiels / comptes ; actions journalisées |
| `academic_affairs` (scolarité) | **Proposition / attente** | Inscriptions, documents, publication résultats — sans droits finance complets |

Permissions fines (`grades.publish`, `payments.confirm`, …) : tables `permissions` / `role_permissions` — **reportées** (D-013) mais recommandées avant production.

---

## 7. Suppressions, conservation, audit

| Type de table | Stratégie proposée |
|---------------|-------------------|
| Jointures techniques (`user_roles`, allocations annulables en draft) | CASCADE possible |
| Notes publiées, paiements `confirmed`/`refunded`, reçus, audit | **RESTRICT** suppression parent ; pas de DELETE métier |
| Documents, messages (si activés) | Soft-delete `deleted_at` + politique de purge (**attente Q26**) |
| `grade_change_logs`, `audit_logs`, historique paiements | **Append-only** |

---

## 8. Relations systèmes

Inchangé : site public → sigu-web → FastAPI → PostgreSQL ; LMS externe via liens / SSO éventuel (**attente Q23–24**).  
Messagerie et IA : backlog après modules cœur.

---

## 9. Ordre de modules (après validations)

1. Institution, academic_units, academic_years (+ persons, lien users) + audit  
2. Programs / levels / cohorts (selon réponses UWB)  
3. Enrollments + documents  
4. Courses, offerings, **course_registrations**, affectations enseignants  
5. Assessments, grades, grade_change_logs, délibérations  
6. Finances  
7. Intégration LMS  
8. Messagerie / notifications  
9. Assistant IA  

---

## 10. Risques résiduels

Référentiel facultés non figé ; confusion niveau/promotion si non tranchée ; notes sans registration ; soldes sans workflow ; admin trop large sans scolarité.

**Prochaine étape :** validation UWB (`10`) → gel sous-ensemble de tables → puis seulement migrations (hors site public).
