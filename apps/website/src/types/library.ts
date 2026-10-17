export type LibraryResourceType =
  | 'livre'
  | 'support-cours'
  | 'tfc-tfe'
  | 'memoire-these'
  | 'article'
  | 'revue'
  | 'rapport'
  | 'institutionnel'
  | 'guide'

export type LibraryDomain =
  | 'informatique-ia'
  | 'sic'
  | 'economie-gestion'
  | 'medecine'
  | 'droit'
  | 'theologie'
  | 'istm'
  | 'autre'

export type LibraryAccessLevel = 'public' | 'etudiant' | 'enseignant' | 'restreint'

export type LibraryPublicationStatus =
  | 'brouillon'
  | 'en-attente'
  | 'publie'
  | 'archive'

export type LibraryDocument = {
  id: string
  title: string
  authors: string[]
  description: string
  type: LibraryResourceType
  academicDomain: LibraryDomain
  publicationYear: number
  keywords: string[]
  coverUrl: string
  fileUrl?: string
  fileFormat?: 'pdf' | 'docx'
  fileSizeLabel?: string
  accessLevel: LibraryAccessLevel
  publicationStatus: LibraryPublicationStatus
  /** true = reprise catalogue officiel uwbcongo.org */
  isOfficial: boolean
  /** true = entrée fictive pour tester l’UI */
  isDemo: boolean
  featured?: boolean
  /** Démo uniquement — popularité simulée */
  demoPopularity?: number
}

export type LibrarySort = 'pertinence' | 'titre' | 'date-desc' | 'date-asc'

export type LibraryFiltersState = {
  query: string
  types: LibraryResourceType[]
  domains: LibraryDomain[]
  year: number | 'all'
  sort: LibrarySort
}
