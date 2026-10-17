import { Link } from 'react-router-dom'
import { formatDateFr } from '../../data/news'
import { newsCategoryLabels } from '../../data/newsCategories'
import type { NewsArticle } from '../../types/news'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

type Props = {
  article: NewsArticle
  featured?: boolean
}

export function NewsCard({ article, featured = false }: Props) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border border-black/8 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-uwb-red/25 hover:shadow-lg hover:shadow-black/5 max-md:hover:translate-y-0 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      <Link
        to={`/actualites/${article.slug}`}
        className={`relative block overflow-hidden bg-uwb-navy ${
          featured
            ? 'aspect-[16/10] md:aspect-auto md:min-h-full'
            : 'aspect-[16/10]'
        }`}
      >
        <img
          src={article.coverImage}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold tracking-wide text-uwb-red uppercase">
            {newsCategoryLabels[article.category]}
          </span>
          <span className="text-uwb-muted">·</span>
          <time dateTime={article.publishedAt} className="text-uwb-muted">
            {formatDateFr(article.publishedAt)}
          </time>
          {!article.verified ? <ProvisionalBadge /> : null}
        </div>
        <h3
          className={`font-display font-semibold text-uwb-navy ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          <Link
            to={`/actualites/${article.slug}`}
            className="transition hover:text-uwb-red"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-uwb-muted">
          {article.excerpt}
        </p>
        <Link
          to={`/actualites/${article.slug}`}
          className="mt-5 inline-flex text-sm font-semibold tracking-wide text-uwb-red"
        >
          Lire la suite →
        </Link>
      </div>
    </article>
  )
}
