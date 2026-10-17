import { useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { Reveal } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { ProvisionalBadge } from '../components/ui/ProvisionalBadge'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../data/site'

export function PublicationsPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Publications scientifiques · Université William Booth'
    const meta = document.querySelector('meta[name="description"]')
    const previousDesc = meta?.getAttribute('content') ?? ''
    if (meta) {
      meta.setAttribute(
        'content',
        'Catalogue des publications scientifiques de l’Université William Booth — en préparation. Accès au canal officiel et à la bibliothèque virtuelle.',
      )
    }
    return () => {
      document.title = previous
      if (meta) meta.setAttribute('content', previousDesc)
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <ProvisionalBadge />
        </div>
        <SectionHeading
          eyebrow="Recherche"
          title="Publications scientifiques"
          description="Espace réservé aux publications, mémoires et travaux validés de la communauté UWB."
        />
        <p className="mt-6 text-base leading-relaxed text-uwb-muted">
          Le catalogue intégré à ce site est en préparation. Aucune publication
          scientifique n’est listée ici pour le moment : aucun titre, auteur ou
          référence n’a été inventé.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-uwb-muted">
          En attendant l’alimentation éditoriale de cette rubrique, consultez le
          canal officiel de l’université ou les travaux déjà disponibles dans la
          bibliothèque virtuelle.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            href={site.officialPublicationUrl}
            className="rounded-none"
            target="_blank"
            rel="noreferrer"
          >
            Publications sur uwbcongo.org
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Button>
          <Button to="/bibliotheque" variant="ghost" className="rounded-none">
            Bibliothèque virtuelle
          </Button>
        </div>

        <p className="mt-8 text-xs text-uwb-muted">
          Source officielle :{' '}
          <a
            href={site.officialPublicationUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uwb-red hover:underline"
          >
            {site.officialPublicationUrl}
          </a>
        </p>
      </Reveal>
    </div>
  )
}
