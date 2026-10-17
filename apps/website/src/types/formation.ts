/**
 * Modèle formation — données publiques uniquement si documentées.
 */

export type Formation = {
  id: string
  slug: string
  title: string
  facultyId: string
  facultySlug: string
  facultyName: string
  facultyShortName: string
  kind: 'faculte' | 'institut'
  /** Cycle tel que publié (souvent « À préciser »). */
  cycleLabel: string
  cycleVerified: boolean
  summary: string
  domains: string[]
  /** Objectifs / mission de la faculté si disponibles. */
  objectives?: string
  verified: boolean
  sourceUrl?: string
  image: string
  imageCredit: string
  status: 'published' | 'draft'
}
