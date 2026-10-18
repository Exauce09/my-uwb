# Questions à valider — architecture des données SIGU

Complète `05-questions-uwb.md` (site public). **Ne remplace pas** ce fichier.  
`05-questions-uwb.md` n’est **pas modifié** dans la phase 2.1.

Objectif : obtenir des réponses institutionnelles **avant** toute migration PostgreSQL métier.

**Légende :** chaque question = **décision métier en attente**. Les options techniques éventuelles sont rappelées ; leurs conséquences sont dans `06` / `08` / `09`.

**Phase 3 (2026-10-18) :** audit dans `docs/12` §6 et `docs/09` (D-031) — aucune réponse écrite UWB aux questions V1 n’a été trouvée dans le dépôt ; migration E3 **non démarrée**.

---

## A. Structure académique

1. La liste officielle et figée des facultés / instituts pour le référentiel SIGU est-elle celle de uwbcongo.org uniquement ?  
2. IFMP, EHEC, Sciences Commerciales et Financières : intégrés, exclus, ou « à l’étude » ?  
3. Existe-t-il des **départements** formels sous chaque faculté ?  
   - *Si non :* ne pas créer la table `departments` ; rattacher le personnel aux `academic_units`.  
   - *Si oui :* cardinalité 1 AcademicUnit → 0..N Department.  
4. Quels sont les **intitulés exacts** des programmes / filières et des cycles (Licence, Graduat, etc.) ?  
5. ~~Comment se nomment les niveaux / promotions (L1, G1, …) ?~~ → **scindée en Q5 + Q33** (phase 2.1).  
5. (révisée) Quels sont les **niveaux d’études** officiels (ProgramLevel : L1, G1, …) et leur ordre ?  
6. Un étudiant peut-il être inscrit à **deux programmes** la même année académique ?  
   - *Option A :* UNIQUE(student, program, year) — une ligne par programme/année.  
   - *Option B :* un seul `active` par (student, program, year) ; historiques multiples.  
   - *Option C :* UNIQUE(student, year) — un seul programme par année.  
   Conséquences détaillées : `06-architecture-donnees.md` §4 / `08-mld.md` §3.

## B. Calendrier et inscriptions

7. Dates officielles de début / fin de chaque année académique.  
8. Distinction candidature / inscription / réinscription : processus et **statuts** attendus (alignement avec draft / active / completed / withdrawn / cancelled / deferred ?).  
9. Liste des **pièces justificatives** obligatoires et durée de conservation.  
10. Format du **matricule étudiant** (génération, unicité, réattribution).

## C. Personnel

11. Existe-t-il un matricule RH distinct du matricule étudiant ?  
12. Quelles responsabilités administratives doivent être modélisées (doyen, SG, etc.) au-delà des rôles applicatifs ?

## D. Notes et délibérations

13. Échelle de notation officielle (sur 20, pourcentages, lettres, …).  
14. Pondérations UE / contrôles : qui les définit et où sont-elles figées ?  
15. Qui peut saisir, modifier, publier une note ?  
16. Composition et règles des **délibérations** (quorum, mentions, ajournement) — **ne pas inventer** les `decision_code`.  
17. Délai avant publication des résultats aux étudiants.

## E. Finances

18. Devise(s) officielle(s) des frais.  
19. Catalogue des frais (inscription, scolarité, autres) et montants / barèmes.  
20. Canaux de paiement acceptés et références de transaction attendues.  
21. Politique d’**annulation / remboursement** (alignement avec `original_payment_id` + statuts proposés).  
22. Un étudiant peut-il s’inscrire académiquement sans solde à jour ?

## F. E-learning et systèmes externes

23. La plateforme `uwbcongo.org/enseignement` reste-t-elle le LMS de référence ?  
24. SSO / provisioning des comptes entre SIGU et e-learning : prévu ou non ?  
25. Le « mot de passe par défaut 0000 » mentionné sur inscription.php reste-t-il une pratique à refléter (risque sécurité) ?

## G. Messagerie, documents, IA, conservation

26. Durées de conservation des messages, pièces et logs d’audit.  
27. Qui peut accéder aux dossiers documentaires (identité, médicaux éventuels) ?  
28. L’assistant IA est-il souhaité en phase initiale ? Sur quels documents approuvés uniquement ?  
29. Hébergement des fichiers (disque serveur, object storage) et localisation des données.

## H. Organisation du projet données

30. Ordre de priorité des modules métier (proposition dans `06-architecture-donnees.md`) : validation ou réordonnancement ?  
31. Qui est le **responsable métier** UWB pour valider le MCD/MLD ?

---

## I. Questions ajoutées phase 2.1 (audit A01–A22)

32. **Inscriptions pédagogiques aux cours** — L’UWB exige-t-elle une inscription explicite étudiant ↔ offre de cours (`course_registrations`) distincte de l’inscription académique (`enrollments`) ?  
    - *Si oui :* valider D-020 ; notes conditionnées à une registration cohérente.  
    - *Si non :* documenter le lien alternatif notes ↔ enrollment / offering (risque de notes orphelines).  
33. **Distinction promotion / niveau** — L’UWB gère-t-elle formellement une **promotion / cohorte d’entrée** (`cohorts`) **distincte** du **niveau d’études** (`program_levels`) ?  
    - *Si oui :* créer les deux tables ; Enrollment peut référencer les deux.  
    - *Si non :* conserver uniquement ProgramLevel ; ne pas inventer de promotions.  
34. **Portée de l’unicité du matricule** — Un seul établissement UWB dans SIGU, ou plusieurs ? Le matricule est-il unique **globalement** ou **par institution** ?

35. **Rôle scolarité** — Valider l’ajout d’un profil `academic_affairs` distinct de `admin` / `finance` / `teacher` (D-027) ?

36. **Extension `users.person_id`** — L’UWB valide-t-elle le lien compte ↔ personne comme source d’identité (D-019), en conservant le schéma E1 actuel jusqu’à migration d’extension ?

---

## Informations manquantes (constat conception)

Sans réponses aux items ci-dessus, l’équipe technique **ne doit pas** :

- fixer des CHECK métier sur les notes ou les montants ;  
- peupler un catalogue de frais « officiel » ;  
- déclarer une facture payée sans workflow de confirmation ;  
- fusionner Person et User de façon irréversible ;  
- imposer l’option A, B ou C d’unicité des inscriptions ;  
- inventer les codes de délibération ou la structure départementale ;  
- intégrer messagerie / IA dans la première migration métier.
