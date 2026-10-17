import { useMemo, useState } from 'react'
import {
  NEWS_PAGE_SIZE,
  getPublishedArticles,
} from '../data/news'
import type { NewsArticle, NewsCategoryId } from '../types/news'

export type NewsSort = 'newest' | 'oldest'

export type NewsFilters = {
  query: string
  category: NewsCategoryId | 'all'
  sort: NewsSort
}

function matches(article: NewsArticle, filters: NewsFilters): boolean {
  if (filters.category !== 'all' && article.category !== filters.category) {
    return false
  }
  const q = filters.query.trim().toLowerCase()
  if (!q) return true
  return (
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.category.toLowerCase().includes(q) ||
    article.tags.some((t) => t.toLowerCase().includes(q)) ||
    article.author?.toLowerCase().includes(q) === true ||
    article.content.some((p) => p.toLowerCase().includes(q))
  )
}

export function useNewsSearch(pageSize = NEWS_PAGE_SIZE) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<NewsCategoryId | 'all'>('all')
  const [sort, setSort] = useState<NewsSort>('newest')
  const [page, setPage] = useState(1)

  const all = useMemo(() => getPublishedArticles(), [])

  const filtered = useMemo(() => {
    const list = all.filter((a) => matches(a, { query, category, sort }))
    return [...list].sort((a, b) => {
      const da = new Date(a.publishedAt).getTime()
      const db = new Date(b.publishedAt).getTime()
      return sort === 'newest' ? db - da : da - db
    })
  }, [all, query, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, pageSize, safePage])

  function reset() {
    setQuery('')
    setCategory('all')
    setSort('newest')
    setPage(1)
  }

  return {
    query,
    setQuery: (v: string) => {
      setQuery(v)
      setPage(1)
    },
    category,
    setCategory: (v: NewsCategoryId | 'all') => {
      setCategory(v)
      setPage(1)
    },
    sort,
    setSort: (v: NewsSort) => {
      setSort(v)
      setPage(1)
    },
    page: safePage,
    setPage,
    totalPages,
    total: filtered.length,
    pageItems,
    filtered,
    reset,
    hasActiveFilters: Boolean(query.trim()) || category !== 'all' || sort !== 'newest',
  }
}
