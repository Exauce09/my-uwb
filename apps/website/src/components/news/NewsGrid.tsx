import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { newsCopy } from '../../data/newsCategories'
import type { NewsArticle } from '../../types/news'
import { Reveal } from '../motion/Reveal'
import { NewsCard } from './NewsCard'

type Props = {
  articles: NewsArticle[]
  emptyQuery?: string
}

export function NewsGrid({ articles, emptyQuery }: Props) {
  const reduced = useReducedMotion()

  if (articles.length === 0) {
    return (
      <div className="border border-dashed border-black/15 bg-uwb-surface px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-uwb-navy">
          Aucun résultat
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-uwb-muted">
          {emptyQuery
            ? `Aucune actualité pour « ${emptyQuery} ».`
            : newsCopy.search.empty}
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={articles.map((a) => a.id).join('-')}
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: 8 }}
        transition={{ duration: 0.35 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {articles.map((article, i) => (
          <Reveal key={article.id} delay={Math.min(i * 0.04, 0.28)}>
            <NewsCard article={article} />
          </Reveal>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
