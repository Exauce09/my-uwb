/**
 * Catalogue des facultés / instituts.
 * Textes repris de https://www.uwbcongo.org/ et des pages faculte.php associées.
 * Les programmes détaillés incomplets ne sont pas inventés.
 */

import type { Faculty, FacultyProgram } from '../types/faculty'

export type { Faculty, FacultyProgram, OrientationCategoryId } from '../types/faculty'
/** @deprecated Utiliser FacultyProgram */
export type Program = FacultyProgram
const imageCredit = 'Photo officielle — uwbcongo.org (page d’accueil / facultés)'
const imageCreditIllustrative = 'À confirmer — source secondaire'

export const faculties: Faculty[] = [
  {
    id: 'informatique-ia',
    slug: 'informatique-ia',
    orientationCategory: 'informatique-technologies' as const,
    name: 'Faculté des Sciences Informatiques & Intelligence Artificielle',
    shortName: 'Informatique & IA',
    kind: 'faculte',
    summary:
      'Former les futurs leaders de l’innovation technologique dans les domaines du logiciel, des données, des réseaux et de l’intelligence artificielle.',
    mission: 'Former les futurs leaders de l’innovation technologique.',
    domains: [
      'Développement logiciel : applications, logiciels, sites web',
      'Bases de données : gestion et exploitation de données',
      'Réseaux : conception et administration',
      'Sécurité informatique',
      'Intelligence artificielle',
      'Robotique',
      'Science des données',
    ],
    image: '/media/uwb/faculty/informatique-ia.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-info',
        title: 'Cursus en Sciences Informatiques & IA',
        cycle: 'Programme publié sur le site officiel',
        summary:
          'Un programme de cours par semestres (UE, volumes horaires) est publié sur la page faculté du site officiel. Consultez la source pour le détail à jour.',
        verified: true,
      },
    ],
    leadership: [
      { role: 'Membre du bureau décanal (publié)', name: 'KUTANGILA MAYOYA David' },
      { role: 'Secrétaire facultaire (publié)', name: 'KINKETE MFUMABI Hervé' },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=11',
    featured: true,
    verified: true,
  },
  {
    id: 'sic',
    slug: 'sic',
    orientationCategory: 'communication' as const,
    name: 'Faculté de Science de l’Information et de la Communication',
    shortName: 'Information & Communication',
    kind: 'faculte',
    summary:
      'Former des professionnels capables de produire, traiter, diffuser et analyser l’information dans un monde digitalisé et interconnecté.',
    mission:
      'Préparer des diplômés appelés à jouer un rôle clé dans les médias, la communication d’entreprise, le numérique, la culture et la recherche.',
    domains: [
      'Médias : journalisme, radio, télévision, presse écrite et numérique',
      'Communication d’entreprise : relations publiques, marketing, communication interne',
      'Numérique : développement web, réseaux sociaux, e-commerce',
      'Culture : édition, patrimoine numérique',
      'Recherche : études des médias, sciences de l’information, communication interculturelle',
    ],
    image: '/media/uwb/faculty/sic.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-sic',
        title: 'Cursus en Sciences de l’Information et de la Communication',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'Le détail des filières et cycles n’est pas exhaustivement publié sur la page faculté consultée. À confirmer auprès de l’administration.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=12',
    featured: true,
    verified: true,
  },
  {
    id: 'economie-gestion',
    slug: 'economie-gestion',
    orientationCategory: 'economie-gestion' as const,
    name: 'Faculté des Sciences Économiques et de Gestion',
    shortName: 'Économie & Gestion',
    kind: 'faculte',
    summary:
      'Former des professionnels hautement qualifiés en économie, gestion et finance, au service du développement économique et social.',
    mission:
      'Former des dirigeants, des experts en finance et des économistes capables d’analyser, décider et entreprendre.',
    domains: [
      'Économie : microéconomie, macroéconomie, économie internationale, économétrie',
      'Gestion : entreprise, marketing, finance, comptabilité, RH, stratégie',
      'Sciences sociales appliquées : sociologie, psychologie, droit',
      'Mathématiques et statistiques pour la décision',
    ],
    image: '/media/uwb/faculty/economie-gestion.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-eco',
        title: 'Cursus en Sciences Économiques et de Gestion',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'Missions et domaines d’enseignement publiés sur le site officiel. Liste exhaustive des filières à confirmer.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=13',
    featured: true,
    verified: true,
  },
  {
    id: 'medecine',
    slug: 'medecine',
    orientationCategory: 'sante' as const,
    name: 'Faculté de Médecine',
    shortName: 'Médecine',
    kind: 'faculte',
    summary:
      'Former des professionnels de la santé compétents, éthiques et capables de répondre aux besoins de santé des populations.',
    mission:
      'Former les futurs médecins et professionnels de santé, mener la recherche médicale et diffuser les connaissances.',
    domains: [
      'Formation des médecins, chirurgiens et professionnels de la santé',
      'Recherche pour faire avancer les connaissances médicales',
      'Diffusion des connaissances auprès des professionnels et du public',
    ],
    image: '/media/uwb/faculty/medecine.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-med',
        title: 'Cursus de Médecine',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'Mission et objectifs publiés sur le site officiel. Durée, stages et spécialités à confirmer auprès de la faculté.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=14',
    featured: true,
    verified: true,
  },
  {
    id: 'droit',
    slug: 'droit',
    orientationCategory: 'droit' as const,
    name: 'Faculté de Droit',
    shortName: 'Droit',
    kind: 'faculte',
    summary:
      'Former des juristes compétents, capables d’analyser les problèmes juridiques, d’appliquer la loi et de défendre les droits et intérêts des personnes et des sociétés.',
    mission:
      'Former des juristes aptes à analyser, appliquer le droit et défendre les droits et intérêts des individus et des sociétés.',
    domains: [
      'Droit privé : civil, contrats, famille, sociétés…',
      'Droit public : constitutionnel, administratif, international public…',
      'Sciences criminelles : droit pénal, procédure pénale, criminologie…',
      'Sciences sociales appliquées au droit : sociologie, histoire, philosophie du droit…',
    ],
    image: '/media/uwb/faculty/droit.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-droit',
        title: 'Cursus en Droit',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'Domaines de formation publiés sur le site officiel. Intitulés exacts des diplômes à confirmer.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=15',
    featured: true,
    verified: true,
  },
  {
    id: 'theologie',
    slug: 'theologie',
    orientationCategory: 'theologie' as const,
    name: 'Faculté de Théologie',
    shortName: 'Théologie',
    kind: 'faculte',
    summary:
      'Former des serviteurs de Dieu capables de répondre aux exigences spirituelles, pastorales et sociales de l’Église et de la société.',
    mission:
      'Préparer des leaders chrétiens intègres, inspirés par les valeurs et la mission de l’Armée du Salut, pour l’encadrement pastoral et l’action sociale.',
    domains: [
      'Formation théologique fondée sur les Saintes Écritures',
      'Discipline académique et engagement au service de l’humanité',
      'Enseignement, recherche et pratique ministérielle',
    ],
    image: '/media/uwb/faculty/theologie.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-theo',
        title: 'Cursus en Théologie',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'Mission publiée sur le site officiel. Structure précise du cursus à confirmer.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=18',
    featured: true,
    verified: true,
  },
  {
    id: 'istm',
    slug: 'istm',
    orientationCategory: 'sante' as const,
    name: 'Institut Supérieur des Techniques Médicales',
    shortName: 'ISTM',
    kind: 'institut',
    summary:
      'Institut supérieur autonome placé sous le même encadrement que l’université, dédié aux techniques médicales.',
    image: '/media/uwb/faculty/istm.jpg',
    imageCredit,
    programs: [
      {
        id: 'cursus-istm',
        title: 'Formations en techniques médicales',
        cycle: 'À préciser auprès de l’UWB',
        summary:
          'L’institut est listé sur la page d’accueil officielle (faculte.php?url=17). Le détail des filières reste à compléter.',
        verified: false,
      },
    ],
    sourceUrl: 'https://uwbcongo.org/faculte.php?url=17',
    featured: true,
    verified: true,
    note: 'Présenté sur uwbcongo.org comme Institut Supérieur. Descriptif détaillé à compléter.',
  },
  /**
   * Entités secondaires (site123) — données conservées, masquées de l’UI publique
   * tant que leur statut n’est pas confirmé sur uwbcongo.org (phase D3).
   * Le libellé « IFMPE » apparaît sur certaines communications ; l’entrée ci-dessous
   * conserve l’identifiant IFMP issu de la source secondaire.
   */
  {
    id: 'sciences-commerciales',
    slug: 'sciences-commerciales',
    orientationCategory: 'economie-gestion' as const,
    name: 'Faculté des Sciences Commerciales et Financières',
    shortName: 'Sciences commerciales',
    kind: 'faculte',
    summary:
      'Mentionnée sur une source publique secondaire. Non listée sur la page d’accueil actuelle de uwbcongo.org.',
    image: '/media/uwb/courses/01.jpg',
    imageCredit: imageCreditIllustrative,
    programs: [],
    featured: false,
    verified: false,
    note: 'Source secondaire (site123) — à valider auprès de l’UWB. Masquée de l’interface publique (D3).',
  },
  {
    id: 'ifmp',
    slug: 'ifmp',
    orientationCategory: 'economie-gestion' as const,
    name: 'Institut facultaire de management public (IFMP)',
    shortName: 'IFMP',
    kind: 'institut',
    summary:
      'Mentionné sur une source publique secondaire comme institution de formation continue / management public.',
    image: '/media/uwb/courses/02.jpg',
    imageCredit: imageCreditIllustrative,
    programs: [],
    featured: false,
    verified: false,
    note: 'Source secondaire (site123) — à valider auprès de l’UWB. Masquée de l’interface publique (D3).',
  },
  {
    id: 'ehec',
    slug: 'ehec',
    orientationCategory: 'economie-gestion' as const,
    name: 'École de Hautes Études Comptables (EHEC)',
    shortName: 'EHEC',
    kind: 'institut',
    summary:
      'Mentionnée sur une source publique secondaire comme institution de formation continue.',
    image: '/media/uwb/courses/03.jpg',
    imageCredit: imageCreditIllustrative,
    programs: [],
    featured: false,
    verified: false,
    note: 'Source secondaire (site123) — à valider auprès de l’UWB. Masquée de l’interface publique (D3).',
  },
]

