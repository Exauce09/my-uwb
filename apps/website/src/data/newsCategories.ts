import type { NewsCategoryId } from '../types/news'

export const newsCategoryLabels: Record<NewsCategoryId, string> = {
  'vie-universitaire': 'Vie universitaire',
  'annonces-officielles': 'Annonces officielles',
  'inscriptions-admissions': 'Inscriptions et admissions',
  'calendrier-academique': 'Calendrier académique',
  'examens-deliberations': 'Examens et délibérations',
  'recherche-scientifique': 'Recherche scientifique',
  'conferences-evenements': 'Conférences et événements',
  publications: 'Publications',
  'vie-etudiante': 'Vie étudiante',
}

export const newsCategoryOrder: NewsCategoryId[] = [
  'vie-universitaire',
  'annonces-officielles',
  'inscriptions-admissions',
  'calendrier-academique',
  'examens-deliberations',
  'recherche-scientifique',
  'conferences-evenements',
  'publications',
  'vie-etudiante',
]

export const newsEventKindLabels = {
  conference: 'Conférence',
  seminaire: 'Séminaire',
  'journee-scientifique': 'Journée scientifique',
  activite: 'Activité universitaire',
  ceremonie: 'Cérémonie officielle',
  'vie-etudiante': 'Activité étudiante',
} as const

export const newsCopy = {
  hero: {
    kicker: 'La vie universitaire',
    title: 'Actualités & événements',
    intro:
      'Retrouvez les informations, les initiatives et les temps forts de la communauté universitaire.',
    cta: 'Explorer les publications',
    imageCredit: 'Amphithéâtre — vie universitaire, uwbcongo.org',
  },
  search: {
    placeholder: 'Rechercher un titre, un thème, un mot-clé…',
    reset: 'Réinitialiser',
    all: 'Toutes les actualités',
    sortNewest: 'Plus récentes',
    sortOldest: 'Plus anciennes',
    results: (n: number) =>
      n === 0
        ? 'Aucun résultat'
        : n === 1
          ? '1 résultat'
          : `${n} résultats`,
    empty:
      'Aucune actualité ne correspond à votre recherche. Modifiez les filtres ou réessayez avec d’autres mots-clés.',
  },
  events: {
    kicker: 'Agenda',
    title: 'Événements universitaires',
    intro:
      'Conférences, cérémonies et activités dont les dates sont publiées par l’université.',
    upcoming: 'À venir',
    past: 'Passés',
    empty:
      'Aucun événement daté n’est disponible pour le moment. Consultez cette rubrique ultérieurement.',
  },
  newsletter: {
    kicker: 'Restez informé',
    title: 'Recevoir les actualités UWB',
    intro:
      'La newsletter institutionnelle n’est pas encore disponible. Aucune inscription n’est enregistrée pour le moment.',
    placeholder: 'votre.email@exemple.org',
    submit: 'Fonctionnalité en préparation',
    inactive:
      'La fonctionnalité d’inscription n’est pas encore activée. Aucune adresse n’a été enregistrée.',
    invalid: 'Veuillez saisir une adresse électronique valide.',
  },
} as const
