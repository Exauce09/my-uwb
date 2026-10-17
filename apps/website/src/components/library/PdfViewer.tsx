import { ExternalLink, FileWarning } from 'lucide-react'

type Props = {
  fileUrl?: string
  title: string
  format?: string
}

/** Lecteur PDF embarqué — utilise un fichier réel uniquement s’il est fourni. */
export function PdfViewer({ fileUrl, title, format }: Props) {
  if (!fileUrl || format === 'docx') {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center border border-dashed border-uwb-navy/15 bg-uwb-surface px-6 py-12 text-center">
        <FileWarning className="h-10 w-10 text-uwb-red" />
        <p className="mt-4 font-display text-2xl font-semibold text-uwb-navy">
          {format === 'docx'
            ? 'Aperçu DOCX non disponible'
            : 'Aucun fichier à afficher'}
        </p>
        <p className="mt-2 max-w-md text-sm text-uwb-muted">
          {format === 'docx'
            ? 'Ce document est au format Word. Utilisez le téléchargement pour l’ouvrir hors ligne.'
            : 'Cette fiche n’a pas de fichier associé, ou la ressource est uniquement une démonstration.'}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-uwb-navy/10 bg-uwb-navy">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <p className="truncate text-sm text-white/80">{title}</p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-uwb-red"
        >
          Nouvel onglet <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe
        title={`Lecture — ${title}`}
        src={`${fileUrl}#view=FitH`}
        className="h-[min(70vh,40rem)] w-full bg-white"
      />
    </div>
  )
}
