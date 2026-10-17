/**
 * Admissions / inscription.
 * Sources vérifiées : https://uwbcongo.org/inscription.php , https://www.uwbcongo.org/
 * Les étapes générales sont une structure de présentation — pas la procédure officielle exacte
 * tant qu’elle n’a pas été validée par l’UWB.
 */

import type {
  AdmissionDocument,
  AdmissionRequirement,
  AdmissionStep,
  AdmissionsFaqItem,
  ApplicantPathway,
  TuitionInfo,
} from '../types/admissions'
import { site } from './site'

export type {
  AdmissionDocument,
  AdmissionRequirement,
  AdmissionStep,
  AdmissionsFaqItem,
  ApplicantPathway,
  TuitionInfo,
} from '../types/admissions'

export const admissionsCopy = {
  hero: {
    kicker: 'ADMISSIONS ET INSCRIPTIONS',
    title: 'Votre avenir universitaire commence ici',
    intro:
      'Découvrez les informations disponibles pour préparer votre projet d’études à l’Université William Booth et vous orienter vers la démarche d’admission appropriée.',
    ctaFormations: 'Découvrir les formations',
    ctaSteps: 'Comprendre les étapes',
    imageAlt:
      'Affiche institutionnelle d’inscriptions — Université William Booth',
    imageCredit: 'Document institutionnel — uwbcongo.org',
  },
  pathways: {
    kicker: 'Orientation',
    title: 'Quel est votre parcours ?',
    intro:
      'Identifiez votre situation pour accéder rapidement aux informations utiles. Ces catégories orientent la navigation ; elles ne décrivent pas des procédures administratives inventées.',
  },
  steps: {
    kicker: 'Parcours candidat',
    title: 'Étapes de l’admission',
    intro:
      'Présentation indicative pour s’orienter. Comparer toujours ces étapes aux consignes communiquées par l’UWB avant de les considérer comme le processus officiel exact.',
    provisionalNote:
      'Structure explicative — à valider auprès de l’administration universitaire.',
  },
  requirements: {
    kicker: 'Accès aux formations',
    title: 'Conditions d’admission',
    intro:
      'Informations publiées ou déductibles du formulaire d’inscription officiel. Les seuils, échéances et règles propres à chaque faculté ne sont pas inventés ici.',
    contactFallback:
      'Veuillez contacter le service compétent pour confirmation.',
  },
  documents: {
    kicker: 'Préparation',
    title: 'Documents à préparer',
    intro:
      'Liste fondée sur les champs du formulaire d’inscription publié par l’UWB. Cochez localement les éléments déjà réunis — ce n’est pas une soumission officielle de dossier.',
    storageNote:
      'Votre progression est enregistrée uniquement dans ce navigateur.',
    noUploadNote:
      'Aucun téléversement de pièce d’identité n’est demandé sur cette page.',
  },
  formations: {
    kicker: 'Offre académique',
    title: 'Choisir sa formation',
    intro:
      'Parcourez les facultés et instituts confirmés sur le site institutionnel, puis ouvrez la fiche détaillée pour en savoir plus.',
    searchPlaceholder: 'Rechercher une faculté ou un domaine…',
    ctaAll: 'Voir toutes les formations',
  },
  tuition: {
    kicker: 'Frais académiques',
    title: 'Frais et modalités de paiement',
  },
  faq: {
    kicker: 'Aide',
    title: 'Questions fréquentes',
    intro:
      'Réponses fondées sur les informations vérifiées. En cas de doute, contactez l’université.',
  },
  contact: {
    kicker: 'Assistance',
    title: 'Demander des informations',
    intro:
      'Utilisez ce formulaire pour préparer votre demande. Aucun message n’est transmis tant que le service d’envoi n’est pas branché.',
    demoBadge: 'Démonstration — envoi non activé',
    subjects: [
      'Informations générales sur l’admission',
      'Choix d’une formation',
      'Documents à préparer',
      'Frais académiques',
      'Réinscription / suite de parcours',
      'Autre',
    ] as const,
  },
  form: {
    kicker: 'Formulaire',
    title: 'Préparer une demande d’inscription',
    intro:
      'Les champs reprennent le formulaire publié sur le site officiel de l’UWB. Sur ce site institutionnel, l’enregistrement est local (démonstration) tant que le backend SIGU n’est pas branché.',
    demoNote:
      'Démonstration — les données restent dans votre navigateur. Pour une inscription officielle, utilisez également le formulaire UWB publié.',
    officialCta: 'Ouvrir le formulaire officiel',
    successTitle: 'Brouillon enregistré localement',
    successText:
      'Aucune transmission vers l’université n’a eu lieu. Conservez cette référence pour votre suivi personnel :',
    year: '2026–2027',
    note:
      'Après traitement d’un dossier officiel, un numéro matricule et les accès à l’espace étudiant sont communiqués par l’administration.',
    defaultPasswordNote:
      'Sur le site officiel, le mot de passe par défaut de l’espace étudiant est indiqué comme 0000 — à modifier dès la première connexion (information publiée sur inscription.php).',
    contactIntro: 'Pour toute question sur votre dossier :',
  },
  finalCta: {
    title: 'Préparez votre prochaine étape',
    text: 'Explorez les formations disponibles et rapprochez-vous des services de l’université pour confirmer les conditions correspondant à votre parcours.',
    ctaFormations: 'Explorer les formations',
    ctaContact: 'Contacter l’université',
  },
  /** @deprecated Prefer admissionsCopy.hero / form */
  eyebrow: 'Admissions & inscriptions',
  title: 'Votre avenir universitaire commence ici',
  intro:
    'Découvrez les informations disponibles pour préparer votre projet d’études à l’Université William Booth et vous orienter vers la démarche d’admission appropriée.',
  year: '2026–2027',
  note:
    'Après traitement d’un dossier officiel, un numéro matricule et les accès à l’espace étudiant sont communiqués par l’administration.',
  defaultPasswordNote:
    'Sur le site officiel, le mot de passe par défaut de l’espace étudiant est indiqué comme 0000 — à modifier dès la première connexion.',
  contactIntro: 'Pour toute question sur votre dossier :',
} as const

