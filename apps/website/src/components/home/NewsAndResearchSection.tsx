import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { homeCopy } from '../../data/homeCopy'
import { formatDateFr, getPublishedArticles } from '../../data/news'
import { newsCategoryLabels } from '../../data/newsCategories'
import { researchHighlights } from '../../data/research'
import { Reveal } from '../motion/Reveal'

export function NewsAndResearchSection() {
  const copy = homeCopy.newsResearch
  const [lead, ...rest] = getPublishedArticles().slice(0, 4)

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col gap-4 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="mb-2 text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-semibold text-uwb-blue md:text-5xl">
              {copy.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to="/actualites"
              className="inline-flex items-center gap-2 text-sm font-semibold text-uwb-red"
            >
              Toutes les actualités <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {lead ? (
            <Reveal className="lg:col-span-7">
              <Link to={`/actualites/${lead.slug}`} className="group block">
                <div className="overflow-hidden">
                  <img
                    src={lead.coverImage}
                    alt=""
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
                  {newsCategoryLabels[lead.category]} ·{' '}
                  {formatDateFr(lead.publishedAt)}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-uwb-blue transition group-hover:text-uwb-red md:text-4xl">
                  {lead.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base text-uwb-muted">
                  {lead.excerpt}
                </p>
              </Link>
            </Reveal>
          ) : null}

          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((article, i) => (
              <Reveal key={article.id} delay={0.05 + i * 0.05}>
                <Link
                  to={`/actualites/${article.slug}`}
                  className="group grid grid-cols-[120px_1fr] gap-4 border-b border-black/10 pb-6"
                >
                  <img
                    src={article.coverImage}
                    alt=""
                    className="aspect-square h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-uwb-red uppercase">
                      {formatDateFr(article.publishedAt)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-uwb-blue group-hover:text-uwb-red">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="bg-uwb-navy p-6 text-white">
                <p className="text-[10px] tracking-[0.25em] text-white/60 uppercase">
                  Recherche
                </p>
                <ul className="mt-4 space-y-4">
                  {researchHighlights.map((item) => {
                    const content = (
                      <>
                        <span className="font-display text-xl font-semibold transition group-hover:text-uwb-gold-soft">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm text-white/65">
                          {item.summary}
                        </span>
                      </>
                    )
                    return (
                      <li key={item.id}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group block"
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            to={item.to ?? '/bibliotheque'}
                            className="group block"
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
