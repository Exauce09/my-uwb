# Validation officielle des règles académiques UWB

**Statut :** dossier de validation métier — **Phase 3 (2026-10-18) : E3 bloqué** faute de valeurs écrites des décisions V1.  
**Périmètre :** décisions bloquant la migration académique **E3** et l’enrichissement du dossier étudiant en lecture seule.  
**Règle :** aucune option inventée dans ce document. Les options listées proviennent exclusivement de `docs/05` à `docs/10`. Les cases « décision officielle », « responsable », « date » et « référence » ne sont remplies qu’avec une **validation écrite UWB** (PV, mail institutionnel) — une approbation générale sans valeurs n’autorise pas E3.

**État technique actuel (constat, hors décision métier) :**

- Authentification étudiants / enseignants : en place (E1).
- Modèles `User`, `Role`, `Person` (+ liaison `users.person_id`) : en place (E1 / E2).
- Endpoint existant : `GET /api/v1/auth/me/dossier` — identité réelle ; section académique explicitement `not_provisioned` (aucun inventaire fictif).
- Portail étudiant / enseignant publié.
- **Aucune** table académique métier (inscriptions, programmes, notes) n’est créée tant que les décisions ci-dessous ne sont pas tranchées.

**Documents introuvables dans le dépôt :** aucun PV, mail ou compte rendu officiel UWB de validation académique ; aucun catalogue figé des programmes / matricules / barèmes. Les questions du site public (`05`) et des données (`10`) restent ouvertes.

---

## 1. Tableau de validation des décisions

Légende des colonnes finales (à compléter en réunion / par écrit) :

| Champ | Usage |
|-------|--------|
| **Décision officielle retenue** | Texte court de la règle UWB adoptée |
| **Responsable de validation** | Nom / fonction UWB |
| **Date de validation** | AAAA-MM-JJ |
| **Référence officielle** | N° de PV, courrier, mail institutionnel |

