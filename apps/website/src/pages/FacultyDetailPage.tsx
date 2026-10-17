import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { ProvisionalBadge } from '../components/ui/ProvisionalBadge'
import { getPublicFacultyBySlug } from '../data/faculties'
import { getFormationsByFaculty } from '../data/formations'
import { NotFoundPage } from './NotFoundPage'

export function FacultyDetailPage() {
  const { facultyId } = useParams()
  const faculty = facultyId ? getPublicFacultyBySlug(facultyId) : undefined
  const formations = faculty
    ? getFormationsByFaculty(faculty.id)
    : []

  useEffect(() => {
    if (!faculty) return
    const previous = document.title
    document.title = `${faculty.name} · UWB`
    return () => {
      document.title = previous
    }
  }, [faculty])

  if (!faculty) return <NotFoundPage />

  return (
    <div>
      <section className="relative isolate min-h-[65vh] overflow-hidden bg-uwb-navy text-white lg:min-h-[70vh]">
        <img
          src={faculty.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50 ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/50 to-uwb-navy/30" />
        <div className="relative mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:min-h-[70vh]">
          <nav aria-label="Fil d’Ariane" className="mb-8 text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link to="/facultes" className="hover:text-white">
              Facultés
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{faculty.shortName}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-white/30 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] uppercase">
              {faculty.kind === 'institut' ? 'Institut' : 'Faculté'}
            </span>
            {!faculty.verified ? (
              <ProvisionalBadge className="bg-white/20 text-white" />
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-tight md:text-6xl lg:text-7xl">
            {faculty.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">{faculty.summary}</p>
          {faculty.note ? (
            <p className="mt-3 max-w-2xl text-sm text-white/60">{faculty.note}</p>
          ) : null}
          <p className="mt-6 text-[11px] text-white/40">{faculty.imageCredit}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-14">
            {faculty.mission ? (
              <Reveal>
                <h2 className="font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                  Présentation
                </h2>
                <p className="mt-5 text-base leading-relaxed text-uwb-muted md:text-lg">
                  {faculty.mission}
                </p>
              </Reveal>
            ) : null}

            {faculty.domains && faculty.domains.length > 0 ? (
              <Reveal>
                <h2 className="font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                  Domaines et filières documentés
                </h2>
                <ul className="mt-6 grid gap-px bg-black/5 sm:grid-cols-2">
                  {faculty.domains.map((domain) => (
                    <li
                      key={domain}
                      className="bg-white px-5 py-4 text-sm text-uwb-muted"
                    >
                      {domain}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                Formations
              </h2>
              {formations.length === 0 ? (
                <p className="mt-5 text-sm text-uwb-muted">
                  Aucun programme détaillé publié pour cette entité sur les
                  sources consultées.
                </p>
              ) : (
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {formations.map((program) => (
                    <li key={program.id}>
                      <Link
                        to={`/formations/${program.slug}`}
                        className="block h-full border border-black/8 bg-white p-6 transition hover:border-uwb-red/30"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p className="text-[10px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
                            {program.cycleLabel}
                          </p>
                          {!program.verified ? <ProvisionalBadge /> : null}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-uwb-navy">
                          {program.title}
                        </h3>
                        <p className="mt-2 text-sm text-uwb-muted">
                          {program.summary}
                        </p>
                        <span className="mt-4 inline-block text-sm font-semibold text-uwb-red">
                          Voir la fiche →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {faculty.leadership && faculty.leadership.length > 0 ? (
              <div className="bg-uwb-surface p-7">
                <h2 className="font-display text-2xl font-semibold text-uwb-navy">
                  Encadrement
                </h2>
                <ul className="mt-5 space-y-4">
                  {faculty.leadership.map((person) => (
                    <li key={`${person.role}-${person.name}`}>
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
                        {person.role}
                      </p>
                      <p className="mt-1 text-sm text-uwb-navy">{person.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {faculty.sourceUrl ? (
              <div className="border border-black/8 p-7">
                <h2 className="font-display text-xl font-semibold text-uwb-navy">
                  Source
                </h2>
                <a
                  href={faculty.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-uwb-red"
                >
                  Ouvrir sur uwbcongo.org →
                </a>
              </div>
            ) : null}

            <div className="flex flex-col gap-3">
              <Button to="/admissions" className="rounded-none">
                Informations sur les admissions
              </Button>
              <Button to="/contact" variant="ghost" className="rounded-none">
                Nous contacter
              </Button>
              <Button to="/facultes" variant="ghost" className="rounded-none">
                ← Toutes les facultés
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
