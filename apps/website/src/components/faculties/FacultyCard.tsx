import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Faculty } from '../../types/faculty'
import { facultyCopy } from '../../data/facultyCopy'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

type Props = {
  faculty: Faculty
  variant?: 'portrait' | 'editorial'
}

export function FacultyCard({ faculty, variant = 'portrait' }: Props) {
  if (variant === 'editorial') {
    return (
      <Link
        to={`/facultes/${faculty.slug}`}
        className="group grid overflow-hidden border border-black/8 bg-white transition hover:border-uwb-red/30 lg:grid-cols-2"
      >
        <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[16rem]">
          <img
            src={faculty.image}
            alt={`${faculty.kind === 'institut' ? 'Institut' : 'Faculté'} ${faculty.shortName}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
              {faculty.kind === 'institut' ? 'Institut' : 'Faculté'}
            </span>
            {!faculty.verified ? <ProvisionalBadge /> : null}
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-uwb-navy md:text-3xl">
            {faculty.name}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm text-uwb-muted">
            {faculty.summary}
          </p>
          {faculty.domains?.length ? (
            <p className="mt-3 text-xs text-uwb-muted/80">
              {faculty.domains.slice(0, 2).join(' · ')}
            </p>
          ) : null}
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-uwb-red">
            {facultyCopy.faculties.explore}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/facultes/${faculty.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-uwb-navy"
    >
      <img
        src={faculty.image}
        alt={`${faculty.kind === 'institut' ? 'Institut' : 'Faculté'} ${faculty.shortName}`}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {!faculty.verified ? (
          <ProvisionalBadge className="mb-2 bg-white/20 text-white" />
        ) : (
          <p className="text-[10px] font-semibold tracking-[0.2em] text-uwb-gold-soft uppercase">
            {faculty.kind === 'institut' ? 'Institut' : 'Faculté'}
          </p>
        )}
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">
          {faculty.shortName}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{faculty.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold">
          {facultyCopy.faculties.explore}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
