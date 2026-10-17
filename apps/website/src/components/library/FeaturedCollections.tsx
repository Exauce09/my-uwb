import { Link } from 'react-router-dom'
import { Reveal } from '../motion/Reveal'
import type { LibraryDocument } from '../../types/library'
import { DocumentCard } from './DocumentCard'

type Props = {
  featured: LibraryDocument[]
  official: LibraryDocument[]
  popularDemo: LibraryDocument[]
}

function Row({
  title,
  note,
  items,
}: {
  title: string
  note?: string
  items: LibraryDocument[]
}) {
  if (items.length === 0) return null
  return (
    <section className="mb-16">
      <Reveal>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-uwb-navy">
              {title}
            </h2>
            {note ? (
              <p className="mt-1 text-sm text-uwb-muted">{note}</p>
            ) : null}
          </div>
          <Link
            to="/bibliotheque#catalogue"
            className="text-sm font-semibold text-uwb-blue"
          >
            Voir le catalogue →
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((doc, i) => (
          <DocumentCard key={doc.id} document={doc} index={i} />
        ))}
      </div>
    </section>
  )
}

export function FeaturedCollections({
  featured,
  official,
  popularDemo,
}: Props) {
  return (
    <div>
      <Row
        title="Travaux scientifiques UWB"
        note="Documents issus de la bibliothèque virtuelle officielle."
        items={official}
      />
      <Row
        title="Sélection éditoriale"
        note="Ressources mises en avant dans le catalogue."
        items={featured}
      />
      <Row
        title="Populaires (démonstration)"
        note="Classement simulé à des fins d’interface — non basé sur des statistiques UWB."
        items={popularDemo}
      />
    </div>
  )
}
