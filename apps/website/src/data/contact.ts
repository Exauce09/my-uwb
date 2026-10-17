/**
 * Page Contact et localisation.
 * Coordonnées reprises de https://www.uwbcongo.org/ (et pied de page).
 * Horaires d’accueil : non publiés clairement — omis.
 * Coordonnées GPS précises de l’entrée : non confirmées — carte en mode zone.
 */

import type {
  CampusMapConfig,
  ContactChannel,
  ContactDepartment,
  ContactFaqItem,
  InstitutionalLink,
} from '../types/contact'
import { uwbMedia } from './media'
import { site } from './site'

export type {
  CampusMapConfig,
  ContactChannel,
  ContactDepartment,
  ContactFaqItem,
  InstitutionalLink,
} from '../types/contact'

const address = site.contact.address.value
const addressQuery = encodeURIComponent(address)

export const contactCopy = {
  hero: {
    kicker: 'RESTONS EN CONTACT',
    title: 'Nous sommes à votre écoute',
    intro:
      'Une question sur nos formations, les admissions ou la vie universitaire ? Retrouvez nos coordonnées et adressez votre demande aux services de l’Université William Booth.',
    ctaWrite: 'Nous écrire',
    ctaMap: 'Voir la localisation',
    imageAlt: 'Campus et vie universitaire — Université William Booth',
    imageCredit: 'Photo officielle — uwbcongo.org',
  },
  info: {
    kicker: 'Coordonnées',
    title: 'Informations institutionnelles',
    intro:
      'Coordonnées publiques vérifiées sur le site officiel de l’Université William Booth. Les horaires d’accueil ne sont pas publiés ici faute de confirmation.',
  },
  map: {
    kicker: 'Localisation',
    title: 'Où nous trouver ?',
  },
  form: {
    kicker: 'Écrire à l’UWB',
    title: 'Demande de renseignements',
    intro:
      'Préparez votre message. L’envoi automatique n’est pas encore branché sur ce site ; utilisez les coordonnées vérifiées ou votre client de messagerie.',
    preparationBadge: 'Formulaire en préparation',
    preparationNote:
      'Aucun message n’est transmis automatiquement. Après validation, vous pourrez ouvrir un courriel prérempli vers une adresse institutionnelle vérifiée.',
    subjects: [
      'Informations générales',
      'Admissions et inscriptions',
      'Facultés et formations',
      'Questions académiques',
      'Questions financières',
      'Recherche et publications',
      'Partenariats',
      'Autre demande',
    ] as const,
    services: [
      { value: '', label: 'Non précisé' },
      { value: 'general', label: 'Assistance générale' },
      { value: 'admissions', label: 'Admissions et inscriptions' },
      { value: 'academique', label: 'Informations académiques' },
      { value: 'financier', label: 'Informations financières' },
      { value: 'publications', label: 'Publications scientifiques' },
      { value: 'partenariats', label: 'Partenariats institutionnels' },
    ] as const,
    maxMessage: 2000,
    minMessage: 20,
  },
  departments: {
    kicker: 'Orientation',
    title: 'Contacter le bon service',
    intro:
      'Ces entrées aident à orienter votre demande. Elles ne constituent pas la liste officielle des services administratifs tant que des organigrammes détaillés n’ont pas été confirmés.',
  },
  faq: {
    kicker: 'Aide',
    title: 'Questions fréquentes',
    intro: 'Réponses fondées sur les informations disponibles sur ce site.',
  },
  links: {
    kicker: 'Explorer',
    title: 'Liens institutionnels',
    intro: 'Accédez rapidement aux principales pages du site.',
  },
  finalCta: {
    title: 'Construisons ensemble l’avenir',
    text: 'L’Université William Booth reste un point de contact pour les personnes qui souhaitent découvrir ses formations, obtenir des renseignements ou explorer des possibilités de collaboration.',
    ctaFormations: 'Formations',
    ctaAdmissions: 'Admissions',
    ctaNews: 'Actualités',
  },
} as const

export const contactChannels: ContactChannel[] = [
  {
    id: 'name',
    kind: 'address',
    label: 'Établissement',
    value: site.name,
    href: '#coordonnees',
    actionLabel: 'Voir les détails',
    verified: true,
  },
  {
    id: 'address',
    kind: 'address',
    label: 'Adresse',
    value: address,
    href: `https://www.openstreetmap.org/search?query=${addressQuery}`,
    actionLabel: 'Afficher l’itinéraire',
    verified: site.contact.address.verified,
    note: site.contact.address.source
      ? `Source : ${site.contact.address.source}`
      : undefined,
  },
  ...site.contact.phones.map(
    (p, i): ContactChannel => ({
      id: `phone-${i}`,
      kind: 'phone',
      label: i === 0 ? 'Téléphone' : 'Téléphone (autre)',
      value: p.value,
      href: `tel:${p.value.replace(/\s/g, '')}`,
      actionLabel: 'Téléphoner',
      verified: p.verified,
      note: p.note,
    }),
  ),
  ...site.contact.emails.map(
    (e, i): ContactChannel => ({
      id: `email-${i}`,
      kind: 'email',
      label: i === 0 ? 'Courriel' : 'Courriel (autre)',
      value: e.value,
      href: `mailto:${e.value}`,
      actionLabel: 'Envoyer un courriel',
      verified: e.verified,
    }),
  ),
  {
    id: 'website',
    kind: 'website',
    label: 'Site web officiel',
    value: 'uwbcongo.org',
    href: site.officialWebsite,
    actionLabel: 'Ouvrir le site officiel',
    verified: true,
  },
]

