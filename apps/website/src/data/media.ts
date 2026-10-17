/**
 * Médias officiels Université William Booth — source uwbcongo.org uniquement.
 */

export const uwbMedia = {
  logo: '/brand/logo-uwb.webp',
  logoFull: '/media/uwb/brand/uwbfin.png',
  heroPoster: '/images/uwb-hero-poster.jpg',
  heroVideo: '/videos/uwb-campus.mp4',
  /** Atmosphère bibliothèque numérique (hero portail documentaire). */
  libraryHero: '/images/library-hero.jpg',
  carousel: [
    '/media/uwb/carousel/01.jpg',
    '/media/uwb/carousel/02.jpg',
    '/media/uwb/carousel/03.jpg',
  ],
  /** Recteur — photo officielle (about.php / professeur). */
  rector: '/media/uwb/about/recteur.jpg',
  /** Établissement — about2.jpg (uwbcongo.org). */
  university: '/media/uwb/about/universite.jpg',
  campus: '/media/uwb/life/campus.jpg',
  courses: [
    '/media/uwb/courses/01.jpg',
    '/media/uwb/courses/02.jpg',
    '/media/uwb/courses/03.jpg',
  ],
  /** Cartes facultés — images homepage officielle img/faculte/… */
  faculty: {
    'informatique-ia': '/media/uwb/faculty/informatique-ia.jpg',
    sic: '/media/uwb/faculty/sic.jpg',
    'economie-gestion': '/media/uwb/faculty/economie-gestion.jpg',
    medecine: '/media/uwb/faculty/medecine.jpg',
    droit: '/media/uwb/faculty/droit.jpg',
    istm: '/media/uwb/faculty/istm.jpg',
    theologie: '/media/uwb/faculty/theologie.jpg',
  } as Record<string, string>,
  news: {
    /** Communiqué calendrier académique 2025-2026. */
    calendrier: '/media/uwb/news/communique-calendrier-2026.jpg',
    /** Affiche d’hommage SGA Bernard Nzinga Luzi. */
    hommage: '/media/uwb/news/hommage.png',
    /** Photo de groupe atelier Plan stratégique. */
    planStrategique: '/media/uwb/news/atelier-plan-strategique.jpg',
    /** Clôture du mois de la femme (photo de groupe officielle). */
    moisFemme: '/media/uwb/news/cloture-mois-femme.jpg',
    /** Remise de prix Challenge Bakagoal / Fondation Bakambu. */
    recompense: '/media/uwb/news/remise-prix-bakagoal.jpg',
    /** Conférence / prise de parole en amphithéâtre. */
    conference: '/media/uwb/news/conference-amphitheatre.jpg',
    /** Cérémonie / allocution officielle. */
    ceremonie: '/media/uwb/news/ceremonie-allocution.jpg',
    /** Visite / inspection d’infrastructures. */
    visiteInfra: '/media/uwb/news/visite-infrastructures.jpg',
    /** Réunion de comité / jury académique. */
    reunion: '/media/uwb/news/reunion-comite.jpg',
    /** Affiche inscriptions 2026–2027 — couverture vidéo TikTok @uwb02realite. */
    affiche: '/media/uwb/news/affiche-inscriptions.jpg',
    /** Sceau décanat Informatique & IA — réservé à cette faculté. */
    decanatInformatique: '/media/uwb/news/decanat-informatique.jpg',
  },
  staff: [
    '/media/uwb/staff/01.jpg',
    '/media/uwb/staff/02.jpg',
  ],
  credit: 'Photo officielle — uwbcongo.org',
  source: 'https://uwbcongo.org/',
} as const