/** Critère unique : entité confirmée et listable publiquement. */
export function isFacultyPubliclyListed(faculty: Faculty): boolean {
  return faculty.verified
}

export function getFacultyById(id: string): Faculty | undefined {
  return faculties.find((f) => f.id === id || f.slug === id)
}

export function getFacultyBySlug(slug: string): Faculty | undefined {
  return getFacultyById(slug)
}

/** Résolution publique : retourne `undefined` si l’entité n’est pas listée. */
export function getPublicFacultyBySlug(slug: string): Faculty | undefined {
  const faculty = getFacultyBySlug(slug)
  return faculty && isFacultyPubliclyListed(faculty) ? faculty : undefined
}

/** Catalogue public des facultés / instituts confirmés. */
export function getPublicFaculties(): Faculty[] {
  return faculties.filter(isFacultyPubliclyListed)
}

/** @deprecated Préférer `getPublicFaculties` — alias conservé pour compatibilité. */
export function getVerifiedFaculties(): Faculty[] {
  return getPublicFaculties()
}

export function getFeaturedFaculties(): Faculty[] {
  return getPublicFaculties().filter((f) => f.featured)
}

/** Recherche dans le catalogue public uniquement. */
export function filterFaculties(query: string): Faculty[] {
  const q = query.trim().toLowerCase()
  const list = getPublicFaculties()
  if (!q) return list
  return list.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.shortName.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.domains?.some((d) => d.toLowerCase().includes(q)) ||
      f.programs.some((p) => p.title.toLowerCase().includes(q)),
  )
}

