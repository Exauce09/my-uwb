import type { LibraryDocument } from '../types/library'

/**
 * Catalogue bibliothèque numérique UWB.
 * - isOfficial: travaux issus de uwbcongo.org/bibliotheque.php (fichiers locaux)
 * - isDemo: fiches fictives pour tester UI (jamais présentées comme publications UWB réelles)
 */

export const libraryDocuments: LibraryDocument[] = [
  // ——— Officiel UWB ———
  {
    id: 'uwb-01',
    title: 'Mise en place d’une mesure de sécurité…',
    authors: ['Kankolongo Ntamwe Nathan'],
    description:
      'Travail académique déposé dans la bibliothèque virtuelle officielle de l’Université William Booth.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['sécurité', 'informatique', 'TFC'],
    coverUrl: '/media/uwb/faculty/informatique-ia.jpg',
    fileUrl: '/media/uwb/library/travail-01.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '2,6 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
    featured: true,
  },
  {
    id: 'uwb-02',
    title: 'Concept et réalisation d’une base de données…',
    authors: ['Mampuya Mpolo Ruth'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['base de données', 'conception'],
    coverUrl: '/media/uwb/faculty/informatique-ia.jpg',
    fileUrl: '/media/uwb/library/travail-02.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '315 Ko',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
    featured: true,
  },
  {
    id: 'uwb-03',
    title: 'Mise en place d’un système informatique…',
    authors: ['Mbuebua Mulumba Plamedie'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['système', 'informatique'],
    coverUrl: '/media/uwb/faculty/sic.jpg',
    fileUrl: '/media/uwb/library/travail-03.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '1,5 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
  },
  {
    id: 'uwb-04',
    title: 'Mise en place d’une application informatique…',
    authors: ['Kalenga Ilunga Clarisse'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['application', 'développement'],
    coverUrl: '/media/uwb/faculty/informatique-ia.jpg',
    fileUrl: '/media/uwb/library/travail-04.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '2,4 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
  },
  {
    id: 'uwb-05',
    title: 'Déploiement d’une solution VoIP sécurisée…',
    authors: ['Ngweyi Masesi'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['VoIP', 'réseaux', 'sécurité'],
    coverUrl: '/media/uwb/faculty/sic.jpg',
    fileUrl: '/media/uwb/library/travail-05.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '1,4 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
    featured: true,
  },
  {
    id: 'uwb-06',
    title: 'Conception et déploiement d’une application…',
    authors: ['Munema Samwangala Esther'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['application', 'déploiement'],
    coverUrl: '/media/uwb/faculty/economie-gestion.jpg',
    fileUrl: '/media/uwb/library/travail-06.docx',
    fileFormat: 'docx',
    fileSizeLabel: '2,0 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
  },
  {
    id: 'uwb-07',
    title: 'Développement d’une plateforme pour la…',
    authors: ['Mansiantima Zola Hodavia'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['plateforme', 'développement'],
    coverUrl: '/media/uwb/faculty/informatique-ia.jpg',
    fileUrl: '/media/uwb/library/travail-07.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '1,9 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
  },
  {
    id: 'uwb-09',
    title: 'Mise en place d’un système de vote mobile…',
    authors: ['Konga Massamba Theophile'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['vote', 'mobile', 'application'],
    coverUrl: '/media/uwb/faculty/droit.jpg',
    fileUrl: '/media/uwb/library/travail-09.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '2,9 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
    featured: true,
  },
  {
    id: 'uwb-10',
    title: 'Conception et réalisation d’une application…',
    authors: ['Kaniki Lembe Isaac'],
    description:
      'Travail académique — catalogue officiel Bibliothèque virtuelle UWB.',
    type: 'tfc-tfe',
    academicDomain: 'informatique-ia',
    publicationYear: 2024,
    keywords: ['application', 'conception'],
    coverUrl: '/media/uwb/faculty/informatique-ia.jpg',
    fileUrl: '/media/uwb/library/travail-10.pdf',
    fileFormat: 'pdf',
    fileSizeLabel: '2,2 Mo',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: true,
    isDemo: false,
  },

  // ——— Démonstration UI (fictif) ———
  {
    id: 'demo-guide-methodo',
    title: 'Guide méthodologique pour la rédaction d’un TFC (démo)',
    authors: ['Équipe pédagogique — démo'],
    description:
      'Fiche de démonstration. Ce guide n’est pas une publication officielle de l’UWB ; il sert à tester filtres, fiches et accès.',
    type: 'guide',
    academicDomain: 'autre',
    publicationYear: 2025,
    keywords: ['méthodologie', 'TFC', 'rédaction', 'démo'],
    coverUrl: '/media/uwb/carousel/01.jpg',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    featured: true,
    demoPopularity: 92,
  },
  {
    id: 'demo-support-droit',
    title: 'Support de cours — Introduction au droit civil (démo)',
    authors: ['Auteur fictif — démo'],
    description:
      'Support pédagogique fictif pour valider l’affichage des catégories « Supports de cours » et le domaine Droit.',
    type: 'support-cours',
    academicDomain: 'droit',
    publicationYear: 2023,
    keywords: ['droit civil', 'cours', 'démo'],
    coverUrl: '/media/uwb/faculty/droit.jpg',
    accessLevel: 'etudiant',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    demoPopularity: 70,
  },
  {
    id: 'demo-article-eco',
    title: 'Article — Finance et développement local (démo)',
    authors: ['Chercheur fictif — démo'],
    description:
      'Article scientifique fictif. Non affilié à une publication réelle de l’UWB.',
    type: 'article',
    academicDomain: 'economie-gestion',
    publicationYear: 2022,
    keywords: ['finance', 'développement', 'démo'],
    coverUrl: '/media/uwb/faculty/economie-gestion.jpg',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    demoPopularity: 55,
  },
  {
    id: 'demo-memoire-med',
    title: 'Mémoire — Santé communautaire à Kinshasa (démo)',
    authors: ['Étudiant fictif — démo'],
    description:
      'Mémoire fictif pour tester le type « Mémoires et thèses » et le domaine Médecine. Aucun fichier associé.',
    type: 'memoire-these',
    academicDomain: 'medecine',
    publicationYear: 2021,
    keywords: ['santé', 'communauté', 'démo'],
    coverUrl: '/media/uwb/faculty/medecine.jpg',
    accessLevel: 'restreint',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    demoPopularity: 40,
  },
  {
    id: 'demo-livre-theo',
    title: 'Livre numérique — Introduction à la théologie (démo)',
    authors: ['Auteur fictif — démo'],
    description:
      'Entrée de démonstration pour la catégorie Livres numériques.',
    type: 'livre',
    academicDomain: 'theologie',
    publicationYear: 2020,
    keywords: ['théologie', 'livre', 'démo'],
    coverUrl: '/media/uwb/faculty/theologie.jpg',
    accessLevel: 'public',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    demoPopularity: 33,
  },
  {
    id: 'demo-rapport-sic',
    title: 'Rapport de recherche — Médias et société (démo)',
    authors: ['Laboratoire fictif — démo'],
    description:
      'Rapport fictif pour le domaine Information & Communication.',
    type: 'rapport',
    academicDomain: 'sic',
    publicationYear: 2023,
    keywords: ['médias', 'communication', 'démo'],
    coverUrl: '/media/uwb/faculty/sic.jpg',
    accessLevel: 'enseignant',
    publicationStatus: 'publie',
    isOfficial: false,
    isDemo: true,
    demoPopularity: 48,
  },
]

export function getLibraryDocumentById(
  id: string,
): LibraryDocument | undefined {
  return libraryDocuments.find((d) => d.id === id)
}

/** Catalogue public : publiés et hors démonstration UI. */
export function getPublishedLibraryDocuments(): LibraryDocument[] {
  return libraryDocuments.filter(
    (d) => d.publicationStatus === 'publie' && !d.isDemo,
  )
}

/** Accès fiche publique (exclut les démos). */
export function getPublicLibraryDocumentById(
  id: string,
): LibraryDocument | undefined {
  const doc = getLibraryDocumentById(id)
  if (!doc || doc.publicationStatus !== 'publie' || doc.isDemo) return undefined
  return doc
}
