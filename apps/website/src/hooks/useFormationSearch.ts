import { useMemo, useState } from 'react'
import { getVerifiedFaculties } from '../data/faculties'
import { getPublishedFormations } from '../data/formations'
import type { FacultyKind } from '../types/faculty'

export type FormationSort = 'name-asc' | 'name-desc'

export function useFormationSearch() {
  const [query, setQuery] = useState('')
  const [facultyId, setFacultyId] = useState<string | 'all'>('all')
  const [kind, setKind] = useState<FacultyKind | 'all'>('all')
  const [sort, setSort] = useState<FormationSort>('name-asc')
  const [orientationIds, setOrientationIds] = useState<string[] | null>(null)

  const all = useMemo(() => getPublishedFormations(), [])
  const facultyOptions = useMemo(() => getVerifiedFaculties(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = all.filter((f) => {
      if (facultyId !== 'all' && f.facultyId !== facultyId) return false
      if (orientationIds && !orientationIds.includes(f.facultyId)) return false
      if (kind !== 'all' && f.kind !== kind) return false
      if (!q) return true
      return (
        f.title.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q) ||
        f.facultyName.toLowerCase().includes(q) ||
        f.facultyShortName.toLowerCase().includes(q) ||
        f.cycleLabel.toLowerCase().includes(q) ||
        f.domains.some((d) => d.toLowerCase().includes(q))
      )
    })
    list = [...list].sort((a, b) => {
      const cmp = a.title.localeCompare(b.title, 'fr')
      return sort === 'name-asc' ? cmp : -cmp
    })
    return list
  }, [all, query, facultyId, kind, sort, orientationIds])

  function reset() {
    setQuery('')
    setFacultyId('all')
    setKind('all')
    setSort('name-asc')
    setOrientationIds(null)
  }

  return {
    query,
    setQuery: (v: string) => {
      setQuery(v)
      setOrientationIds(null)
    },
    facultyId,
    setFacultyId: (v: string | 'all') => {
      setFacultyId(v)
      setOrientationIds(null)
    },
    kind,
    setKind,
    sort,
    setSort,
    filtered,
    total: filtered.length,
    facultyOptions,
    reset,
    hasActiveFilters:
      Boolean(query.trim()) ||
      facultyId !== 'all' ||
      kind !== 'all' ||
      sort !== 'name-asc' ||
      Boolean(orientationIds),
    applyOrientation: (ids: string[]) => {
      setQuery('')
      setFacultyId('all')
      setKind('all')
      setOrientationIds(ids)
      document
        .getElementById('catalogue-formations')
        ?.scrollIntoView({ behavior: 'smooth' })
    },
  }
}