export const applicantPathways: ApplicantPathway[] = [
  {
    id: 'nouveau',
    title: 'Nouveau candidat',
    description:
      'Vous postulez pour la première fois. Découvrez les étapes indicatives, les conditions publiées et les formations disponibles.',
    href: '#etapes-admission',
    cta: 'Voir les étapes',
  },
  {
    id: 'reinscription',
    title: 'Réinscription',
    description:
      'Vous êtes déjà étudiant à l’UWB. La procédure précise de réinscription n’est pas détaillée ici — contactez l’administration.',
    href: '#contact-admissions',
    cta: 'Contacter l’administration',
  },
  {
    id: 'changement-filiere',
    title: 'Changement de filière',
    description:
      'Vous envisagez un changement de parcours. Aucune procédure spécifique n’a été confirmée publiquement — rapprochez-vous du service compétent.',
    href: '#contact-admissions',
    cta: 'Demander des précisions',
  },
  {
    id: 'formations',
    title: 'Explorer les formations',
    description:
      'Vous souhaitez d’abord comprendre l’offre académique avant toute démarche d’admission.',
    href: '#choisir-formation',
    cta: 'Parcourir les facultés',
  },
]

/** Structure indicative — verified: false = non présentée comme procédure officielle exacte */
export const admissionProcessSteps: AdmissionStep[] = [
  {
    id: 'decouvrir',
    title: 'Découvrir les formations',
    text: 'Consultez les facultés et instituts publiés, puis identifiez les parcours qui correspondent à votre projet.',
    verified: false,
  },
  {
    id: 'conditions',
    title: 'Consulter les conditions d’admission',
    text: 'Relisez les informations disponibles sur cette page et sur le site officiel. Confirmez les exigences auprès du service compétent.',
    verified: false,
  },
  {
    id: 'documents',
    title: 'Préparer les documents demandés',
    text: 'Réunissez les éléments liés aux champs du formulaire d’inscription (identité, contacts, parcours scolaire).',
    verified: false,
  },
  {
    id: 'formulaire',
    title: 'Contacter le service ou accéder au formulaire',
    text: 'Utilisez les coordonnées institutionnelles ou le formulaire d’inscription publié par l’UWB.',
    verified: false,
  },
  {
    id: 'demarches',
    title: 'Effectuer les démarches indiquées',
    text: 'Suivez uniquement les consignes communiquées par l’université pour votre dossier.',
    verified: false,
  },
  {
    id: 'suite',
    title: 'Vérifier la suite de l’inscription',
    text: 'Attendez les informations de suivi (matricule, accès espace étudiant) communiquées par l’administration.',
    verified: false,
  },
]

