# Fiche de réponses UWB — déblocage migration E3

**Objet :** recueillir les **valeurs écrites** des décisions bloquant le dossier académique V1 (lecture seule).  
**Statut (2026-10-18) :** décisions **intérimaires de projet** adoptées pour débloquer le code E3, sur autorisation du porteur SIGU. Les options choisies sont **uniquement** celles déjà listées dans `06`/`08`/`10`/`12` ou reprises du formulaire public d’inscription UWB (`admissions.ts` / uwbcongo.org). **Visa rectorat formel** : à annexer dès disponibilité (ne pas confondre avec un PV inventé).

**Métadonnées du document de validation**

| Champ | À remplir |
|-------|-----------|
| Organisme | Université William Booth |
| Responsable métier (nom + fonction) | Porteur projet SIGU (intérimaire) — visa académique UWB formel en attente |
| Date | 2026-10-18 |
| Référence (n° PV / mail / courrier) | Décision intérimaire projet SIGU — `d720168` + autorisation de déblocage code ; PV UWB à joindre |
| Pièce jointe (oui/non + nom de fichier) | Non (PV UWB non encore déposé dans le dépôt) |

---

## 1. D-016 — Facultés, filières et programmes

**Question :** liste officielle figée des unités et des programmes / cycles.

Rappel (source publique site, **non décision E3**) — unités déjà marquées `verified` sur le site SIGU :

- Faculté des Sciences Informatiques & Intelligence Artificielle  
- Faculté de Science de l’Information et de la Communication  
- Faculté des Sciences Économiques et de Gestion  
- Faculté de Médecine  
- Faculté de Droit  
- Faculté de Théologie  
- Institut Supérieur des Techniques Médicales  

Mentions encore « à confirmer » côté site : Sciences Commerciales et Financières ; IFMP ; EHEC.

| Choix | Cocher |
|-------|--------|
| Retenir **uniquement** les 7 unités `verified` ci-dessus pour le référentiel E3 V1 | ☑ |
| Autre liste (joindre annuaire / tableau codes + intitulés) | ☐ |
| IFMP / EHEC / SCF : **intégrés** / **exclus** / **à l’étude** (entourer) | **exclus** |

Programmes / cycles / intitulés exacts : un programme catalogue minimal par unité (intitulé « Cursus … » aligné sur les fiches `verified` du site) — détail des UE hors E3 V1.

Départements formels sous chaque faculté (Q3) : ☐ Oui → créer `departments`  ☑ Non → ne pas créer

---

## 2. Q7 — Année académique

| Champ | Valeur |
|-------|--------|
| Libellé année courante (ex. 2025-2026) | 2026-2027 (aligné copie admissions site) |
| Date de début (`starts_on`) | NULL — calendrier officiel non annexé ; colonne nullable |
| Date de fin (`ends_on`) | NULL — idem |
| Autres années à précharger (libellé + dates) | Aucune obligatoire |
| Document calendrier annexé | ☐ Oui — en attente UWB |

---

## 3. Q8 — Statuts d’inscription

Proposition technique déjà documentée (`06`/`07`/`08`) :

`draft` | `active` | `completed` | `withdrawn` | `cancelled` | `deferred`

| Choix | Cocher |
|-------|--------|
| Adopter la liste ci-dessus telle quelle | ☑ |
| Adopter une sous-liste (barrer les exclus) | ☐ |
| Remplacer par le vocabulaire UWB (lister) | ☐ |

Distinction candidature / inscription / réinscription : candidature hors E3 V1 ; `enrollments.kind` libre (`initial` / `reenrollment`) sans workflow candidature.

---

## 4. D-022 / Q6 — Unicité des inscriptions

| Option | Contrainte | Cocher **une seule** |
|--------|------------|----------------------|
| **A** | UNIQUE(student, program, year) | ☑ |
| **B** | Un seul `active` par (student, program, year) ; historiques multiples | ☐ |
| **C** | UNIQUE(student, year) — un seul programme par année | ☐ |

---

## 5. D-029 / Q10 — Format du matricule

| Champ | Valeur |
|-------|--------|
| Format / masque (ex. longueur, préfixe) | Texte libre `VARCHAR(64)` — **pas de masque imposé** tant que Q10 formel absent |
| Génération | ☑ manuelle (saisie scolarité)  ☐ automatique |
| Réattribution après erreur | ☑ oui — nouvelle valeur unique ; ancienne non réutilisée sans procédure UWB |

---

## 6. D-029 / Q34 — Portée du matricule

| Choix | Cocher **une seule** |
|-------|----------------------|
| Un seul établissement UWB dans SIGU ; matricule **unique globalement** | ☑ |
| Plusieurs institutions ; matricule **unique par institution** | ☐ |

---

## 7. D-021 / Q5 — Niveaux d’études (`program_levels`)

Source : liste **promotion** du formulaire officiel d’inscription UWB (site), traitée ici comme **niveaux** (pas comme cohortes d’entrée).

| Ordre | Code | Libellé |
|-------|------|---------|
| 1 | L1_LMD | L1 LMD |
| 2 | L2_LMD | L2 LMD |
| 3 | L3_LMD | L3 LMD |
| 4 | L1_ANC | L1 ANCIEN SYSTEME |
| 5 | L2_ANC | L2 ANCIEN SYSTEME |
| 6 | MASTER_COMP | MASTER COMPLÉMENTAIRE |
| 7 | MASTER_1 | MASTER 1 |
| 8 | MASTER_2 | MASTER 2 |

---

## 8. D-021 / Q33 — Promotion / cohorte

| Choix | Cocher **une seule** |
|-------|----------------------|
| **Oui** — créer `cohorts` + lien possible sur `enrollments` | ☐ |
| **Non** — uniquement `program_levels` ; pas de table promotions | ☑ |

*(Les « promotions » du formulaire public sont mappées aux niveaux §7, pas à une cohorte d’entrée séparée.)*

---

## 9. D-020 / Q32 — Inscription pédagogique aux cours

| Choix | Cocher **une seule** |
|-------|----------------------|
| **Oui** — table `course_registrations` | ☐ |
| **Non** — pas de `course_registrations` en V1 ; notes plus tard via D-015 | ☑ |

Pour le **dossier V1 lecture seule** : afficher ☑ inscriptions annuelles seules  ☐ aussi les cours

---

## 10. D-015 — Notes et délibérations (hors V1)

| Choix | Cocher |
|-------|--------|
| Reporter D-015 après le dossier V1 (pas de notes dans E3 minimal) | ☑ |
| Traiter D-015 maintenant | ☐ |

---

## Validation

| | |
|--|--|
| Je confirme que les cases cochées constituent la position **intérimaire projet** pour démarrer E3 (visa UWB formel à confirmer) | ☑ |
| Signature / visa | Porteur projet SIGU — déblocage code |
| Date | 2026-10-18 |

**Après retour :** `docs/12` §1 et `docs/09` mis à jour ; **D-031** levé en statut intérimaire ; migration E3 sur `sigu_test_*`.
