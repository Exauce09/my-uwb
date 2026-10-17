/**
 * Actualités UWB — sources : uwbcongo.org (index, blog, actualite.php).
 * Images appariées au contenu réel du fichier (vérifié visuellement).
 */

import type { NewsArticle, NewsEvent } from '../types/news'

export type { NewsArticle, NewsEvent } from '../types/news'

export const newsArticles: NewsArticle[] = [
  {
    id: 'calendrier-2025-2026',
    slug: 'calendrier-academique-2025-2026',
    title: 'Calendrier académique 2025-2026 : principales échéances',
    excerpt:
      'L’Université William Booth informe ses étudiants des principales échéances de fin d’année académique 2025-2026.',
    publishedAt: '2026-06-13',
    category: 'calendrier-academique',
    /** Communiqué officiel « Année académique 2025-2026 » (dates examens, TFC/TFE, délibérations). */
    coverImage: '/media/uwb/news/communique-calendrier-2026.jpg',
    imageCredit: 'Communiqué officiel du Rectorat — uwbcongo.org',
    author: 'Rectorat — Université William Booth',
    tags: ['calendrier', 'examens', 'TFC', 'TFE', 'délibérations'],
    featured: true,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=63',
    content: [
      'L’Université William Booth informe l’ensemble de ses étudiants des principales échéances marquant la fin de l’année académique 2025-2026, notamment la période des examens du second semestre, les soutenances des TFC et TFE, les délibérations ainsi que la cérémonie de collation des grades académiques.',
      'Le Rectorat invite chaque étudiant à prendre les dispositions nécessaires afin de respecter ce calendrier et de terminer avec succès son parcours académique.',
      'Université William Booth — Dignité • Honneur • Excellence',
    ],
  },
  {
    id: 'hommage-bernard-nzinga',
    slug: 'hommage-bernard-nzinga-luzi',
    title:
      'Hommage à Monsieur Bernard Nzinga Luzi : l’Université William Booth lui a rendu un dernier hommage',
    excerpt:
      'L’UWB a rendu un dernier hommage à Monsieur Bernard Nzinga Luzi, Secrétaire Général Administratif, disparu le 24 mai 2026.',
    publishedAt: '2026-06-11',
    category: 'vie-universitaire',
    /** Affiche commémorative officielle « Repos éternel — SGA Bernard Nzinga Luzi ». */
    coverImage: '/media/uwb/news/hommage.png',
    imageCredit: 'Affiche officielle d’hommage — uwbcongo.org',
    author: 'Comité de Gestion — Université William Booth',
    tags: ['hommage', 'comité de gestion', 'communauté'],
    featured: true,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=62',
    content: [
      'L’Université William Booth a vécu, au cours de ces dernières semaines, l’un des moments les plus douloureux de son histoire récente avec la disparition de son Secrétaire Général Administratif, Monsieur Bernard Nzinga Luzi, survenue le 24 mai 2026.',
      'Administrateur dévoué, collaborateur loyal et homme de grandes valeurs, Monsieur Bernard Nzinga Luzi a consacré une partie importante de sa vie au service de l’Université William Booth. Par son professionnalisme, son sens élevé des responsabilités et son engagement constant, il a contribué au développement et au rayonnement de notre institution.',
      'Afin d’honorer sa mémoire et de lui témoigner toute la reconnaissance de la communauté universitaire, une série de cérémonies funéraires a été organisée les 3 et 4 juin 2026. Ces moments de recueillement ont rassemblé les membres du Comité de Gestion, le personnel académique, scientifique, administratif et technique, les étudiants, les proches, les amis ainsi que de nombreuses personnalités venues partager la douleur de cette perte.',
      'Les hommages rendus au cours des différentes cérémonies ont mis en lumière les qualités humaines et professionnelles de l’illustre disparu. Tous ont salué un homme d’intégrité, de discrétion, de rigueur et de dévouement, qui a servi l’Université William Booth avec fidélité et dignité.',
      'Le 4 juin 2026, après les offices religieux et les derniers hommages, Monsieur Bernard Nzinga Luzi a été conduit à sa dernière demeure au cimetière de Kimberly, où il repose désormais en paix.',
      'À travers cette disparition, l’Université William Booth perd un collaborateur exemplaire, mais son héritage, son sens du devoir et son engagement au service de l’éducation continueront d’inspirer les générations présentes et futures.',
      'Au nom de toute la communauté universitaire, le Comité de Gestion renouvelle ses sincères condoléances à la famille biologique de Monsieur Bernard Nzinga Luzi ainsi qu’à tous ceux qui ont été touchés par cette perte. Que le Seigneur accorde à son serviteur le repos éternel et qu’Il console tous ceux qui le pleurent.',
      '« Heureux dès à présent les morts qui meurent dans le Seigneur. » (Apocalypse 14:13)',
      'Université William Booth — Dignité – Honneur – Excellence',
    ],
  },
  {
    id: 'cloture-mois-femme-2026',
    slug: 'cloture-mois-de-la-femme-2026',
    title: 'Clôture du mois de la femme à l’Université William Booth',
    excerpt:
      'Conférence du 27 mars sous le thème « Femme debout : entre résilience, dignité et construction de l’avenir ».',
    publishedAt: '2026-03-30',
    category: 'conferences-evenements',
    /** Photo de groupe officielle — clôture du mois de la femme (banderole + pagnes). */
    coverImage: '/media/uwb/news/cloture-mois-femme.jpg',
    imageCredit: 'Clôture du mois de la femme — uwbcongo.org',
    tags: ['conférence', 'femme', 'dignité'],
    featured: false,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=61',
    content: [
      'Sous le haut patronage du Recteur de l’Université William Booth, Prof. Dr. Ing. Roger BIMWALA.',
      'Ce vendredi 27 mars, l’Université William Booth a marqué avec éclat la clôture du mois dédié à la femme à travers une conférence riche en enseignements et en émotions, organisée autour du thème : « Femme debout : entre résilience, dignité et construction de l’avenir ».',
      'La conférence a été marquée par une intervention profonde de Maman Major Ndumbu, qui a édifié l’assistance autour du thème : « Il n’est pas bon que l’homme soit seul » — un message rappelant l’importance de la complémentarité, du soutien mutuel et de la place centrale de la femme dans la construction d’une société équilibrée.',
      'Madame Juliana Shemisi Mabula, Conseillère principale auprès du Cabinet du Recteur chargée des finances et Assistante à la Faculté des Sciences Économiques et de Gestion, a captivé l’auditoire par une communication riche et structurée sur le rôle stratégique de la femme dans les dynamiques économiques, sociales et institutionnelles.',
      'Pour couronner cette journée, des pagnes ont été distribués à toutes les femmes agents de l’Université William Booth, en signe de reconnaissance pour leur engagement et leur contribution au rayonnement de l’institution.',
      'L’Université William Booth réaffirme ainsi son engagement à promouvoir la dignité, l’autonomisation et le leadership féminin.',
    ],
  },
  {
    id: 'challenge-bakagoal-je-suis-tech',
    slug: 'challenge-bakagoal-je-suis-tech',
    title:
      'Après deux années d’attente, l’heure de la récompense a enfin sonné à l’Université William Booth',
    excerpt:
      'Remise de prix du Challenge Bakagoal et lancement de la campagne « Je suis Tech » le 19 février 2026.',
    publishedAt: '2026-03-04',
    category: 'vie-etudiante',
    /** Remise de trophée / chèque Fondation Bakambu — Challenge Bakagoal. */
    coverImage: '/media/uwb/news/remise-prix-bakagoal.jpg',
    imageCredit: 'Remise de prix Challenge Bakagoal — uwbcongo.org',
    tags: ['sport', 'technologie', 'étudiants', 'partenaires'],
    featured: false,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=60',
    content: [
      'Le jeudi 19 février 2026, l’Université William Booth a vibré au rythme de la cérémonie de remise de prix du Challenge Bakagoal, une compétition de football ayant rassemblé les étudiants autour des valeurs de discipline, d’excellence et d’esprit d’équipe.',
      'À cette occasion, la Fondation Vodacom et la Fondation Bakambu ont procédé à la remise du grand prix aux champions, saluant leur performance et leur détermination.',
      'Ce moment fort a également été marqué par le lancement officiel de la campagne « Je suis Tech », une initiative visant à promouvoir les compétences numériques et à encourager les jeunes à s’engager dans les domaines de la technologie et de l’innovation.',
      'À travers le sport et la technologie, cette journée a illustré l’engagement commun des partenaires et de l’Université William Booth en faveur de la jeunesse congolaise.',
    ],
  },
  {
    id: 'plan-strategique-2026-2036',
    slug: 'atelier-plan-strategique-2026-2036',
    title:
      'Atelier d’élaboration du Plan Stratégique 2026–2036 à l’Université William Booth',
    excerpt:
      'Du 23 au 27 février 2026, l’UWB a organisé un atelier de cinq jours consacré à l’élaboration de son Plan Stratégique 2026–2036.',
    publishedAt: '2026-03-04',
    category: 'annonces-officielles',
    /** Photo de groupe de l’atelier (banderole « Atelier d’élaboration du Plan stratégique »). */
    coverImage: '/media/uwb/news/atelier-plan-strategique.jpg',
    imageCredit: 'Atelier Plan stratégique UWB — uwbcongo.org',
    tags: ['stratégie', 'gouvernance', 'plan'],
    featured: false,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=59',
    content: [
      'Du 23 au 27 février 2026, l’Université William Booth a organisé un atelier de 5 jours consacré à l’élaboration de son Plan Stratégique 2026–2036.',
      'Durant cet atelier, les participants ont utilisé diverses méthodes de management et d’analyse stratégique afin d’évaluer et de critiquer le plan précédent. Cette réflexion approfondie a permis d’identifier les forces, les faiblesses, ainsi que les opportunités et menaces de l’ancien plan.',
      'À partir de ces analyses, les participants ont contribué à la mise en place d’un nouveau plan stratégique ambitieux, répondant aux besoins actuels et futurs de l’université. L’ensemble du processus s’est déroulé sous la supervision du comité de gestion, garantissant la cohérence, la rigueur et la qualité des décisions.',
      'Cet atelier témoigne de l’engagement de l’Université William Booth à renforcer sa vision stratégique, améliorer la qualité de ses enseignements et consolider sa position en tant qu’institution académique innovante et dynamique.',
    ],
  },
  {
    id: 'visite-senateur-kinduelo',
    slug: 'visite-senateur-kinduelo',
    title: 'Visite du Sénateur Kinduelo à l’Université William Booth',
    excerpt:
      'Le 19 février 2025, l’Honorable Sénateur Kinduelo a effectué une visite à l’UWB et parcouru plusieurs infrastructures de l’établissement.',
    publishedAt: '2025-04-01',
    category: 'vie-universitaire',
    /** Visite / inspection d’infrastructures sur le campus. */
    coverImage: '/media/uwb/news/visite-infrastructures.jpg',
    imageCredit: 'Visite d’infrastructures UWB — uwbcongo.org / RTUS',
    tags: ['visite', 'partenariats', 'RTUS'],
    featured: false,
    status: 'published',
    verified: true,
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=52',
    content: [
      'Le mercredi 19 février 2025, l’Honorable Sénateur Kinduelo a effectué une visite à l’Université William Booth. Après une longue discussion avec les membres du Comité de Gestion, il a parcouru plusieurs infrastructures de l’établissement, notamment l’amphithéâtre et le studio de la Radio-Télévision Universitaire Salutiste / RTUS.',
    ],
  },
]

