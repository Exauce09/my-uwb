/**
 * Jeux d’images par section « À propos ».
 * Chaque série est vérifiée pour coller au sens du contenu (photos UWB uniquement).
 */

export type AboutMediaShot = {
  src: string
  alt: string
  credit: string
}

/** Hero — bienvenue / vie universitaire (amphithéâtre, diplômes, cérémonie). */
export const aboutHeroImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/carousel/01.jpg',
    alt: 'Amphithéâtre et étudiants Université William Booth',
    credit: 'Vie universitaire — carrousel officiel uwbcongo.org',
  },
  {
    src: '/media/uwb/life/vie-etudiante.jpg',
    alt: 'Diplômés Université William Booth',
    credit: 'Vie étudiante — uwbcongo.org',
  },
  {
    src: '/media/uwb/life/communaute.jpg',
    alt: 'Cérémonie officielle UWB',
    credit: 'Communauté universitaire — uwbcongo.org',
  },
]

/** Identité — campus et bâtiments (pas de cérémonie ni d’affiche). */
export const aboutIdentityImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/campus.jpg',
    alt: 'Bâtiment du campus Université William Booth',
    credit: 'Campus UWB — uwbcongo.org',
  },
  {
    src: '/media/uwb/courses/02.jpg',
    alt: 'Infrastructures universitaires UWB',
    credit: 'Campus — uwbcongo.org',
  },
  {
    src: '/media/uwb/about/universite.jpg',
    alt: 'Université William Booth — vue institutionnelle',
    credit: 'Établissement — uwbcongo.org',
  },
]

/** Valeurs — cérémonies et cadre institutionnel solennel. */
export const aboutValuesImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/communaute.jpg',
    alt: 'Cérémonie officielle UWB',
    credit: 'Communauté — uwbcongo.org',
  },
  {
    src: '/media/uwb/carousel/02.jpg',
    alt: 'Cérémonie académique Université William Booth',
    credit: 'Cérémonie — carrousel officiel uwbcongo.org',
  },
  {
    src: '/media/uwb/staff/01.jpg',
    alt: 'Cérémonie académique — toge et ouverture d’année',
    credit: 'Cérémonie académique UWB — uwbcongo.org',
  },
]

/** Vie universitaire — formation en amphithéâtre + campus. */
export const aboutCampusPrimary: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/formation.jpg',
    alt: 'Amphithéâtre et formation à l’UWB',
    credit: 'Formation — uwbcongo.org',
  },
  {
    src: '/media/uwb/carousel/01.jpg',
    alt: 'Amphithéâtre Université William Booth',
    credit: 'Vie universitaire — uwbcongo.org',
  },
]

export const aboutCampusSecondary: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/vie-etudiante.jpg',
    alt: 'Diplômés Université William Booth',
    credit: 'Vie étudiante — uwbcongo.org',
  },
  {
    src: '/media/uwb/life/campus.jpg',
    alt: 'Campus Université William Booth',
    credit: 'Campus — uwbcongo.org',
  },
]

/**
 * Recherche — travaux académiques / savoir (pas de visuel stock « AI » générique).
 */
export const aboutResearchImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/news/conference-amphitheatre.jpg',
    alt: 'Échanges académiques en amphithéâtre UWB',
    credit: 'Travaux académiques — uwbcongo.org / RTUS',
  },
  {
    src: '/media/uwb/life/formation.jpg',
    alt: 'Étudiants en amphithéâtre — formation UWB',
    credit: 'Formation — uwbcongo.org',
  },
  {
    src: '/media/uwb/news/reunion-comite.jpg',
    alt: 'Réunion académique et documentaire UWB',
    credit: 'Réunion institutionnelle — uwbcongo.org',
  },
]

/** Étudiants — parcours, diplômes, accompagnement en formation. */
export const aboutStudentsImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/vie-etudiante.jpg',
    alt: 'Diplômés Université William Booth',
    credit: 'Vie étudiante — uwbcongo.org',
  },
  {
    src: '/media/uwb/life/formation.jpg',
    alt: 'Étudiants en amphithéâtre UWB',
    credit: 'Formation — uwbcongo.org',
  },
  {
    src: '/media/uwb/carousel/03.jpg',
    alt: 'Communauté étudiante Université William Booth',
    credit: 'Vie universitaire — carrousel officiel uwbcongo.org',
  },
]

/** CTA — avenir (diplômes / formation), pas d’affiche ni de chantier. */
export const aboutCtaImages: AboutMediaShot[] = [
  {
    src: '/media/uwb/life/vie-etudiante.jpg',
    alt: 'Diplômés Université William Booth',
    credit: 'Vie étudiante — uwbcongo.org',
  },
  {
    src: '/media/uwb/carousel/03.jpg',
    alt: 'Communauté universitaire UWB',
    credit: 'Carrousel officiel — uwbcongo.org',
  },
  {
    src: '/media/uwb/life/formation.jpg',
    alt: 'Formation à l’Université William Booth',
    credit: 'Formation — uwbcongo.org',
  },
]
