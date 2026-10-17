import { Link } from 'react-router-dom'
import type { Formation } from '../../types/formation'
import { facultyCopy } from '../../data/facultyCopy'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

type Props = {
  formation: Formation
}

export function FormationCard({ formation }: Props) {
  return (
    <article className="group flex h-full flex-col border border-black/8 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-uwb-red/25 hover:shadow-lg hover:shadow-black/5 max-md:hover:translate-y-0">
      <Link to={`/formations/${formation.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-uwb-navy">
          <img
            src={formation.image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-uwb-red uppercase">
            {formation.facultyShortName}
          </span>
          {!formation.verified ? <ProvisionalBadge /> : null}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold text-uwb-navy">
          <Link
            to={`/formations/${formation.slug}`}
            className="transition hover:text-uwb-red"
          >
            {formation.title}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-uwb-muted">{formation.cycleLabel}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-uwb-muted">
          {formation.summary}
        </p>
        <Link
          to={`/formations/${formation.slug}`}
          className="mt-5 text-sm font-semibold text-uwb-red"
        >
          {facultyCopy.catalog.readMore} →
        </Link>
      </div>
    </article>
  )
}
