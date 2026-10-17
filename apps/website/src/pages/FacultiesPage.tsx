import { useEffect, useMemo } from 'react'
import { AdmissionsCallToAction } from '../components/faculties/AdmissionsCallToAction'
import { FacultiesGrid } from '../components/faculties/FacultiesGrid'
import { FacultiesHero } from '../components/faculties/FacultiesHero'
import { FormationCatalog } from '../components/faculties/FormationCatalog'
import { OrientationSection } from '../components/faculties/OrientationSection'
import { getPublicFaculties } from '../data/faculties'
import { useFormationSearch } from '../hooks/useFormationSearch'

export function FacultiesPage() {
  const search = useFormationSearch()

  useEffect(() => {
    const previous = document.title
    document.title = 'Facultés et formations · Université William Booth'
    return () => {
      document.title = previous
    }
  }, [])

  /** Grille = catalogue public vérifié (D3) — pas les entités non listées. */
  const official = useMemo(() => getPublicFaculties(), [])

  return (
    <div>
      <FacultiesHero query={search.query} onQuery={search.setQuery} />
      {/* D3 : pas de liste publique « à confirmer » — données conservées hors UI. */}
      <FacultiesGrid official={official} pending={[]} />
      <FormationCatalog
        formations={search.filtered}
        total={search.total}
        facultyId={search.facultyId}
        kind={search.kind}
        sort={search.sort}
        facultyOptions={search.facultyOptions}
        hasActiveFilters={search.hasActiveFilters}
        onFaculty={search.setFacultyId}
        onKind={search.setKind}
        onSort={search.setSort}
        onReset={search.reset}
      />
      <OrientationSection onSelect={search.applyOrientation} />
      <AdmissionsCallToAction />
    </div>
  )
}
