import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../data/site'

type Props = {
  title: string
  description: string
}

export function ComingSoonPage({ title, description }: Props) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Bientôt disponible" title={title} description={description} />
      <p className="mb-6 text-sm text-uwb-muted">
        Aucune authentification, aucun paiement et aucune donnée métier ne sont
        exposés sur cette page pour le moment.
      </p>
      <ul className="mb-8 space-y-2 text-sm">
        <li>
          <a
            href={site.officialElearningUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uwb-red hover:underline"
          >
            E-Learning officiel →
          </a>
        </li>
        <li>
          <a
            href={site.officialLibraryUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uwb-red hover:underline"
          >
            Bibliothèque virtuelle →
          </a>
        </li>
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button to="/">Retour à l’accueil</Button>
        <Button to="/contact" variant="ghost">
          Contact
        </Button>
      </div>
    </div>
  )
}
