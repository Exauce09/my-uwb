export type ContactChannel = {
  id: string
  kind: 'address' | 'phone' | 'email' | 'website'
  label: string
  value: string
  href: string
  actionLabel: string
  verified: boolean
  note?: string
}

export type ContactDepartment = {
  id: string
  title: string
  description: string
  /** Prefill for the contact form subject */
  subjectHint: string
  email?: string
  phone?: string
  cta: string
}

export type ContactFaqItem = {
  id: string
  question: string
  answer: string
}

export type InstitutionalLink = {
  label: string
  to: string
  available: boolean
  note?: string
}

export type CampusMapConfig = {
  /** 'zone' = carte de secteur sans prétendre marquer l’entrée exacte */
  mode: 'zone'
  title: string
  addressLabel: string
  zoneLabel: string
  disclaimer: string
  /** Embed OpenStreetMap (bbox zone) — sans marqueur d’entrée campus */
  osmEmbedUrl: string
  osmSearchUrl: string
  googleSearchUrl: string
  directionsUrl: string
  fallbackImage: string
  fallbackAlt: string
}
