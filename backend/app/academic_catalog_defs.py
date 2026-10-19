"""Définitions référentiel E3 V1 — décisions intérimaires docs/13 (D-016, D-021, Q7).

Source de vérité partagée seed / validation API. Visa UWB formel encore attendu.
"""

from __future__ import annotations

# D-016 — 7 unités verified ; IFMP / EHEC / SCF exclus
D016_UNITS: list[tuple[str, str, str, str, str]] = [
    # code_unit, name, kind, code_program, title_program
    (
        "INFO_IA",
        "Faculté des Sciences Informatiques & Intelligence Artificielle",
        "faculte",
        "INFO_IA_CURSUS",
        "Cursus en Sciences Informatiques & IA",
    ),
    (
        "SIC",
        "Faculté de Science de l’Information et de la Communication",
        "faculte",
        "SIC_CURSUS",
        "Cursus en Sciences de l’Information et de la Communication",
    ),
    (
        "ECO_GEST",
        "Faculté des Sciences Économiques et de Gestion",
        "faculte",
        "ECO_GEST_CURSUS",
        "Cursus en Sciences Économiques et de Gestion",
    ),
    (
        "MED",
        "Faculté de Médecine",
        "faculte",
        "MED_CURSUS",
        "Cursus de Médecine",
    ),
    (
        "DROIT",
        "Faculté de Droit",
        "faculte",
        "DROIT_CURSUS",
        "Cursus en Droit",
    ),
    (
        "THEO",
        "Faculté de Théologie",
        "faculte",
        "THEO_CURSUS",
        "Cursus en Théologie",
    ),
    (
        "ISTM",
        "Institut Supérieur des Techniques Médicales",
        "institut",
        "ISTM_CURSUS",
        "Formations en techniques médicales",
    ),
]

D016_UNIT_CODES: frozenset[str] = frozenset(u[0] for u in D016_UNITS)
D016_EXCLUDED_UNIT_CODES: frozenset[str] = frozenset({"IFMP", "EHEC", "SCF"})

# D-021 / Q5 — niveaux (promotions formulaire public)
D021_LEVELS: list[tuple[str, str, int]] = [
    ("L1_LMD", "L1 LMD", 1),
    ("L2_LMD", "L2 LMD", 2),
    ("L3_LMD", "L3 LMD", 3),
    ("L1_ANC", "L1 ANCIEN SYSTEME", 4),
    ("L2_ANC", "L2 ANCIEN SYSTEME", 5),
    ("MASTER_COMP", "MASTER COMPLÉMENTAIRE", 6),
    ("MASTER_1", "MASTER 1", 7),
    ("MASTER_2", "MASTER 2", 8),
]

D021_LEVEL_CODES: frozenset[str] = frozenset(c for c, _, _ in D021_LEVELS)

# Q7
Q7_CURRENT_YEAR_LABEL = "2026-2027"

ENROLLMENT_KINDS: frozenset[str] = frozenset({"initial", "reenrollment"})
