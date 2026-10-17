import { DocumentGrid } from '../components/library/DocumentGrid'
import { FeaturedCollections } from '../components/library/FeaturedCollections'
import { LibraryFilters } from '../components/library/LibraryFilters'
import { LibraryHero } from '../components/library/LibraryHero'
import { LibrarySearch } from '../components/library/LibrarySearch'
import { Reveal } from '../components/motion/Reveal'
import { libraryCopy } from '../data/libraryCategories'
import { useLibrarySearch } from '../hooks/useLibrarySearch'

export function LibraryPage() {
  const lib = useLibrarySearch()

  return (
    <div className="bg-uwb-surface text-uwb-navy">
      <LibraryHero
        query={lib.filters.query}
        onQuery={lib.setQuery}
        onClear={lib.clearQuery}
        onQuick={lib.applyQuick}
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-uwb-muted">
          {libraryCopy.officialNotice} {libraryCopy.demoNotice}
        </p>

        <FeaturedCollections
          featured={lib.featured}
          official={lib.officialWorks}
          popularDemo={lib.popularDemo}
        />

        <section id="catalogue" className="scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex flex-col gap-4 border-b border-uwb-navy/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.25em] text-uwb-red uppercase">
                  Catalogue
                </p>
                <h2 className="mt-2 font-display text-4xl font-semibold text-uwb-navy">
                  Recherche documentaire
                </h2>
              </div>
              <div className="w-full max-w-md">
                <LibrarySearch
                  value={lib.filters.query}
                  onChange={lib.setQuery}
                  onClear={lib.clearQuery}
                  placeholder={libraryCopy.searchPlaceholder}
                />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <LibraryFilters
              filters={lib.filters}
              years={lib.years}
              resultCount={lib.results.length}
              onToggleType={lib.toggleType}
              onToggleDomain={lib.toggleDomain}
              onSetYear={lib.setYear}
              onSetSort={lib.setSort}
              onReset={lib.resetFilters}
            />
            <DocumentGrid
              documents={lib.results}
              emptyQuery={lib.filters.query}
              catalogEmpty={lib.catalogCount === 0}
            />
          </div>
        </section>

        {/* Espace personnel — structure visuelle, non authentifié */}
        <section className="mt-20 border border-uwb-navy/8 bg-white p-8 lg:p-10">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.25em] text-uwb-red uppercase">
              Espace personnel
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy">
              Favoris, historique et cours
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-uwb-muted">
              Cette zone accueillera favoris, documents consultés, téléchargements
              autorisés et ressources de cours une fois l’authentification SIGU-UWB
              branchée. Aucune donnée confidentielle n’est enregistrée pour
              l’instant.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                'Mes favoris',
                'Consultés récemment',
                'Téléchargements',
                'Ressources de cours',
              ].map((label) => (
                <div
                  key={label}
                  className="border border-dashed border-uwb-navy/15 bg-uwb-surface px-4 py-6 text-center text-sm text-uwb-muted/70"
                >
                  {label}
                  <span className="mt-1 block text-[10px] tracking-wide uppercase">
                    Bientôt
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
