/**
 * Vie universitaire — photos officielles uwbcongo.org uniquement.
 * Chaque image correspond au libellé affiché (pas de visuel générique hors sujet).
 */

export type CampusShot = {
  id: string
  src: string
  alt: string
  credit: string
  span: string
  label: string
}

export const campusShots: CampusShot[] = [
  {
    id: 'campus',
    src: '/media/uwb/life/campus.jpg',
    alt: 'Bâtiment du campus Université William Booth',
    credit: 'Campus UWB — uwbcongo.org',
    span: 'lg:col-span-2 lg:row-span-2',
    label: 'Campus',
  },
  {
    id: 'formation',
    src: '/media/uwb/life/formation.jpg',
    alt: 'Amphithéâtre et étudiants UWB',
    credit: 'Formation — carrousel officiel uwbcongo.org',
    span: '',
    label: 'Formation',
  },
  {
    id: 'travaux',
    src: '/media/uwb/news/conference-amphitheatre.jpg',
    alt: 'Échanges académiques en amphithéâtre UWB',
    credit: 'Travaux académiques — uwbcongo.org / RTUS',
    span: '',
    label: 'Travaux académiques',
  },
  {
    id: 'vie-etudiante',
    src: '/media/uwb/life/vie-etudiante.jpg',
    alt: 'Diplômés Université William Booth',
    credit: 'Vie étudiante — carrousel officiel uwbcongo.org',
    span: 'lg:col-span-2',
    label: 'Vie étudiante',
  },
  {
    id: 'communaute',
    src: '/media/uwb/life/communaute.jpg',
    alt: 'Cérémonie officielle UWB',
    credit: 'Communauté — carrousel officiel uwbcongo.org',
    span: '',
    label: 'Communauté',
  },
]
