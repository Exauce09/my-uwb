/**
 * Page « À propos » — contenus institutionnels UWB.
 *
 * Sources vérifiées : https://uwbcongo.org/about.php , https://www.uwbcongo.org/
 * Les champs `provisional: true` sont rédactionnels / à valider auprès de l’UWB.
 */

export const presentation = {
  sourceUrl: 'https://uwbcongo.org/about.php',
  sourceLabel: 'uwbcongo.org/about.php',
  /**
   * Légende gouvernance (D6.1) — lien source conservé sans prétendre à une
   * validation formelle UWB de la composition adaptée.
   */
  managementSourceNote:
    'Composition présentée à partir de la page institutionnelle, adaptée avec prudence lorsque des informations institutionnelles plus récentes l’exigent. Cette présentation n’a pas été validée formellement par l’UWB comme composition officielle définitive ; la page source peut ne pas refléter les changements les plus récents.',

  /** Textes officiels (about.php). */
  intro: [
    'L’Université William Booth, en sigle UWB, est une université située dans la commune de la Gombe à Kinshasa, en République Démocratique du Congo.',
    'Elle dispose de 7 facultés et d’un Institut Supérieur autonome jouissant cependant du même encadrement.',
    'Elle est dirigée par le Recteur Prof. Ir. Roger Bimwala après avoir été dirigée par le Professeur Gaston MPIUTU ne MBODI.',
    'Sa devise est « Dignité, Honneur, Excellence ».',
  ],

  appointments: {
    title: 'Prendre rendez-vous',
    intro:
      'Des sujets d’accompagnement peuvent être évoqués auprès des services de l’université. Les modalités précises de rendez-vous (disponibilités, procédures) restent à confirmer auprès de l’UWB.',
    items: [
      'Visite de campus et orientation',
      'Consultation académique',
      'Soutien et services étudiants',
    ],
  },

  /**
   * Comité de gestion.
   * `status: 'active'` = titulaire affiché comme actuellement en fonction.
   * `status: 'historical'` = mention historique (pas un titulaire actuel).
   * Aucun successeur n’est inventé pour un poste sans confirmation UWB.
   */
  management: [
    {
      name: 'Prof. Dr. Ir. Roger BIMWALA MAMPUYA',
      role: 'Recteur',
      status: 'active' as const,
    },
    {
      name: 'Prof. Séraphin MVUDI MATINGU',
      role: 'Secrétaire Général Académique',
      status: 'active' as const,
    },
    {
      name: 'Mr. Bernard NZINGA LUZI',
      /** Ancien titulaire — ne pas présenter comme en fonction (actualité id=62). */
      role: 'Ancien Secrétaire Général Administratif',
      status: 'historical' as const,
      note:
        'Selon l’actualité officielle du 11 juin 2026, Monsieur Bernard Nzinga Luzi est décédé le 24 mai 2026. La composition actuelle du comité doit être confirmée auprès de l’UWB.',
      /** Lien déjà présent dans news.ts (article hommage-bernard-nzinga). */
      homageUrl: 'https://uwbcongo.org/actualite.php?id=62',
    },
  ],

  secondarySourceNote:
    'Une source publique secondaire (site123) mentionne aussi l’IFMP, l’EHEC et la Faculté des Sciences Commerciales et Financières. Ces entités sont listées à part tant qu’elles ne sont pas confirmées sur uwbcongo.org.',

  /** Contenu éditorial de la page À propos (sections 1–9). */
  about: {
    seo: {
      title: 'À propos · Université William Booth',
      description:
        'Identité, mission, vision, valeurs et domaines de formation de l’Université William Booth (UWB), Gombe, Kinshasa.',
    },

    hero: {
      kicker: 'Université William Booth',
      title: 'Bienvenue à l’Université William Booth',
      intro:
        'Établissement d’enseignement supérieur à Kinshasa, engagé pour la formation, la recherche et le service à la société — sous la devise « Dignité, Honneur, Excellence ».',
      imageCredit:
        'Photos officielles — amphithéâtre, diplômés et communauté, uwbcongo.org',
      ctaFaculties: 'Découvrir nos facultés',
      ctaExplore: 'Explorer notre université',
      scrollHint: 'Faire défiler',
    },

    identity: {
      kicker: 'Qui sommes-nous ?',
      title: 'Une université tournée vers l’avenir',
      paragraphs: [
        'L’Université William Booth est un établissement d’enseignement supérieur situé à Kinshasa, en République démocratique du Congo. À travers ses formations universitaires et ses activités académiques, elle participe à la formation des compétences et au développement des connaissances au service de la société.',
        'Sa devise, « Dignité, Honneur, Excellence », exprime les valeurs qui constituent le socle de son identité institutionnelle.',
      ],
      provisionalNote:
        'Titre et paragraphes : formulations éditoriales à valider. La devise et la note officielle ci-dessous s’appuient sur le site institutionnel.',
      /** Complément officiel (about.php) — non inventé. */
      officialNote:
        'Selon le site officiel : sept facultés et un institut supérieur autonome, sous le même encadrement, à Gombe (Kinshasa).',
      imageAlt: 'Campus Université William Booth',
      imageCredit: 'Photo officielle campus — uwbcongo.org',
    },

    pillars: {
      kicker: 'Notre identité',
      title: 'Trois piliers pour bâtir demain',
      provisionalNote:
        'Mission et vision : textes rédactionnels provisoires, à valider auprès de l’UWB.',
      items: [
        {
          id: 'mission',
          label: 'Notre mission',
          provisional: true,
          text: 'Contribuer à la formation de personnes compétentes, responsables et engagées par la transmission des connaissances, le développement des compétences et l’encouragement à la recherche.',
        },
        {
          id: 'vision',
          label: 'Notre vision',
          provisional: true,
          text: 'Renforcer la qualité de la formation universitaire et promouvoir l’innovation, la recherche et la contribution de l’université au développement de la société.',
        },
        {
          id: 'valeurs',
          label: 'Nos valeurs',
          provisional: false,
          text: 'Dignité · Honneur · Excellence',
          note: 'Devise officielle publiée sur uwbcongo.org/about.php.',
        },
      ],
    },

    values: {
      kicker: 'Nos valeurs fondamentales',
      title: 'Dignité · Honneur · Excellence',
      subtitle:
        'Trois engagements qui guident la vie académique et institutionnelle.',
      provisionalNote:
        'Développements éditoriaux des valeurs — à confirmer auprès de l’UWB.',
      items: [
        {
          id: 'dignite',
          label: 'Dignité',
          provisional: true,
          text: 'Le respect de la personne, la considération humaine et la promotion d’un environnement universitaire respectueux.',
        },
        {
          id: 'honneur',
          label: 'Honneur',
          provisional: true,
          text: 'L’intégrité, l’honnêteté, la responsabilité et le respect des engagements.',
        },
        {
          id: 'excellence',
          label: 'Excellence',
          provisional: true,
          text: 'La recherche de la qualité, la rigueur intellectuelle et l’amélioration continue.',
        },
      ],
    },

    faculties: {
      kicker: 'Formation',
      title: 'Des domaines de formation pour construire l’avenir',
      intro:
        'Facultés et institut supérieur présentés sur le site institutionnel uwbcongo.org.',
      discover: 'Découvrir',
      seeAll: 'Voir toutes les facultés',
    },

    campus: {
      kicker: 'Formation et vie universitaire',
      title: 'Apprendre, découvrir et se préparer à l’avenir',
      intro:
        'Amphithéâtres, formations, communauté académique : des espaces où se construit le parcours universitaire à Kinshasa.',
      linkFormations: 'Explorer les formations',
      linkNews: 'Actualités universitaires',
      imageNote:
        'Images officielles uwbcongo.org — vie universitaire et campus.',
    },

    research: {
      kicker: 'Recherche et innovation',
      title: 'Le savoir au service du progrès',
      intro:
        'La recherche documentaire, les travaux de fin de cycle, les publications et le partage des connaissances enrichissent la mission universitaire.',
      points: [
        'Recherche documentaire',
        'Travaux de fin de cycle',
        'Publications scientifiques',
        'Partage des connaissances',
        'Bibliothèque virtuelle',
      ],
      ctaLibrary: 'Explorer la bibliothèque',
      ctaPublications: 'Découvrir les publications',
    },

    students: {
      kicker: 'Engagement envers les étudiants',
      title: 'Chaque parcours est une promesse d’avenir',
      text: 'Le parcours universitaire est une étape essentielle dans le développement des connaissances, des compétences et de la responsabilité personnelle. L’accès à l’information, aux ressources pédagogiques et à un environnement d’apprentissage adapté contribue à enrichir cette expérience.',
      provisionalNote:
        'Texte rédactionnel — à valider auprès de l’UWB. Il ne constitue pas une déclaration officielle détaillée des services étudiants.',
      cta: 'Découvrir nos formations',
      appointmentsTitle: 'Accompagnement',
    },

    cta: {
      title: 'Écrivez la prochaine page de votre avenir',
      text: 'Découvrez les domaines de formation de l’Université William Booth et renseignez-vous sur les possibilités d’admission.',
      faculties: 'Nos facultés',
      formations: 'Nos formations',
      admissions: 'Informations sur les admissions',
    },
  },
} as const