### 1.1 D-015 — Échelles de notation et délibérations

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-015 (lié à Q13–Q16 de `10-questions-validation-donnees.md`) |
| **Question exacte** | Quelles sont l’échelle de notation officielle, les pondérations UE / contrôles, les droits de saisie / modification / publication, et les règles de délibération (quorum, mentions, ajournement, codes de décision) ? |
| **Options déjà présentes dans la documentation** | Aucune option chiffrée ni code de délibération n’est documenté. Le registre (`09`) classe D-015 en **Non décidé** (« Absents des docs »). Les questions Q13–Q16 posent l’échelle (sur 20, pourcentages, lettres, …), la définition des pondérations, les acteurs autorisés, et les règles de délibération **sans inventer** les `decision_code` (`10` §D). |
| **Éléments à préciser** | Échelle ; précision des notes ; pondérations UE / contrôles et où elles sont figées ; qui saisit / modifie / publie ; composition des jurys ; mentions ; ajournement ; codes officiels de décision ; délai avant publication aux étudiants (Q17). |
| **Conséquences base de données / application** | Tables proposées (`assessments`, `grades`, `grade_change_logs`, `deliberations`, `deliberation_items` — `08` §5) : CHECK métier, `max_score`, `weight`, `decision_code` **ne doivent pas** être figés sans réponse. Tant que D-015 est ouvert : section académique du dossier reste `not_provisioned` pour les notes (`schemas/dossier.py`). |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.2 D-016 — Facultés, filières et programmes officiels

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-016 (lié à Q1–Q4 de `10` et points 1–4 de `05-questions-uwb.md`) |
| **Question exacte** | Quelle est la liste officielle et figée des facultés / instituts, le statut de IFMP / EHEC / Sciences Commerciales et Financières, et quels sont les intitulés exacts des programmes, filières et cycles (Licence, Graduat, etc.) ? |
| **Options déjà présentes dans la documentation** | Pas de liste fermée validée. Constats publics rappelés dans `05` (facultés / ISTM sur uwbcongo.org + Théologie ; mentions IFMP, EHEC, SCF « à confirmer »). Q1–Q2 demandent si la liste = uwbcongo.org uniquement et le statut IFMP / EHEC / SCF (intégrés / exclus / à l’étude). Q3 : départements formels oui/non. Q4 : intitulés programmes / cycles. |
| **Éléments à préciser** | Liste figée des `academic_units` ; inclusion / exclusion IFMP, EHEC, SCF ; présence de départements ; codes et intitulés `programs` ; cycles / diplômes. |
| **Conséquences base de données / application** | Peuplement de `academic_units`, `programs` (et éventuellement `departments` — D-030 / Q3). Sans D-016 : impossible d’ancrer une inscription académique à un programme officiel dans le dossier. |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.3 D-020 / Q32 — Inscription annuelle et inscription aux cours

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-020 / Q32 |
| **Question exacte** | L’UWB exige-t-elle une inscription pédagogique explicite étudiant ↔ offre de cours (`course_registrations`) **distincte** de l’inscription académique (`enrollments`) ? |
| **Options déjà présentes dans la documentation** | **Oui** : valider D-020 ; notes conditionnées à une `course_registration` cohérente avec l’offering (`10` Q32 ; `08` §3). **Non** : documenter un lien alternatif notes ↔ enrollment / offering (risque de notes orphelines — `10` Q32). Aucune autre variante n’est formalisée. |
| **Éléments à préciser** | Si oui : statuts de registration (proposition technique dans `08` : `registered`, `withdrawn`, `completed`… — libellés **non officiels**). Si non : règle exacte de rattachement des notes. |
| **Conséquences base de données / application** | Création ou non de `course_registrations` ; contrainte d’intégrité notes ↔ registration ; impact sur le contenu du dossier (liste des cours inscrits vs inscription annuelle seule). |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.4 D-021 / Q33 — Distinction entre niveau et promotion

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-021 / Q33 (complète Q5 révisée — niveaux d’études) |
| **Question exacte** | L’UWB gère-t-elle formellement une **promotion / cohorte d’entrée** (`cohorts`) **distincte** du **niveau d’études** (`program_levels`) ? Quels sont les niveaux officiels (ex. L1, G1, …) et leur ordre ? |
| **Options déjà présentes dans la documentation** | **Oui** : créer les deux tables ; `Enrollment` peut référencer les deux (`10` Q33 ; `07` ; `08`). **Non** : conserver uniquement `program_levels` ; ne pas inventer de promotions. Q5 (révisée) : nomenclature et ordre des niveaux — **pas d’options chiffrées** dans les docs ; « options à proposer par les responsables » pour les codes exacts. |
| **Éléments à préciser** | Existence formelle des promotions ; codes / libellés / `sort_order` des niveaux ; année d’entrée des cohortes si retenues. |
| **Conséquences base de données / application** | Présence conditionnelle de `cohorts` ; colonnes `program_level_id` / `cohort_id` sur `enrollments` et offres ; affichage dossier (niveau vs promo). |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.5 D-022 / Q6 — Unicité des inscriptions

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-022 / Q6 |
| **Question exacte** | Un étudiant peut-il être inscrit à **deux programmes** la même année académique ? Quelle contrainte d’unicité appliquer aux inscriptions académiques (`enrollments`) ? |
| **Options déjà présentes dans la documentation** (`06` §4 ; `08` §3 ; `10` Q6) | **A** — UNIQUE(student, program, year) : une ligne par programme / année. **B** — un seul `status = 'active'` par (student, program, year) ; historiques multiples. **C** — UNIQUE(student, year) : un seul programme par année (le plus restrictif). **Aucune option n’est imposée** comme règle UWB. |
| **Éléments à préciser** | Choix A, B ou C ; traitement des doubles cursus ; interaction avec les statuts (Q8). |
| **Conséquences base de données / application** | Index / contrainte UNIQUE (éventuellement partielle) sur `enrollments` ; règles métier du dossier et des écrans scolarité ; tests d’intégrité. |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.6 D-029 / Q10, Q34 — Format et portée du matricule