/**
 * Événements datés uniquement à partir d’informations vérifiées
 * (issues des articles officiels). Pas de dates inventées.
 */
export const newsEvents: NewsEvent[] = [
  {
    id: 'evt-mois-femme-2026',
    title: 'Clôture du mois de la femme — conférence',
    date: '2026-03-27',
    kind: 'conference',
    summary:
      'Conférence « Femme debout : entre résilience, dignité et construction de l’avenir ».',
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=61',
    relatedArticleSlug: 'cloture-mois-de-la-femme-2026',
    verified: true,
  },
  {
    id: 'evt-bakagoal-2026',
    title: 'Remise de prix Challenge Bakagoal & lancement « Je suis Tech »',
    date: '2026-02-19',
    kind: 'vie-etudiante',
    summary:
      'Cérémonie sportive et lancement de la campagne numérique « Je suis Tech ».',
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=60',
    relatedArticleSlug: 'challenge-bakagoal-je-suis-tech',
    verified: true,
  },
  {
    id: 'evt-plan-strategique-2026',
    title: 'Atelier Plan Stratégique 2026–2036',
    date: '2026-02-23',
    kind: 'activite',
    summary:
      'Atelier de cinq jours (23–27 février 2026) sous supervision du comité de gestion.',
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=59',
    relatedArticleSlug: 'atelier-plan-strategique-2026-2036',
    verified: true,
  },
  {
    id: 'evt-kinduelo-2025',
    title: 'Visite du Sénateur Kinduelo',
    date: '2025-02-19',
    kind: 'ceremonie',
    summary:
      'Visite des infrastructures, notamment l’amphithéâtre et le studio RTUS.',
    sourceUrl: 'https://uwbcongo.org/actualite.php?id=52',
    relatedArticleSlug: 'visite-senateur-kinduelo',
    verified: true,
  },
]

