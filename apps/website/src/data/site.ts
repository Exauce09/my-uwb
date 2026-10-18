/**
 * Contenu institutionnel UWB.
 * `verified: true` = repris du site officiel https://www.uwbcongo.org/
 * `verified: false` = à confirmer auprès de l’université.
 */

export type ContactItem = {
  value: string
  verified: boolean
  source?: string
  note?: string
}

export const site = {
  name: 'Université William Booth',
  shortName: 'UWB',
  motto: 'Dignité, Honneur, Excellence',
  city: 'Kinshasa',
  commune: 'Gombe',
  country: 'République démocratique du Congo',
  tagline:
    'Une université à Kinshasa engagée pour la formation, la recherche et le service à la société.',
  logoSrc: '/brand/logo-uwb.webp',
  officialWebsite: 'https://uwbcongo.org/index.php',
  officialAboutUrl: 'https://uwbcongo.org/about.php',
  officialInscriptionUrl: 'https://uwbcongo.org/inscription.php',
  officialInscriptionFormUrl: 'https://uwb-cisnet.com/inscriptions/formulaire',
  officialBlogUrl: 'https://uwbcongo.org/blog.php',
  officialLibraryUrl: 'https://uwbcongo.org/bibliotheque.php',
  officialElearningUrl: 'https://uwbcongo.org/enseignement/index.php',
  officialDefenseUrl: 'https://uwbcongo.org/defense.php',
  officialInfraUrl: 'https://uwbcongo.org/infra2.php',
  officialPublicationUrl: 'https://uwbcongo.org/publication.php',
  contact: {
    address: {
      value: '12 Avenue Du Kasai, Gombe, Kinshasa, RDC',
      verified: true,
      source: 'https://www.uwbcongo.org/',
    } satisfies ContactItem,
    phones: [
      {
        value: '+243 812 502 966',
        verified: true,
        source: 'https://www.uwbcongo.org/',
      },
      {
        value: '+243 815 431 601',
        verified: true,
        source: 'https://www.uwbcongo.org/',
        note: 'Numéro également indiqué dans le pied de page du site officiel.',
      },
    ] satisfies ContactItem[],
    emails: [
      {
        value: 'infos@uwbcongo.org',
        verified: true,
        source: 'https://www.uwbcongo.org/',
      },
      {
        value: 'rectorat@uwbcongo.org',
        verified: true,
        source: 'https://www.uwbcongo.org/',
      },
    ] satisfies ContactItem[],
  },
  links: {
    login: '/connexion',
    studentSpace: '/espace-etudiant',
    teacherSpace: '/espace-enseignant',
    sigu: '/connexion',
  },
}

export type ProvisionalField = ContactItem