| Champ | Contenu |
|-------|---------|
| **Identifiant** | D-029 / Q10 / Q34 |
| **Question exacte** | Quel est le **format** du matricule étudiant (génération, unicité, réattribution) ? Un seul établissement UWB dans SIGU, ou plusieurs ? Le matricule est-il unique **globalement** ou **par institution** ? |
| **Options déjà présentes dans la documentation** | **Portée (Q34) :** unicité globale **ou** unicité par institution (`10` Q34 ; `09` D-029). **Format (Q10) :** aucune masque / algorithme documenté — « options à proposer par les responsables ». |
| **Note de cohérence documentaire** | Le registre `09` cite D-029 avec « Q7 / Q34 ». Dans `10`, **Q7** porte sur les **dates** d’année académique ; le **format** matricule est **Q10** et la **portée** est **Q34**. Ce dossier retient **Q10 + Q34** comme questions métier pour D-029. |
| **Éléments à préciser** | Masque / longueur / préfixe ; génération manuelle ou automatique ; réattribution après erreur ; unicité globale vs par `institution_id` ; éventuel matricule RH distinct (Q11 — hors D-029 strict). |
| **Conséquences base de données / application** | Colonne `student_profiles.student_number` : UNIQUE global **ou** UNIQUE(`institution_id`, `student_number`) ; validation API et affichage portail. |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

### 1.7 Q7–Q8 — Calendrier académique et statuts d’inscription

| Champ | Contenu |
|-------|---------|
| **Identifiant** | Q7 / Q8 (liées à D-009 proposé — année académique obligatoire) |
| **Question exacte** | Quelles sont les dates officielles de début / fin de chaque année académique ? Quelle est la distinction candidature / inscription / réinscription, et quels **statuts** d’inscription sont attendus ? |
| **Options déjà présentes dans la documentation** | **Dates (Q7) :** aucune date officielle dans le dépôt — « options à proposer par les responsables » / calendrier institutionnel à fournir. **Statuts (Q8) :** proposition technique **non officielle** dans `06` / `07` / `08` : `draft` → `active` → `completed` \| `withdrawn` \| `cancelled` \| `deferred`. Alignement à confirmer ou remplacer par le vocabulaire UWB. |
| **Éléments à préciser** | Libellés d’années ; `starts_on` / `ends_on` ; année courante ; processus candidature vs inscription vs réinscription ; liste fermée des statuts et transitions. |
| **Conséquences base de données / application** | Table `academic_years` ; CHECK / enum de `enrollments.status` ; historique des années passées conservé (pas d’écrasement — `06` §4). |
| **Décision officielle retenue** | _Non consignée — valeurs absentes du dépôt (audit Phase 3, 2026-10-18)_ |
| **Responsable de validation** | _Non consigné_ |
| **Date de validation** | _Non consignée_ |
| **Référence au document ou compte rendu officiel** | _Aucune pièce jointe / PV / mail dans le dépôt_ |

---

## 2. Préparation de la réunion de validation

### 2.1 Questions à poser (ordre suggéré)

1. Qui est le **responsable métier** UWB pour valider MCD/MLD et ce dossier (Q31) ?
2. Liste figée des unités et programmes (D-016 / Q1–Q4) — document officiel à annexer.
3. Niveaux d’études officiels et existence ou non des promotions (D-021 / Q5 / Q33).
4. Un étudiant peut-il suivre deux programmes la même année ? Quelle option d’unicité A / B / C (D-022 / Q6) ?
5. Format et portée du matricule (D-029 / Q10 / Q34).
6. Calendrier académique et statuts d’inscription (Q7 / Q8).
7. Inscription pédagogique aux cours distincte ou non (D-020 / Q32).
8. Pour le **dossier V1 lecture seule** : faut-il déjà des notes / délibérations, ou seulement identité + inscription annuelle (voir §2.3) ?
9. Notation et délibérations (D-015 / Q13–Q16) — si hors périmètre V1, planifier une validation ultérieure sans bloquer E3 minimal.