/** @deprecated Alias — anciennes 3 étapes ; préférer admissionProcessSteps */
export const admissionsSteps = [
  {
    title: 'Choisir une formation',
    text: 'Parcourez les facultés et instituts, puis sélectionnez votre premier et second choix dans le formulaire.',
  },
  {
    title: 'Remplir le dossier',
    text: 'Identité, contacts, origines — les mêmes champs que le formulaire d’inscription UWB.',
  },
  {
    title: 'Soumettre via le canal officiel',
    text: 'Utilisez le formulaire officiel UWB. La version sur ce site est une démonstration locale tant que SIGU n’est pas branché.',
  },
] as const

export const admissionRequirements: AdmissionRequirement[] = [
  {
    id: 'formulaire-officiel',
    title: 'Formulaire d’inscription publié',
    text: 'L’UWB publie un formulaire d’inscription en ligne (identité, contacts, origines, parcours scolaire, choix de facultés et promotion).',
    verified: true,
    sourceNote: site.officialInscriptionUrl,
  },
  {
    id: 'choix-faculte',
    title: 'Choix de faculté / institut',
    text: 'Le formulaire officiel prévoit un premier choix et un second choix parmi les facultés et instituts listés, ainsi qu’une promotion (niveaux LMD, ancien système, master).',
    verified: true,
    sourceNote: site.officialInscriptionUrl,
  },
  {
    id: 'parcours-scolaire',
    title: 'Parcours scolaire',
    text: 'Le formulaire prévoit des champs pour le numéro de diplôme et le pourcentage à l’Examen d’État. Leur caractère obligatoire et tout seuil minimal ne sont pas précisés ici.',
    verified: true,
    sourceNote: site.officialInscriptionUrl,
  },
  {
    id: 'seuils',
    title: 'Seuils et conditions particulières',
    text: 'Aucun pourcentage minimum à l’Examen d’État, aucune liste de diplômes acceptés ni aucune exigence propre à une faculté n’a été reproduite faute de publication claire. Veuillez contacter le service compétent pour confirmation.',
    verified: false,
  },
  {
    id: 'matricule',
    title: 'Matricule et espace étudiant',
    text: 'Le site officiel mentionne la conservation du numéro matricule (ex. format UWB-année-numéro) et un mot de passe par défaut 0000 pour la première connexion à l’espace étudiant.',
    verified: true,
    sourceNote: site.officialInscriptionUrl,
  },
]

export const admissionDocuments: AdmissionDocument[] = [
  {
    id: 'identite',
    name: 'Informations d’identité',
    explanation:
      'Nom, postnom, prénom, genre, état civil, nationalité, lieu et date de naissance — champs du formulaire officiel.',
    required: true,
    verified: true,
  },
  {
    id: 'filiation',
    name: 'Filiation',
    explanation:
      'Noms du père et de la mère, tels que demandés sur le formulaire d’inscription.',
    required: true,
    verified: true,
  },
  {
    id: 'coordonnees',
    name: 'Coordonnées et adresse',
    explanation:
      'Province, commune, adresse, téléphone et adresse électronique.',
    required: true,
    verified: true,
  },
  {
    id: 'diplome',
    name: 'Numéro de diplôme',
    explanation:
      'Champ prévu sur le formulaire officiel ; marqué facultatif sur la version publiée consultée.',
    required: false,
    verified: true,
  },
  {
    id: 'exetat',
    name: 'Pourcentage à l’Examen d’État',
    explanation:
      'Champ prévu sur le formulaire officiel ; marqué facultatif sur la version publiée consultée. Aucun seuil n’est indiqué ici.',
    required: false,
    verified: true,
  },
  {
    id: 'choix',
    name: 'Choix de formation et promotion',
    explanation:
      'Premier choix de faculté/institut (obligatoire), second choix, et promotion parmi les niveaux listés par l’UWB.',
    required: true,
    verified: true,
  },
  {
    id: 'pieces-complementaires',
    name: 'Pièces complémentaires éventuelles',
    explanation:
      'D’autres documents peuvent être exigés par l’administration. Veuillez contacter le service compétent pour confirmation.',
    verified: false,
  },
]

export const tuitionInformation: TuitionInfo = {
  hasOfficialGrid: false,
  message:
    'Aucune grille tarifaire officielle (montants, échéances ou moyens de paiement) n’a été récupérée pour affichage sur ce site.',
  contactHint:
    'Contactez le service financier ou l’administration de l’UWB pour obtenir les frais académiques et les modalités de paiement en vigueur.',
}

