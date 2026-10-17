import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { ProvisionalBadge } from '../components/ui/ProvisionalBadge'
import { getFormationBySlug } from '../data/formations'
import { NotFoundPage } from './NotFoundPage'

export function FormationDetailPage() {
  const { formationSlug } = useParams()
  const formation = formationSlug
    ? getFormationBySlug(formationSlug)
    : undefined

  useEffect(() => {
    if (!formation) return
    const previous = document.title
    document.title = `${formation.title} · Formations UWB`
    return () => {
      document.title = previous
    }
  }, [formation])

  if (!formation) return <NotFoundPage />

  return (
    <div>
      <section className="relative overflow-hidden bg-uwb-navy text-white">
        <img
          src={formation.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/65 to-uwb-navy/40" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 sm:px-8 lg:py-28">
          <nav aria-label="Fil d’Ariane" className="text-sm text-white/65">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link to="/facultes" className="hover:text-white">
              Facultés
            </Link>
            <span className="mx-2">/</span>
            <Link
              to={`/facultes/${formation.facultySlug}`}
              className="hover:text-white"
            >
              {formation.facultyShortName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Formation</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-uwb-gold-soft uppercase">
              {formation.facultyName}
            </span>
            {!formation.verified ? (
              <ProvisionalBadge className="bg-white/20 text-white" />
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {formation.title}
          </h1>
          <p className="mt-4 text-sm text-white/75">{formation.cycleLabel}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-uwb-navy md:text-3xl">
            Présentation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-uwb-muted md:text-lg">
            {formation.summary}
          </p>
        </Reveal>

        {formation.objectives ? (
          <Reveal delay={0.06}>
            <h2 className="mt-12 font-display text-2xl font-semibold text-uwb-navy md:text-3xl">
              Objectifs
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uwb-muted md:text-lg">
              {formation.objectives}
            </p>
          </Reveal>
        ) : null}

        {formation.domains.length > 0 ? (
          <Reveal delay={0.08}>
            <h2 className="mt-12 font-display text-2xl font-semibold text-uwb-navy md:text-3xl">
              Domaines d’études
            </h2>
            <ul className="mt-5 grid gap-px bg-black/5 sm:grid-cols-2">
              {formation.domains.map((d) => (
                <li key={d} className="bg-uwb-surface px-4 py-3 text-sm text-uwb-muted">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <p className="mt-8 text-sm text-uwb-muted">
          Programme académique détaillé, débouchés et conditions d’admission
          spécifiques : information à confirmer auprès de l’UWB
          {!formation.cycleVerified
            ? ' — le cycle exact n’est pas encore publié de façon exhaustive.'
            : '.'}
        </p>

        {formation.sourceUrl ? (
          <p className="mt-6 text-sm text-uwb-muted">
            Source :{' '}
            <a
              href={formation.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-uwb-red hover:underline"
            >
              Page faculté sur uwbcongo.org
            </a>
          </p>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-black/8 pt-8">
          <Button to="/admissions" className="rounded-none">
            Informations sur les admissions
          </Button>
          <Button
            to={`/facultes/${formation.facultySlug}`}
            variant="ghost"
            className="rounded-none"
          >
            Voir la faculté
          </Button>
          <Button to="/facultes" variant="ghost" className="rounded-none">
            ← Catalogue
          </Button>
        </div>
      </div>
    </div>
  )
}