### 2.2 Documents officiels à demander

- Arrêté / circulaire / annuaire des **facultés, instituts et programmes** (intitulés et codes).
- **Calendrier académique** (années en cours et passées récentes : dates début / fin).
- Règlement des études : **inscription / réinscription**, double cursus, abandons.
- Règles de **matricule** (format, unicité, réattribution).
- Si promotions gérées : liste ou définition des **cohortes**.
- Si notes dans une phase ultérieure : règlement de **notation et délibération** (barèmes, codes de décision) — **ne pas inventer**.
- Désignation écrite du **validateur** (fonction + contact).

### 2.3 Décisions minimales pour démarrer le dossier étudiant en lecture seule

Objectif V1 lecture seule : afficher l’identité (déjà via `Person`) **et** le cadre d’inscription académique **sans** notes fictives.

| Décision | Pourquoi minimale |
|----------|-------------------|
| **D-016** (unités / programmes) | Ancrer l’inscription à un programme officiel |
| **Q7** (années académiques) | Rattacher l’inscription à une année |
| **Q8** (statuts) | Afficher un statut compréhensible (même liste réduite validée) |
| **D-022 / Q6** (unicité) | Contrainte d’intégrité avant toute écriture d’`enrollments` |
| **D-029 / Q10 + Q34** (matricule) | Afficher / indexer le profil étudiant |
| **D-021 / Q5 + Q33** (niveau ± promo) | Afficher le niveau ; créer ou non `cohorts` |
| **D-020 / Q32** | Savoir si le dossier V1 liste aussi les cours, ou seulement l’inscription annuelle |

Sans ces réponses : conserver `academic.status = not_provisioned` (comportement actuel).

### 2.4 Décisions reportables à une version ultérieure

| Sujet | Identifiants | Motif de report possible |
|-------|--------------|---------------------------|
| Échelles, pondérations, délibérations détaillées | D-015, Q13–Q16 | Non nécessaires au dossier V1 **lecture seule sans notes** |
| Qui saisit / publie les notes ; délais | Q15, Q17 | Module notes / jurys |
| Finances (montants, devises, remboursements) | D-014, Q18–Q22 | Hors dossier académique minimal |
| Départements formels | D-030 / Q3 | Seulement si structure confirmée |
| Permissions fines / rôle scolarité | D-013, D-027 / Q35 | Après stabilisation des rôles |
| Messagerie / IA | D-025, D-026 | Backlog explicite |
| SSO e-learning | Q23–Q24 | Intégration externe |

---

## 3. Suite technique indicative (proposition — non décision métier)

> Cette section est une **proposition d’ingénierie**. Elle ne tranche aucune règle UWB. Aucune migration Alembic académique n’est créée tant que §2.3 n’est pas validé par écrit.

### 3.1 Plan indicatif migration E3 (académique)

Ordre suggéré **après** validation écrite des décisions minimales :

1. **Référentiel structure** — `institutions` (si retenu), `academic_units`, `programs`, `academic_years`, `program_levels` ; `departments` / `cohorts` **uniquement** si Q3 / Q33 = oui.
2. **Profils étudiants** — `student_profiles` (matricule selon D-029) liés à `persons` existantes.
3. **Inscriptions académiques** — `enrollments` avec contrainte d’unicité **A, B ou C** selon D-022 ; statuts selon Q8.
4. **Inscriptions pédagogiques** — `course_offerings` + `course_registrations` **si** D-020 = oui ; sinon documenter l’alternative avant toute table de notes.
5. **Notes / délibérations** — **hors E3 minimal** tant que D-015 n’est pas validé ; rester sur placeholder dossier.

**Dépendances :** schéma E1+E2 (`users`, `roles`, `user_roles`, `persons`, `users.person_id`) déjà présents ; Alembic `upgrade` sur environnement de test dédié (`sigu_test_*`) uniquement.

**Contraintes d’intégrité à prévoir (indicatives) :**

