import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SectionHeading } from '../components/ui/SectionHeading'
import { filterFaculties } from '../data/faculties'
import { getPublishedFormations } from '../data/formations'
import { filterArticles } from '../data/news'

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''

  const faculties = useMemo(() => filterFaculties(q), [q])
  const formations = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = getPublishedFormations()
    if (!needle) return list
    return list.filter(
      (f) =>
        f.title.toLowerCase().includes(needle) ||
        f.facultyName.toLowerCase().includes(needle) ||
        f.facultyShortName.toLowerCase().includes(needle) ||
        f.summary.toLowerCase().includes(needle) ||
        f.cycleLabel.toLowerCase().includes(needle),
    )
  }, [q])
  const articles = useMemo(() => filterArticles(q), [q])
  const empty =
    faculties.length === 0 &&
    formations.length === 0 &&
    articles.length === 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Recherche"
        title={q ? `Résultats pour « ${q} »` : 'Recherche'}
        description="Parcourt les facultés, formations et actualités disponibles sur le site."
      />

      {!q ? (
        <p className="text-uwb-muted">Saisissez un terme dans la barre de recherche.</p>
      ) : empty ? (
        <p className="text-uwb-muted">Aucun contenu trouvé.</p>
      ) : (
        <div className="space-y-10">
          {faculties.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-uwb-red uppercase">
                Facultés
              </h2>
              <ul className="space-y-2">
                {faculties.map((f) => (
                  <li key={f.id}>
                    <Link
                      to={`/facultes/${f.slug}`}
                      className="font-medium text-uwb-blue hover:text-uwb-red"
                    >
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {formations.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-uwb-red uppercase">
                Formations
              </h2>
              <ul className="space-y-2">
                {formations.map((f) => (
                  <li key={f.id}>
                    <Link
                      to={`/formations/${f.slug}`}
                      className="font-medium text-uwb-blue hover:text-uwb-red"
                    >
                      {f.title}
                      <span className="mt-0.5 block text-sm font-normal text-uwb-muted">
                        {f.facultyShortName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {articles.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-uwb-red uppercase">
                Actualités
              </h2>
              <ul className="space-y-2">
                {articles.map((a) => (
                  <li key={a.id}>
                    <Link
                      to={`/actualites/${a.slug}`}
                      className="font-medium text-uwb-blue hover:text-uwb-red"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}