export const NEWS_PAGE_SIZE = 6

export function getPublishedArticles(): NewsArticle[] {
  return newsArticles
    .filter((a) => a.status === 'published')
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
}

export function getFeaturedArticles(): NewsArticle[] {
  const featured = getPublishedArticles().filter((a) => a.featured)
  if (featured.length) return featured
  return getPublishedArticles().slice(0, 1)
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return getPublishedArticles().find(
    (a) => a.slug === slug || a.id === slug,
  )
}

/** @deprecated Utiliser getArticleBySlug */
export function getArticleById(id: string): NewsArticle | undefined {
  return getArticleBySlug(id)
}

export function getRelatedArticles(
  article: NewsArticle,
  limit = 3,
): NewsArticle[] {
  return getPublishedArticles()
    .filter((a) => a.id !== article.id)
    .filter(
      (a) =>
        a.category === article.category ||
        a.tags.some((t) => article.tags.includes(t)),
    )
    .slice(0, limit)
}

export function filterArticles(query: string): NewsArticle[] {
  const q = query.trim().toLowerCase()
  const list = getPublishedArticles()
  if (!q) return list
  return list.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.content.some((p) => p.toLowerCase().includes(q)),
  )
}

export function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`))
}

export function splitEventsByTime(events: NewsEvent[], now = new Date()) {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()
  const upcoming: NewsEvent[] = []
  const past: NewsEvent[] = []
  for (const event of [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    const t = new Date(`${event.date}T12:00:00`).getTime()
    if (t >= startOfToday) upcoming.push(event)
    else past.push(event)
  }
  return {
    upcoming,
    past: past.reverse(),
  }
}
