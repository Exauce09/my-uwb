export type NavItem = {
  label: string
  to: string
}

/** Liens visibles dans la barre. La recherche site = champ, pas un lien. */
export const primaryNav: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/presentation' },
  { label: 'Actualités', to: '/actualites' },
]

/** Menu — sans barre audiences, sans Services numériques. */
export const moreNav: NavItem[] = [
  { label: 'Facultés & formations', to: '/facultes' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Recherche', to: '/recherche' },
  { label: 'Contact', to: '/contact' },
  { label: 'Bibliothèque virtuelle', to: '/bibliotheque' },
]

export const mainNav: NavItem[] = [...primaryNav, ...moreNav]

export const footerNav = {
  discover: [
    { label: 'Présentation', to: '/presentation' },
    { label: 'Facultés & formations', to: '/facultes' },
    { label: 'Admissions', to: '/admissions' },
  ],
  resources: [
    { label: 'Recherche', to: '/recherche' },
    { label: 'Actualités', to: '/actualites' },
    { label: 'Publications', to: '/publications' },
    { label: 'Bibliothèque virtuelle', to: '/bibliotheque' },
  ],
  services: [
    { label: 'Connexion', to: '/connexion' },
    { label: 'Espace étudiant', to: '/espace-etudiant' },
    { label: 'Espace enseignant', to: '/espace-enseignant' },
    { label: 'Contact', to: '/contact' },
  ],
}

export const officialQuickLinks = [
  { label: 'Inscription', to: '/admissions' },
  { label: 'Facultés', to: '/facultes' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Bibliothèque virtuelle', to: '/bibliotheque' },
  { label: 'Contact', to: '/contact' },
]
