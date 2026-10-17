/**
 * Rubrique Recherche & innovation — contenus institutionnels génériques.
 * Aucune publication individuelle inventée comme officielle.
 */

export type ResearchHighlight = {
  id: string
  title: string
  summary: string
  /** Route interne du site */
  to?: string
  /** URL externe (ex. catalogue officiel uwbcongo.org) */
  href?: string
  ctaLabel: string
  tone: 'navy' | 'red' | 'gold'
}

export const researchHighlights: ResearchHighlight[] = [
  {
    id: 'publications',
    title: 'Publications scientifiques',
    summary:
      'Consultez le canal officiel des publications de l’UWB. Le catalogue intégré à ce site est encore en préparation.',
    href: 'https://uwbcongo.org/publication.php',
    ctaLabel: 'Voir le site officiel',
    tone: 'navy',
  },
  {
    id: 'tfc-tfe',
    title: 'TFC, TFE et mémoires',
    summary:
      'Travaux académiques disponibles dans la bibliothèque virtuelle de ce site. Les calendriers officiels restent ceux publiés par l’UWB.',
    to: '/bibliotheque',
    ctaLabel: 'Ouvrir la bibliothèque',
    tone: 'red',
  },
  {
    id: 'bibliotheque',
    title: 'Bibliothèque et ressources',
    summary:
      'Accès au portail documentaire intégré et aux ressources numériques de l’université.',
    to: '/bibliotheque',
    ctaLabel: 'Explorer les ressources',
    tone: 'gold',
  },
]
