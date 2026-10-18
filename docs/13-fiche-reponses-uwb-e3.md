# Fiche de réponses UWB — déblocage migration E3

**Objet :** recueillir les **valeurs écrites** des décisions bloquant le dossier académique V1 (lecture seule).  
**Usage :** un responsable UWB coche / complète chaque case, signe, puis l’équipe SIGU reporte les valeurs dans `docs/12` §1 et passe les lignes concernées en **Confirmé** dans `docs/09` (lève **D-031**).  
**Interdit :** inventer une réponse ; laisser une case vide = E3 reste bloqué pour ce point.

**Métadonnées du document de validation**

| Champ | À remplir |
|-------|-----------|
| Organisme | Université William Booth |
| Responsable métier (nom + fonction) | |
| Date | |
| Référence (n° PV / mail / courrier) | |
| Pièce jointe (oui/non + nom de fichier) | |

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
| Retenir **uniquement** les 7 unités `verified` ci-dessus pour le référentiel E3 V1 | ☐ |
| Autre liste (joindre annuaire / tableau codes + intitulés) | ☐ → préciser : _______________ |
| IFMP / EHEC / SCF : **intégrés** / **exclus** / **à l’étude** (entourer) | |

Programmes / cycles / intitulés exacts (joindre document ou lister) :

```
(à remplir ou annexer)
```

Départements formels sous chaque faculté (Q3) : ☐ Oui → créer `departments`  ☐ Non → ne pas créer

---

## 2. Q7 — Année académique

| Champ | Valeur |
|-------|--------|
| Libellé année courante (ex. 2025-2026) | |
| Date de début (`starts_on`) | |
| Date de fin (`ends_on`) | |
| Autres années à précharger (libellé + dates) | |
| Document calendrier annexé | ☐ Oui — nom : _______________ |

---

## 3. Q8 — Statuts d’inscription

Proposition technique déjà documentée (`06`/`07`/`08`) — **non officielle** :

`draft` | `active` | `completed` | `withdrawn` | `cancelled` | `deferred`

| Choix | Cocher |
|-------|--------|
| Adopter la liste ci-dessus telle quelle | ☐ |
| Adopter une sous-liste (barrer les exclus) | ☐ → liste retenue : _______________ |
| Remplacer par le vocabulaire UWB (lister) | ☐ → _______________ |

Distinction candidature / inscription / réinscription (brève) :

```
(à remplir)
```

---

## 4. D-022 / Q6 — Unicité des inscriptions

Un étudiant peut-il être inscrit à **deux programmes** la même année ?

| Option | Contrainte | Cocher **une seule** |
|--------|------------|----------------------|
| **A** | UNIQUE(student, program, year) | ☐ |
| **B** | Un seul `active` par (student, program, year) ; historiques multiples | ☐ |
| **C** | UNIQUE(student, year) — un seul programme par année | ☐ |

---

## 5. D-029 / Q10 — Format du matricule

| Champ | Valeur |
|-------|--------|
| Format / masque (ex. longueur, préfixe) | |
| Génération | ☐ manuelle  ☐ automatique  ☐ autre : _____ |
| Réattribution après erreur | ☐ oui  ☐ non — règle : _____ |

---

## 6. D-029 / Q34 — Portée du matricule

| Choix | Cocher **une seule** |
|-------|----------------------|
| Un seul établissement UWB dans SIGU ; matricule **unique globalement** | ☐ |
| Plusieurs institutions ; matricule **unique par institution** | ☐ |

---

## 7. D-021 / Q5 — Niveaux d’études (`program_levels`)

Lister codes, libellés et ordre (ex. L1, L2… ou G1…) :

| Ordre | Code | Libellé |
|-------|------|---------|
| 1 | | |
| 2 | | |
| 3 | | |
| … | | |

---

## 8. D-021 / Q33 — Promotion / cohorte

L’UWB gère-t-elle une **promotion** distincte du **niveau** ?

| Choix | Cocher **une seule** |
|-------|----------------------|
| **Oui** — créer `cohorts` + lien possible sur `enrollments` | ☐ |
| **Non** — uniquement `program_levels` ; pas de table promotions | ☐ |

---

## 9. D-020 / Q32 — Inscription pédagogique aux cours

| Choix | Cocher **une seule** |
|-------|----------------------|
| **Oui** — table `course_registrations` distincte de `enrollments` ; notes (plus tard) liées à une registration | ☐ |
| **Non** — pas de `course_registrations` en V1 ; préciser le lien alternatif notes↔… (si notes un jour) : _______________ | ☐ |

Pour le **dossier V1 lecture seule** : afficher ☐ inscriptions annuelles seules  ☐ aussi les cours (si Oui ci-dessus)

---

## 10. D-015 — Notes et délibérations (hors V1)

| Choix | Cocher |
|-------|--------|
| Reporter D-015 après le dossier V1 (pas de notes dans E3 minimal) | ☐ |
| Traiter D-015 maintenant (joindre règlement notation / délibération) | ☐ |

---

## Validation

| | |
|--|--|
| Je confirme que les cases cochées constituent la position officielle UWB pour SIGU | ☐ |
| Signature / visa | |
| Date | |

**Après retour :** mettre à jour `docs/12` §1, `docs/09` (Confirmé + référence), lever **D-031**, puis seulement démarrer la migration E3 sur base `sigu_test_*`.
