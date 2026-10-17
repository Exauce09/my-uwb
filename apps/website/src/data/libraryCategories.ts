import type { LibraryDomain, LibraryResourceType } from '../types/library'

export const libraryTypeLabels: Record<LibraryResourceType, string> = {
  livre: 'Livres numériques',
  'support-cours': 'Supports de cours',
  'tfc-tfe': 'TFC et TFE',
  'memoire-these': 'Mémoires et thèses',
  article: 'Articles scientifiques',
  revue: 'Revues',
  rapport: 'Rapports de recherche',
  institutionnel: 'Documents institutionnels',
  guide: 'Guides méthodologiques',
}

export const libraryDomainLabels: Record<LibraryDomain, string> = {
  'informatique-ia': 'Sciences informatiques & IA',
  sic: 'Information & Communication',
  'economie-gestion': 'Économie & Gestion',
  medecine: 'Médecine',
  droit: 'Droit',
  theologie: 'Théologie',
  istm: 'Techniques médicales (ISTM)',
  autre: 'Autres domaines',
}

export const libraryResourceTypes = Object.keys(
  libraryTypeLabels,
) as LibraryResourceType[]

export const libraryDomains = Object.keys(
  libraryDomainLabels,
) as LibraryDomain[]

export const libraryCopy = {
  brand: 'Bibliothèque numérique UWB',
  tagline: 'Explorez le savoir. Découvrez les idées. Construisez l’avenir.',
  intro:
    'Portail documentaire de l’Université William Booth : travaux étudiants, ressources pédagogiques et publications pour apprendre, enseigner et rechercher.',
  searchPlaceholder:
    'Titre, auteur, mot-clé, domaine, année…',
  demoNotice:
    'Le catalogue public présente uniquement des ressources issues du dépôt institutionnel. Les fiches de démonstration ne sont pas exposées aux visiteurs.',
  officialNotice:
    'Les documents marqués « Officiel UWB » proviennent de la bibliothèque virtuelle publiée sur uwbcongo.org.',
} as const

export const libraryQuickCategories: {
  label: string
  type?: LibraryResourceType
  domain?: LibraryDomain
}[] = [
  { label: 'TFC & TFE', type: 'tfc-tfe' },
  { label: 'Informatique & IA', domain: 'informatique-ia' },
  { label: 'Supports de cours', type: 'support-cours' },
  { label: 'Guides', type: 'guide' },
  { label: 'Médecine', domain: 'medecine' },
]
