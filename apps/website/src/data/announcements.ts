/**
 * Bande d’annonces / communiqués (inscriptions, alertes).
 * Éditer ici pour publier un communiqué sans toucher au layout.
 */

export type Announcement = {
  id: string
  label: string
  message: string
  href: string
  cta: string
  active: boolean
}

export const announcements: Announcement[] = [
  {
    id: 'inscriptions-2026-2027',
    label: 'Communiqué',
    message:
      'Inscriptions 2026–2027 — consultez les informations d’admission et les canaux officiels.',
    href: '/admissions',
    cta: 'En savoir plus',
    active: true,
  },
]

export function getActiveAnnouncements(): Announcement[] {
  return announcements.filter((a) => a.active)
}