export const admissionsFaq: AdmissionsFaqItem[] = [
  {
    id: 'formations',
    question: 'Comment découvrir les formations ?',
    answer:
      'Consultez la page Facultés et formations de ce site, où sont listées les entités reprises de uwbcongo.org. Vous pouvez aussi ouvrir chaque fiche faculté pour le détail disponible.',
  },
  {
    id: 'conditions',
    question: 'Où consulter les conditions d’admission ?',
    answer:
      'Les informations disponibles sont regroupées dans la section Conditions d’admission de cette page, à partir du formulaire officiel. Pour toute exigence non publiée, contactez infos@uwbcongo.org ou le rectorat.',
  },
  {
    id: 'documents',
    question: 'Quels documents faut-il préparer ?',
    answer:
      'Préparez au minimum les informations d’identité, de filiation et de contact demandées par le formulaire officiel, ainsi que vos choix de faculté et de promotion. Les pièces complémentaires éventuelles restent à confirmer auprès de l’administration.',
  },
  {
    id: 'frais',
    question: 'Comment obtenir des informations sur les frais ?',
    answer:
      'Aucune grille tarifaire n’est affichée ici faute de source officielle récupérée. Adressez-vous au service financier ou à l’administration via les coordonnées publiées.',
  },
  {
    id: 'contact',
    question: 'Comment contacter l’administration ?',
    answer: `Adresse : ${site.contact.address.value}. Téléphones : ${site.contact.phones.map((p) => p.value).join(' · ')}. Courriels : ${site.contact.emails.map((e) => e.value).join(' · ')}.`,
  },
  {
    id: 'formulaire',
    question: 'Où trouver le formulaire officiel d’inscription ?',
    answer: `Le formulaire d’inscription est publié sur ${site.officialInscriptionUrl}. Un autre canal d’inscription en ligne est également référencé par l’université (${site.officialInscriptionFormUrl}).`,
  },
]

/** Facultés du select officiel fac1 / fac2 */
export const admissionFaculties = [
  'Faculté des Sciences Informatiques & Intelligence Artificielle',
  'Faculté de Science de l’Information et de la Communication',
  'Faculté des Sciences Economiques et de Gestion',
  'Faculté de Médecine',
  'Faculté de Droit',
  'Institut Supérieur des Techniques Médicales',
  'Faculté de Théologie',
] as const

export const admissionPromotions = [
  'L1 LMD',
  'L2 LMD',
  'L3 LMD',
  'L1 ANCIEN SYSTEME',
  'L2 ANCIEN SYSTEME',
  'MASTER COMPLÉMENTAIRE',
  'MASTER 1',
  'MASTER 2',
] as const

export const admissionGenres = ['Masculin', 'Feminin'] as const

export const admissionEtatCivil = [
  'Célibataire',
  'Marié(e)',
  'Veuf(ve)',
] as const

/** Communes Kinshasa — select officiel « commune » */
export const admissionCommunes = [
  'Barumbu',
  'Bandalungwa',
  'Bumbu',
  'Gombe',
  'Kalamu',
  'Kasa-Vubu',
  'Kimbanseke',
  'Kinshasa',
  'Kintambo',
  'Kisenso',
  'Lemba',
  'Limete',
  'Lingwala',
  'Makala',
  'Maluku',
  'Masina',
  'Matete',
  'Mont Ngafula',
  'Ngaba',
  'Ngaliema',
  'Nsele',
  'Selembao',
  'Ndjili',
  'Ndolo',
] as const

/** Nationalités les plus fréquentes + RDC en tête (liste complète trop longue pour UX) */
export const admissionNationalites = [
  'Congo DR',
  'Congo',
  'Angola',
  'Rwanda',
  'Burundi',
  'Ouganda',
  'Tanzanie',
  'Zambie',
  'Afrique_Centrale',
  'Cameroun',
  'Gabon',
  'Congo_Brazzaville',
  'France',
  'Belgique',
  'Canada',
  'Autre',
] as const

export type AdmissionFormValues = {
  nom: string
  postnom: string
  prenom: string
  genre: string
  etatCivil: string
  nationalite: string
  lieuNaissance: string
  dateNaissance: string
  pere: string
  mere: string
  province: string
  commune: string
  adresse: string
  telephone: string
  email: string
  numDiplome: string
  pourcentExetat: string
  faculte1: string
  faculte2: string
  promotion: string
  confirmation: boolean
}

export const CHECKLIST_STORAGE_KEY = 'uwb-admissions-checklist'
