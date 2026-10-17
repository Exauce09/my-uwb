import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  libraryDomainLabels,
  libraryTypeLabels,
} from '../../data/libraryCategories'
import type { LibraryDocument } from '../../types/library'

type Props = {
  document: LibraryDocument
  index?: number
}

export function DocumentCard({ document: doc, index = 0 }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.28) }}
      className="group flex h-full flex-col overflow-hidden border border-uwb-navy/8 bg-white shadow-[0_1px_0_rgba(16,28,50,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,28,50,0.08)] max-md:hover:translate-y-0"
    >
      <Link to={`/bibliotheque/${doc.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-uwb-blue">
          <img
            src={doc.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] max-md:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy/70 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {doc.isOfficial ? (
              <span className="bg-uwb-red px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-uwb-navy uppercase">
                Officiel UWB
              </span>
            ) : null}
            {doc.isDemo ? (
              <span className="bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-uwb-muted uppercase">
                Démo
              </span>
            ) : null}
          </div>
          <p className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-[0.16em] text-white/85 uppercase">
            {libraryTypeLabels[doc.type]}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-uwb-red uppercase">
            {libraryDomainLabels[doc.academicDomain]} · {doc.publicationYear}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-uwb-navy transition group-hover:text-uwb-blue">
            {doc.title}
          </h3>
          <p className="mt-2 text-sm text-uwb-muted">
            {doc.authors.join(', ')}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-uwb-muted/85">
            {doc.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="text-[11px] text-uwb-muted/70">
              {doc.fileUrl
                ? `Disponible · ${doc.fileFormat?.toUpperCase() ?? 'Fichier'}`
                : doc.accessLevel === 'public'
                  ? 'Fiche seule'
                  : 'Accès restreint'}
            </span>
            <span className="text-xs font-semibold tracking-wide text-uwb-blue">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
