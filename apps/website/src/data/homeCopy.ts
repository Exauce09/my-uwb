/**
 * Textes de la page d’accueil — modifiables facilement.
 * Les champs `isOfficial` indiquent s’il s’agit d’un contenu institutionnel validé
 * ou d’une proposition éditoriale de design.
 */

export const homeCopy = {
  concept: {
    /** Devise institutionnelle — alignée sur `site.motto`. */
    label: 'Dignité, Honneur, Excellence',
    isOfficial: true,
    note: 'Devise officielle de l’Université William Booth.',
  },
  hero: {
    eyebrow: 'Université William Booth · Kinshasa',
    /** Titre éditorial d’accueil — non présenté comme devise officielle. */
    headline: 'Des talents d’aujourd’hui pour un monde meilleur demain.',
    headlineIsOfficial: false,
    supporting:
      'Une université à Gombe engagée pour la formation, la recherche et le service à la société, sous la devise officielle « Dignité, Honneur, Excellence ».',
    primaryCta: { label: 'Découvrir les formations', to: '/formations' },
    secondaryCta: { label: 'Visite vidéo', href: '#vie-universitaire' },
    scrollLabel: 'Explorer',
    mediaNoteOfficial:
      'Photo / vidéo de fond : privilégier le véritable campus UWB. Emplacements : /public/videos/uwb-campus.mp4 et /public/images/uwb-hero-poster.webp.',
    mediaNoteFallback:
      'Image temporaire issue du carrousel uwbcongo.org — non présentée comme photographie exclusive du campus.',
    sideCard: {
      title: 'Accès rapides',
      items: [
        { label: 'Admissions', to: '/admissions' },
        { label: 'Facultés', to: '/facultes' },
        { label: 'Actualités', to: '/actualites' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  },
  quickAccess: [
    {
      title: 'Facultés',
      description: 'Instituts et facultés de l’UWB',
      to: '/facultes',
      icon: 'building',
    },
    {
      title: 'Formations',
      description: 'Parcours et filières',
      to: '/formations',
      icon: 'graduation',
    },
    {
      title: 'Admissions',
      description: 'S’informer et s’orienter',
      to: '/admissions',
      icon: 'file',
    },
    {
      title: 'Recherche',
      description: 'Publications et travaux',
      to: '/recherche',
      icon: 'flask',
    },
    {
      title: 'Actualités',
      description: 'Vie de l’université',
      to: '/actualites',
      icon: 'megaphone',
    },
    {
      title: 'Bibliothèque',
      description: 'Ressources numériques',
      to: '/bibliotheque',
      icon: 'library',
    },
  ],
  faculties: {
    eyebrow: 'Facultés & formations',
    title: 'Une offre académique ancrée à Kinshasa',
    intro:
      'Facultés, institut et parcours de formation — une seule entrée pour découvrir l’offre académique de l’UWB.',
  },
  campusLife: {
    eyebrow: 'Vie universitaire',
    title: 'Apprendre, créer et s’engager',
    intro:
      'Espaces d’apprentissage, vie étudiante, recherche et activités universitaires. Les visuels ci-dessous utilisent des images déjà publiées par l’UWB ou des emplacements documentés — pas de faux campus inventé.',
    videoTitle: 'Regarder la visite',
    videoCaption:
      'Lecture de /public/videos/uwb-campus.mp4 lorsqu’elle est disponible ; sinon image de secours.',
  },
  newsResearch: {
    eyebrow: 'Actualités & recherche',
    title: 'Suivre l’actualité et la production académique',
    intro:
      'Annonces institutionnelles, événements et accès aux publications. Sources vérifiées ou clairement signalées.',
  },
  admissions: {
    eyebrow: 'Admissions',
    title: 'Rejoindre l’UWB',
    intro:
      'Consultez les informations d’admission, les formations et les canaux officiels pour préparer votre projet d’études à l’Université William Booth.',
    cta: 'Consulter les informations d’admission',
  },
} as const
