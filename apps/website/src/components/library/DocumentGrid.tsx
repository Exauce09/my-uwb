import type { LibraryDocument } from '../../types/library'
import { DocumentCard } from './DocumentCard'

type Props = {
  documents: LibraryDocument[]
  emptyQuery?: string
  catalogEmpty?: boolean
}

export function DocumentGrid({
  documents,
  emptyQuery,
  catalogEmpty,
}: Props) {
  if (catalogEmpty) {
    return (
      <div className="border border-dashed border-uwb-navy/15 bg-uwb-surface px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-uwb-navy">
          Catalogue vide
        </p>
        <p className="mt-2 text-sm text-uwb-muted">
          Aucune ressource publiée n’est disponible pour le moment.
        </p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="border border-dashed border-uwb-navy/15 bg-uwb-surface px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-uwb-navy">
          Aucun résultat
        </p>
        <p className="mt-2 text-sm text-uwb-muted">
          {emptyQuery
            ? `Aucune ressource ne correspond à « ${emptyQuery} ».`
            : 'Aucun document ne correspond aux filtres sélectionnés.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {documents.map((doc, i) => (
        <DocumentCard key={doc.id} document={doc} index={i} />
      ))}
    </div>
  )
}
