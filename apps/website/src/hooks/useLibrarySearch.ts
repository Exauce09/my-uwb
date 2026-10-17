import { useMemo, useState } from 'react'
import { getPublishedLibraryDocuments } from '../data/libraryDocuments'
import type {
  LibraryDocument,
  LibraryDomain,
  LibraryFiltersState,
  LibraryResourceType,
  LibrarySort,
} from '../types/library'

const initial: LibraryFiltersState = {
  query: '',
  types: [],
  domains: [],
  year: 'all',
  sort: 'pertinence',
}

function scoreDocument(doc: LibraryDocument, q: string): number {
  if (!q) return doc.featured ? 2 : 1
  const hay = [
    doc.title,
    doc.description,
    doc.authors.join(' '),
    doc.keywords.join(' '),
    String(doc.publicationYear),
    doc.type,
    doc.academicDomain,
  ]
    .join(' ')
    .toLowerCase()
  if (!hay.includes(q)) return -1
  let s = 0
  if (doc.title.toLowerCase().includes(q)) s += 10
  if (doc.authors.some((a) => a.toLowerCase().includes(q))) s += 6
  if (doc.keywords.some((k) => k.toLowerCase().includes(q))) s += 4
  if (doc.description.toLowerCase().includes(q)) s += 2
  if (doc.featured) s += 1
  if (doc.isDemo && doc.demoPopularity) s += doc.demoPopularity / 100
  return s
}

export function useLibrarySearch() {
  const [filters, setFilters] = useState<LibraryFiltersState>(initial)
  const catalog = useMemo(() => getPublishedLibraryDocuments(), [])

  const years = useMemo(() => {
    const set = new Set(catalog.map((d) => d.publicationYear))
    return Array.from(set).sort((a, b) => b - a)
  }, [catalog])

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    let list = catalog.filter((doc) => {
      if (filters.types.length && !filters.types.includes(doc.type)) return false
      if (filters.domains.length && !filters.domains.includes(doc.academicDomain))
        return false
      if (filters.year !== 'all' && doc.publicationYear !== filters.year)
        return false
      if (q && scoreDocument(doc, q) < 0) return false
      return true
    })

    const sort: LibrarySort = filters.sort
    list = [...list].sort((a, b) => {
      if (sort === 'titre') return a.title.localeCompare(b.title, 'fr')
      if (sort === 'date-asc') return a.publicationYear - b.publicationYear
      if (sort === 'date-desc') return b.publicationYear - a.publicationYear
      return scoreDocument(b, q) - scoreDocument(a, q)
    })
    return list
  }, [catalog, filters])

  function setQuery(query: string) {
    setFilters((f) => ({ ...f, query }))
  }

  function toggleType(type: LibraryResourceType) {
    setFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }))
  }

  function toggleDomain(domain: LibraryDomain) {
    setFilters((f) => ({
      ...f,
      domains: f.domains.includes(domain)
        ? f.domains.filter((d) => d !== domain)
        : [...f.domains, domain],
    }))
  }

  function setYear(year: number | 'all') {
    setFilters((f) => ({ ...f, year }))
  }

  function setSort(sort: LibrarySort) {
    setFilters((f) => ({ ...f, sort }))
  }

  function clearQuery() {
    setFilters((f) => ({ ...f, query: '' }))
  }

  function resetFilters() {
    setFilters(initial)
  }

  function applyQuick(opts: {
    type?: LibraryResourceType
    domain?: LibraryDomain
  }) {
    setFilters((f) => ({
      ...f,
      types: opts.type ? [opts.type] : f.types,
      domains: opts.domain ? [opts.domain] : f.domains,
    }))
  }

  const featured = useMemo(
    () => catalog.filter((d) => d.featured),
    [catalog],
  )

  const popularDemo = useMemo(
    () =>
      [...catalog]
        .filter((d) => d.isDemo && d.demoPopularity)
        .sort((a, b) => (b.demoPopularity ?? 0) - (a.demoPopularity ?? 0))
        .slice(0, 4),
    [catalog],
  )

  const officialWorks = useMemo(
    () => catalog.filter((d) => d.isOfficial),
    [catalog],
  )

  return {
    filters,
    results,
    years,
    catalogCount: catalog.length,
    featured,
    popularDemo,
    officialWorks,
    setQuery,
    clearQuery,
    toggleType,
    toggleDomain,
    setYear,
    setSort,
    resetFilters,
    applyQuick,
  }
}
