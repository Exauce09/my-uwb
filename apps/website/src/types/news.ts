/**
 * Modèle actualités — prêt pour un futur admin SIGU-UWB.
 */

export type NewsStatus = 'draft' | 'published' | 'archived'

export type NewsCategoryId =
  | 'vie-universitaire'
  | 'annonces-officielles'
  | 'inscriptions-admissions'
  | 'calendrier-academique'
  | 'examens-deliberations'
  | 'recherche-scientifique'
  | 'conferences-evenements'
  | 'publications'
  | 'vie-etudiante'

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  /** Paragraphes du corps. Vide si seul le résumé est connu. */
  content: string[]
  category: NewsCategoryId
  publishedAt: string
  updatedAt?: string
  author?: string
  coverImage: string
  imageCredit: string
  tags: string[]
  featured: boolean
  status: NewsStatus
  sourceUrl?: string
  verified: boolean
  attachments?: { label: string; url: string }[]
  secondaryImages?: { src: string; alt: string; credit?: string }[]
}

export type NewsEvent = {
  id: string
  title: string
  /** Date ISO connue uniquement. */
  date: string
  kind:
    | 'conference'
    | 'seminaire'
    | 'journee-scientifique'
    | 'activite'
    | 'ceremonie'
    | 'vie-etudiante'
  summary?: string
  location?: string
  sourceUrl?: string
  relatedArticleSlug?: string
  verified: boolean
}

/** @deprecated Alias de compatibilité pour d’anciens composants. */
export type LegacyNewsCategory = 'Actualité' | 'Événement' | 'Annonce'
