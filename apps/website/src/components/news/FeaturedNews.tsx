import { Link } from 'react-router-dom'
import { formatDateFr } from '../../data/news'
import { newsCategoryLabels } from '../../data/newsCategories'
import type { NewsArticle } from '../../types/news'
import { Reveal } from '../motion/Reveal'

type Props = {
  featured: NewsArticle
  secondary: NewsArticle[]
}

export function FeaturedNews({ featured, secondary }: Props) {
  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Link
              to={`/actualites/${featured.slug}`}
              className="group relative block overflow-hidden bg-uwb-navy"
            >
              <img
                src={featured.coverImage}
                alt=""
                className="aspect-[16/11] w-full object-cover transition duration-700 group-hover:scale-105 lg:aspect-[16/12] lg:min-h-[26rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-uwb-gold-soft uppercase">
                  {newsCategoryLabels[featured.category]} ·{' '}
                  <time dateTime={featured.publishedAt}>
                    {formatDateFr(featured.publishedAt)}
                  </time>
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm text-white/75 md:text-base">
                  {featured.excerpt}
                </p>
                <span className="mt-5 inline-block text-sm font-semibold tracking-wide">
                  Lire l’article →
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-5">
            {secondary.map((article, i) => (
              <Reveal key={article.id} delay={0.08 + i * 0.06}>
                <Link
                  to={`/actualites/${article.slug}`}
                  className="group grid flex-1 grid-cols-[7.5rem_1fr] gap-4 overflow-hidden border border-black/8 bg-uwb-surface transition hover:border-uwb-red/30 sm:grid-cols-[9rem_1fr]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt=""
                      className="h-full min-h-[7.5rem] w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-3 pr-4">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-uwb-red uppercase">
                      {newsCategoryLabels[article.category]}
                    </p>
                    <time
                      dateTime={article.publishedAt}
                      className="mt-1 text-[11px] text-uwb-muted"
                    >
                      {formatDateFr(article.publishedAt)}
                    </time>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-uwb-navy transition group-hover:text-uwb-red sm:text-xl">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