- FK `enrollments` → `student_profiles`, `programs`, `academic_years` (+ `program_levels` / `cohorts` si retenus).
- Unicité matricule selon portée D-029.
- Unicité enrollment selon D-022.
- Si D-020 : UNIQUE(`student_profile_id`, `course_offering_id`) ; pas de note sans registration cohérente (`08`).
- Soft-delete restreint s’il existe notes / paiements liés (D-028 — proposition).

### 3.2 Enrichissement de `GET /api/v1/auth/me/dossier`

**Constat :** l’endpoint actuel est sous le préfixe auth : `/api/v1/auth/me/dossier` (pas `/api/v1/me/dossier`). Toute évolution V1 doit **étendre** cet endpoint existant — **sans** inventer de données et **sans** affaiblir l’isolation.

Proposition d’étapes (après E3 minimal) :

1. Remplacer `academic.status = not_provisioned` par un statut réel **uniquement** si des `enrollments` (et éventuellement registrations) existent pour le `person_id` du compte authentifié.
2. Réponse lecture seule : identité `Person` + liste d’inscriptions de **l’étudiant connecté uniquement** (matricule, programme, année, niveau/promo si validés, statut).
3. **Interdit :** paramètre `person_id` client ; accès enseignant/admin à un autre dossier via cet endpoint ; notes tant que D-015 non validé.
4. Messages d’absence de données : états vides explicites, jamais de jeux de notes fictifs.

### 3.3 Tests d’isolation entre étudiants (obligatoires avant exposition)

- Étudiant A authentifié : voit uniquement son dossier ; 403/404 si tentative d’accès croisé.
- Étudiant B : ne voit pas les inscriptions / matricule de A.
- Enseignant / admin sans rôle student : pas d’accès automatique au dossier étudiant via cet endpoint (comportement aligné sur les tests actuels `test_me_dossier.py`).
- Query `?person_id=` (ou équivalent) : ignorée ou rejetée — le serveur dérive uniquement de `users.person_id` de la session.
- Régression : compte sans `person_id` → identité `null` + académique non provisionné ou vide selon règle retenue, **sans** fuite.

---

## 4. Synthèse — décisions encore ouvertes

| ID | Statut dans `09` / `10` | Bloque E3 minimal ? | Bloque notes dans le dossier ? |
|----|-------------------------|---------------------|--------------------------------|
| D-015 | Non décidé | Non (si notes hors V1) | **Oui** |
| D-016 | Non décidé | **Oui** | Indirect |
| D-020 / Q32 | Proposé — à valider | **Oui** (forme du modèle cours) | Oui si notes liées aux cours |
| D-021 / Q33 | Proposé — à valider | **Oui** | Indirect |
| D-022 / Q6 | Non décidé | **Oui** | Indirect |
| D-029 / Q10, Q34 | Non décidé | **Oui** | Indirect |
| Q7–Q8 | Ouvertes | **Oui** | Indirect |

**Réponses minimales à obtenir avant de commencer E3 :** D-016, Q7, Q8, D-022/Q6, D-029 (Q10+Q34), D-021 (Q5+Q33), D-020/Q32 — par écrit, avec responsable et référence (§1).

---

## 5. Sources consultées

| Document | Rôle |
|----------|------|
| `docs/05-questions-uwb.md` | Questions site public (facultés, filières, calendrier) |
| `docs/06-architecture-donnees.md` | Glossaire, unicité A/B/C, statuts enrollment proposés |
| `docs/07-mcd.md` | Entités ProgramLevel / Cohort / Enrollment / CourseRegistration |
| `docs/08-mld.md` | Tables proposées, contraintes, notes ↔ registration |
| `docs/09-registre-decisions.md` | Statuts D-015, D-016, D-020–D-022, D-029 ; D-031 (blocage E3) |
| `docs/10-questions-validation-donnees.md` | Q1–Q36 (dont Q6–Q8, Q10, Q13–Q16, Q32–Q34) |
| `docs/11-demarrage-local-et-e2e.md` | Contexte technique local (hors règles métier) |
| `backend/app/api/auth.py`, `backend/app/schemas/dossier.py` | Comportement actuel `me/dossier` |
| `backend/alembic/versions/20260417_0001_*.py`, `20260417_0002_*.py` | Migrations E1 / E2 uniquement |

