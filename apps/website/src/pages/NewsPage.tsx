import { useEffect, useMemo } from 'react'
import { FeaturedNews } from '../components/news/FeaturedNews'
import { EventsSection } from '../components/news/EventsSection'
import { NewsFilters } from '../components/news/NewsFilters'
import { NewsGrid } from '../components/news/NewsGrid'
import { NewsHero } from '../components/news/NewsHero'
import { NewsPagination } from '../components/news/NewsPagination'
import { NewsSearch } from '../components/news/NewsSearch'
import { NewsletterForm } from '../components/news/NewsletterForm'
import { getFeaturedArticles, getPublishedArticles } from '../data/news'
import { useNewsSearch } from '../hooks/useNewsSearch'

export function NewsPage() {
  const news = useNewsSearch()

  useEffect(() => {
    const previous = document.title
    document.title = 'Actualités · Université William Booth'
    return () => {
      document.title = previous
    }
  }, [])

  const featuredBlock = useMemo(() => {
    if (news.hasActiveFilters) return null
    const featuredList = getFeaturedArticles()
    const lead = featuredList[0]
    if (!lead) return null
    const secondary = getPublishedArticles()
      .filter((a) => a.id !== lead.id)
      .slice(0, 2)
    return { lead, secondary }
  }, [news.hasActiveFilters])

  return (
    <div>
      <NewsHero />

      {featuredBlock ? (
        <FeaturedNews
          featured={featuredBlock.lead}
          secondary={featuredBlock.secondary}
        />
      ) : null}

      <section
        id="actualites-liste"
        className="scroll-mt-28 bg-white py-14 lg:py-16"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 max-w-2xl">
            <NewsSearch
              value={news.query}
              onChange={news.setQuery}
              onClear={() => news.setQuery('')}
            />
          </div>
          <NewsFilters
            category={news.category}
            sort={news.sort}
            total={news.total}
            hasActiveFilters={news.hasActiveFilters}
            onCategory={news.setCategory}
            onSort={news.setSort}
            onReset={news.reset}
          />
          <div className="mt-10">
            <NewsGrid
              articles={news.pageItems}
              emptyQuery={news.query.trim() || undefined}
            />
            <NewsPagination
              page={news.page}
              totalPages={news.totalPages}
              onPage={(p) => {
                news.setPage(p)
                document
                  .getElementById('actualites-liste')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            />
          </div>
        </div>
      </section>

      <EventsSection />
      <NewsletterForm />
    </div>
  )
}