/**
 * Carte centrée sur la commune de Gombe (secteur de l’adresse officielle).
 * Pas de marqueur prétendant être l’entrée exacte du campus.
 * Bbox approximatif de la commune — zone indicative uniquement.
 */
export const campusMap: CampusMapConfig = {
  mode: 'zone',
  title: 'Où nous trouver ?',
  addressLabel: address,
  zoneLabel: 'Gombe · Kinshasa · RDC',
  disclaimer:
    'Carte centrée sur la commune de Gombe, correspondant à l’adresse officielle publiée. L’emplacement exact de l’entrée du campus n’est pas confirmé par des coordonnées GPS institutionnelles — ne pas considérer le centre de la carte comme l’entrée.',
  osmEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=15.285%2C-4.325%2C15.335%2C-4.285&layer=mapnik',
  osmSearchUrl: `https://www.openstreetmap.org/search?query=${addressQuery}`,
  googleSearchUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`,
  fallbackImage: uwbMedia.campus,
  fallbackAlt: 'Vue campus — Université William Booth',
}

export const contactDepartments: ContactDepartment[] = [
  {
    id: 'admissions',
    title: 'Admissions et inscriptions',
    description:
      'Questions sur les candidatures, le formulaire d’inscription et le suivi d’un dossier.',
    subjectHint: 'Admissions et inscriptions',
    email: 'infos@uwbcongo.org',
    cta: 'Préparer une demande',
  },
  {
    id: 'academique',
    title: 'Informations académiques',
    description:
      'Renseignements sur les facultés, les formations et l’orientation des parcours.',
    subjectHint: 'Facultés et formations',
    email: 'infos@uwbcongo.org',
    cta: 'Préparer une demande',
  },
  {
    id: 'financier',
    title: 'Informations financières',
    description:
      'Frais académiques et modalités de paiement — aucune grille n’étant affichée ici, contactez l’administration.',
    subjectHint: 'Questions financières',
    cta: 'Préparer une demande',
  },
  {
    id: 'publications',
    title: 'Publications scientifiques',
    description:
      'Demandes liées aux publications et à la diffusion scientifique de l’université.',
    subjectHint: 'Recherche et publications',
    cta: 'Préparer une demande',
  },
  {
    id: 'partenariats',
    title: 'Partenariats institutionnels',
    description:
      'Propositions de collaboration avec des institutions, entreprises ou partenaires.',
    subjectHint: 'Partenariats',
    email: 'rectorat@uwbcongo.org',
    cta: 'Préparer une demande',
  },
  {
    id: 'general',
    title: 'Assistance générale',
    description:
      'Toute autre demande d’information sur l’Université William Booth.',
    subjectHint: 'Informations générales',
    email: 'infos@uwbcongo.org',
    phone: site.contact.phones[0]?.value,
    cta: 'Préparer une demande',
  },
]

export const contactFaq: ContactFaqItem[] = [
  {
    id: 'ou',
    question: 'Où se trouve l’Université William Booth ?',
    answer: `L’adresse officielle publiée est : ${address}. Consultez la section localisation de cette page pour ouvrir un service de cartographie à partir de cette adresse.`,
  },
  {
    id: 'comment',
    question: 'Comment contacter l’université ?',
    answer: `Par téléphone (${site.contact.phones.map((p) => p.value).join(' ou ')}) ou par courriel (${site.contact.emails.map((e) => e.value).join(' · ')}). Vous pouvez aussi préparer une demande via le formulaire de cette page.`,
  },
  {
    id: 'admission',
    question: 'Où trouver les informations d’admission ?',
    answer:
      'Rendez-vous sur la page Admissions et inscriptions de ce site, et consultez également le formulaire officiel publié sur uwbcongo.org.',
  },
  {
    id: 'facultes',
    question: 'Comment découvrir les facultés ?',
    answer:
      'La page Facultés et formations présente les entités listées sur le site institutionnel, avec fiches détaillées lorsque les informations sont disponibles.',
  },
  {
    id: 'actu',
    question: 'Où consulter les actualités officielles ?',
    answer:
      'Sur la page Actualités de ce site, alimentée à partir des communiqués et publications de uwbcongo.org.',
  },
  {
    id: 'pub',
    question: 'Comment obtenir des informations sur les publications scientifiques ?',
    answer:
      'Consultez la page Publications de ce site, ou contactez l’université via infos@uwbcongo.org / rectorat@uwbcongo.org pour une demande précise.',
  },
]

export const institutionalLinks: InstitutionalLink[] = [
  { label: 'Accueil', to: '/', available: true },
  { label: 'À propos', to: '/presentation', available: true },
  { label: 'Facultés et formations', to: '/facultes', available: true },
  { label: 'Admissions et inscriptions', to: '/admissions', available: true },
  { label: 'Actualités', to: '/actualites', available: true },
  { label: 'Bibliothèque virtuelle', to: '/bibliotheque', available: true },
  { label: 'Publications scientifiques', to: '/publications', available: true },
]

/** Adresse e-mail par défaut pour le mailto de secours (vérifiée). */
export const contactDefaultEmail = 'infos@uwbcongo.org'