**Non trouvés dans le dépôt :** PV / courriers officiels UWB ; barème de notes ; liste figée programmes / matricules ; dates d’années académiques signées ; valeurs A/B/C, oui/non Q32–Q33, format matricule.

---

## 6. Phase 3 — audit (2026-10-18) : clôture impossible sans valeurs

### 6.1 Recherche effectuée

| Source | Résultat |
|--------|----------|
| `docs/09-registre-decisions.md` | D-016, D-022, D-029 **Non décidé** ; D-020, D-021 **Proposé — à valider** ; D-015 **Non décidé** |
| `docs/10-questions-validation-donnees.md` | Q1–Q34 ouvertes (options A/B/C documentées pour Q6 uniquement) |
| `docs/12` §1 (avant cet audit) | Cases « décision officielle » vides |
| PV / mail / compte rendu UWB dans le dépôt | **Introuvables** |
| Modèles SQLAlchemy | `User`, `Role`, `Person` uniquement — pas de tables académiques |
| Migrations Alembic | `20260417_0001` (E1), `20260417_0002` (E2 persons) — **pas d’E3** |
| Contenu public site (`admissions`, facultés) | **Non assimilable** à une décision E3 (données vitrine / formulaire, non PV) |

### 6.2 Informations manquantes (bloquantes V1)

Pour chaque décision, fournir **explicitement** :

| Décision | Valeur attendue (forme requise — pas une règle inventée ici) |
|----------|---------------------------------------------------------------|
| **D-016** | Liste figée unités + programmes (codes / intitulés) ou renvoi à un annuaire officiel daté |
| **Q7** | Libellés et dates `starts_on` / `ends_on` des années, ou document calendrier annexé |
| **Q8** | Liste fermée des statuts d’inscription (adopter, amender ou remplacer la proposition technique) |
| **D-022 / Q6** | **A**, **B** ou **C** (une seule) |
| **D-029 / Q10** | Format / génération / réattribution du matricule |
| **D-029 / Q34** | Unicité **globale** ou **par institution** (+ mono vs multi-établissements) |
| **D-021 / Q5** | Codes et ordre des niveaux d’études |
| **D-021 / Q33** | **Oui** (tables niveau + promotion) ou **Non** (niveau seul) |
| **D-020 / Q32** | **Oui** (`course_registrations`) ou **Non** (+ règle alternative documentée) |
| **Métadonnées** | Responsable, date, référence écrite (obligatoires pour passer en Confirmé dans `09`) |

### 6.3 Condition d’implémentation (Étape 3)

| Condition | État |
|-----------|------|
| Toutes les décisions V1 documentées **et** suffisamment précises | **Non** |
| Migration E3 / modèles académiques / enrichissement API dossier | **Non autorisés** |
| Notes / délibérations (D-015) | Hors périmètre (reste ouvert) |

Dès que §1 est rempli avec valeurs + références, mettre à jour `09` (Confirmé), lever D-031, puis appliquer le plan §3 (migration réversible sur `sigu_test_*` uniquement).

### 6.4 Plan technique gelé (rappel — non exécuté)

1. Migration E3 additive : `academic_years`, `academic_units`, `programs`, `program_levels`, [`cohorts` si Q33=oui], `student_profiles`, `enrollments` ; [`course_offerings` + `course_registrations` si Q32=oui].
2. Contraintes : unicité enrollment selon D-022 ; matricule selon D-029 ; FK vers `persons`.
3. `GET /api/v1/auth/me/dossier` : dériver uniquement du user authentifié ; pas de `person_id` client ; notes absentes tant que D-015 ouvert.
4. Tests : isolation A/B, 401/403/404, régression comptes E1/E2.
