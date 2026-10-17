/**
 * Modèle facultés / instituts — prêt pour SIGU-UWB.
 */

export type FacultyKind = 'faculte' | 'institut'

/** Catégories d’orientation (liées aux entités confirmées uniquement). */
export type OrientationCategoryId =
  | 'informatique-technologies'
  | 'economie-gestion'
  | 'communication'
  | 'droit'
  | 'sante'
  | 'theologie'

export type FacultyProgram = {
  id: string
  title: string
  /** Libellé tel que publié — ne pas inventer Licence/Master. */
  cycle: string
  summary: string
  verified: boolean
}

export type Faculty = {
  id: string
  slug: string
  name: string
  shortName: string
  kind: FacultyKind
  summary: string
  mission?: string
  domains?: string[]
  image: string
  imageCredit: string
  programs: FacultyProgram[]
  leadership?: { role: string; name: string }[]
  sourceUrl?: string
  featured: boolean
  /**
   * `true` : entité confirmée sur les sources institutionnelles et listée publiquement.
   * `false` : donnée conservée pour validation UWB — masquée de l’interface publique (phase D3).
   * Ne signifie pas une affirmation d’inexistence.
   */
  verified: boolean
  note?: string
  orientationCategory?: OrientationCategoryId
  sourceLabel?: string
}
