export type ApplicantPathway = {
  id: string
  title: string
  description: string
  /** Ancre interne (#…) ou route absolue (/…) */
  href: string
  cta: string
}

export type AdmissionStep = {
  id: string
  title: string
  text: string
  /** false = structure indicative, non confirmée comme procédure officielle exacte */
  verified: boolean
}

export type AdmissionRequirement = {
  id: string
  title: string
  text: string
  verified: boolean
  sourceNote?: string
}

export type AdmissionDocument = {
  id: string
  name: string
  explanation: string
  /** undefined = caractère obligatoire non confirmé officiellement */
  required?: boolean
  verified: boolean
}

export type AdmissionsFaqItem = {
  id: string
  question: string
  answer: string
}

export type TuitionInfo = {
  hasOfficialGrid: boolean
  academicYear?: string
  currency?: string
  message: string
  contactHint: string
}
