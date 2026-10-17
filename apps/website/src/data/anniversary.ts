/**
 * Jubilé 30 ans UWB — fête et programme de célébration 2026.
 */

export const anniversary = {
  years: 30,
  founded: 1996,
  title: 'Fêtons 30 ans ensemble',
  subtitle: 'Jubilé de l’Université William Booth · 1996 — 2026',
  badge: 'Fête · 30 ans',
  highlight:
    'Conférences, rencontres et moments de communauté pour célébrer trois décennies de formation à Kinshasa.',
  cta: { label: 'Voir le programme', to: '/actualites' },
  moments: [
    {
      id: 'conferences',
      title: 'Conférences scientifiques',
      description: 'Cycle d’échanges dans l’amphithéâtre d’honneur.',
      when: '2026',
    },
    {
      id: 'campus',
      title: 'Journées campus',
      description: 'Ouverture à la communauté, partenaires et familles.',
      when: 'Au programme',
    },
    {
      id: 'facultes',
      title: 'Temps des facultés',
      description: 'Présentations des formations et de la vie étudiante.',
      when: 'Au programme',
    },
  ],
} as const
