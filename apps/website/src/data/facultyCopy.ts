import type { OrientationCategoryId } from '../types/faculty'

export const orientationLabels: Record<OrientationCategoryId, string> = {
  'informatique-technologies': 'Informatique et technologies',
  'economie-gestion': 'Économie et gestion',
  communication: 'Communication',
  droit: 'Droit',
  sante: 'Santé',
  theologie: 'Théologie',
}

export const facultyCopy = {
  hero: {
    kicker: 'Formation · Savoir · Avenir',
    title: 'Découvrez votre avenir à l’UWB',
    intro:
      'Explorez les domaines de formation et découvrez les parcours qui peuvent vous aider à construire votre projet académique et professionnel.',
    ctaFaculties: 'Explorer les facultés',
    ctaFormations: 'Découvrir les formations',
    searchPlaceholder: 'Rechercher une faculté, une filière, un domaine…',
    imageCredit: 'Amphithéâtre — vie universitaire, uwbcongo.org',
  },
  faculties: {
    kicker: 'Offre académique',
    title: 'Nos facultés et instituts',
    intro:
      'Entités présentées sur le site institutionnel uwbcongo.org. Les mentions hors site officiel sont signalées comme à confirmer.',
    explore: 'Explorer cette faculté',
    pendingTitle: 'Mentions à confirmer',
  },
  search: {
    reset: 'Réinitialiser',
    allFaculties: 'Toutes les entités',
    allKinds: 'Facultés & instituts',
    kindFaculte: 'Facultés',
    kindInstitut: 'Instituts',
    sortName: 'Nom A → Z',
    sortNameDesc: 'Nom Z → A',
    results: (n: number) =>
      n === 0
        ? 'Aucun résultat'
        : n === 1
          ? '1 résultat'
          : `${n} résultats`,
    empty:
      'Aucune formation ne correspond à votre recherche. Modifiez les filtres ou réessayez.',
  },
  catalog: {
    kicker: 'Catalogue',
    title: 'Formations documentées',
    intro:
      'Programmes et cursus publiés ou mentionnés pour chaque entité. Les détails non vérifiés ne sont pas inventés.',
    readMore: 'Voir la fiche',
  },
  orientation: {
    kicker: 'Orientation',
    title: 'Trouvez le parcours qui vous correspond',
    intro:
      'Parcourez les grands domaines présents à l’UWB. Chaque catégorie mène uniquement aux entités confirmées correspondantes.',
    all: 'Découvrir toutes les formations',
  },
  admissions: {
    kicker: 'Admissions',
    title: 'Préparez votre parcours universitaire',
    text: 'Consultez les informations d’admission et rapprochez-vous des services compétents pour préparer votre inscription.',
    ctaAdmissions: 'Informations sur les admissions',
    ctaContact: 'Nous contacter',
  },
} as const
