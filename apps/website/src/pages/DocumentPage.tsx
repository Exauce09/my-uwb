import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Download,
  BookOpen,
  Lock,
} from 'lucide-react'
import { PdfViewer } from '../components/library/PdfViewer'
import { Reveal } from '../components/motion/Reveal'
import {
  libraryDomainLabels,
  libraryTypeLabels,
} from '../data/libraryCategories'
import { getPublicLibraryDocumentById } from '../data/libraryDocuments'
import { NotFoundPage } from './NotFoundPage'

export function DocumentPage() {
  const { documentId } = useParams()
  const doc = documentId ? getPublicLibraryDocumentById(documentId) : undefined
  const [copied, setCopied] = useState(false)
  const [showReader, setShowReader] = useState(false)

  const citation = useMemo(() => {
    if (!doc) return ''
    return `${doc.authors.join(', ')}. (${doc.publicationYear}). ${doc.title}. Bibliothèque numérique UWB.`
  }, [doc])

  if (!doc) return <NotFoundPage />

  const canReadOnline = Boolean(doc.fileUrl && doc.fileFormat === 'pdf')
  const canDownload = Boolean(doc.fileUrl)
  const isRestrictedDemo =
    doc.accessLevel !== 'public' && !doc.fileUrl

  function copyCitation() {
    void navigator.clipboard.writeText(citation).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-uwb-surface">
      <div className="border-b border-uwb-navy/8 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <Link
            to="/bibliotheque"
            className="inline-flex items-center gap-2 text-sm font-medium text-uwb-blue transition hover:text-uwb-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
        </div>
      </div>

      <article className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[280px_1fr] lg:py-16">
        <Reveal>
          <div className="overflow-hidden border border-uwb-navy/10 bg-white shadow-sm">
            <img
              src={doc.coverUrl}
              alt=""
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {doc.isOfficial ? (
              <span className="bg-uwb-red px-2 py-1 text-[10px] font-semibold tracking-wide text-uwb-navy uppercase">
                Officiel UWB
              </span>
            ) : null}
            {doc.isDemo ? (
              <span className="border border-uwb-navy/15 px-2 py-1 text-[10px] font-semibold tracking-wide text-uwb-muted uppercase">
                Démonstration
              </span>
            ) : null}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
              {libraryTypeLabels[doc.type]} ·{' '}
              {libraryDomainLabels[doc.academicDomain]}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-uwb-navy md:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-4 text-lg text-uwb-muted">
              {doc.authors.join(', ')} · {doc.publicationYear}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-uwb-muted">
              {doc.description}
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-uwb-muted sm:grid-cols-2">
              <li>
                <span className="font-semibold text-uwb-navy">Accès : </span>
                {doc.accessLevel}
              </li>
              <li>
                <span className="font-semibold text-uwb-navy">Format : </span>
                {doc.fileFormat
                  ? `${doc.fileFormat.toUpperCase()}${doc.fileSizeLabel ? ` · ${doc.fileSizeLabel}` : ''}`
                  : 'Fiche seule (pas de fichier)'}
              </li>
              <li className="sm:col-span-2">
                <span className="font-semibold text-uwb-navy">Mots-clés : </span>
                {doc.keywords.join(' · ')}
              </li>
            </ul>

            {doc.isDemo ? (
              <p className="mt-6 border border-uwb-red/40 bg-uwb-red/10 px-4 py-3 text-sm text-uwb-muted">
                Fiche de démonstration — ne constitue pas une publication
                officielle de l’Université William Booth.
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {canReadOnline ? (
                <button
                  type="button"
                  onClick={() => setShowReader(true)}
                  className="inline-flex items-center gap-2 bg-uwb-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-uwb-navy"
                >
                  <BookOpen className="h-4 w-4" />
                  Lire en ligne
                </button>
              ) : isRestrictedDemo ? (
                <span className="inline-flex items-center gap-2 border border-uwb-navy/15 px-5 py-3 text-sm text-uwb-muted">
                  <Lock className="h-4 w-4" />
                  Lecture réservée (démo)
                </span>
              ) : null}

              {canDownload ? (
                <a
                  href={doc.fileUrl}
                  download
                  className="inline-flex items-center gap-2 border border-uwb-navy/15 bg-white px-5 py-3 text-sm font-semibold text-uwb-navy transition hover:border-uwb-red"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 border border-dashed border-uwb-navy/15 px-5 py-3 text-sm text-uwb-muted">
                  Téléchargement indisponible
                </span>
              )}

              <button
                type="button"
                onClick={copyCitation}
                className="inline-flex items-center gap-2 border border-uwb-navy/15 px-5 py-3 text-sm font-semibold text-uwb-blue transition hover:border-uwb-red"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Référence copiée' : 'Copier la référence'}
              </button>
            </div>
          </Reveal>

          {showReader ? (
            <div className="mt-10">
              <PdfViewer
                fileUrl={doc.fileUrl}
                title={doc.title}
                format={doc.fileFormat}
              />
            </div>
          ) : null}
        </div>
      </article>
    </div>
  )
}
