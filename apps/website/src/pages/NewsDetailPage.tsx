import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Copy, Share2 } from 'lucide-react'
import { Reveal } from '../components/motion/Reveal'
import { ProvisionalBadge } from '../components/ui/ProvisionalBadge'
import { Button } from '../components/ui/Button'
import {
  formatDateFr,
  getArticleBySlug,
  getRelatedArticles,
} from '../data/news'
import { newsCategoryLabels } from '../data/newsCategories'
import { NotFoundPage } from './NotFoundPage'

export function NewsDetailPage() {
  const { articleId } = useParams()
  const article = articleId ? getArticleBySlug(articleId) : undefined
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!article) return
    const previous = document.title
    document.title = `${article.title} · Actualités UWB`
    const meta = document.querySelector('meta[name="description"]')
    const previousDesc = meta?.getAttribute('content') ?? ''
    if (meta) meta.setAttribute('content', article.excerpt)
    return () => {
      document.title = previous
      if (meta) meta.setAttribute('content', previousDesc)
    }
  }, [article])

  if (!article) return <NotFoundPage />

  const related = getRelatedArticles(article)
  const hasFullContent = article.content.length > 0

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: article!.title,
          text: article!.excerpt,
          url,
        })
        return
      } catch {
        /* annulé ou indisponible → copie */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article>
      <section className="relative overflow-hidden bg-uwb-navy text-white">
        <img
          src={article.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/65 to-uwb-navy/35" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 sm:px-8 lg:py-28">
          <nav aria-label="Fil d’Ariane" className="text-sm text-white/65">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link to="/actualites" className="hover:text-white">
              Actualités
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Article</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-uwb-gold-soft uppercase">
              {newsCategoryLabels[article.category]}
            </span>
            <span className="text-white/40">·</span>
            <time dateTime={article.publishedAt} className="text-white/75">
              {formatDateFr(article.publishedAt)}
            </time>
            {article.updatedAt ? (
              <>
                <span className="text-white/40">·</span>
                <span className="text-white/60">
                  Mis à jour le {formatDateFr(article.updatedAt)}
                </span>
              </>
            ) : null}
            {!article.verified ? (
              <ProvisionalBadge className="bg-white/20 text-white" />
            ) : null}
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          {article.author ? (
            <p className="mt-5 text-sm text-white/70">{article.author}</p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
        <Reveal>
          <img
            src={article.coverImage}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
          <p className="mt-3 text-[11px] text-uwb-muted italic">
            {article.imageCredit}
          </p>
        </Reveal>

        {hasFullContent ? (
          <div className="mt-10 space-y-5 text-base leading-relaxed text-uwb-muted md:text-lg">
            {article.content.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-black/15 bg-uwb-surface p-6">
            <p className="text-sm leading-relaxed text-uwb-muted">
              {article.excerpt}
            </p>
            <p className="mt-4 text-sm text-uwb-muted">
              Le contenu complet n’est pas encore disponible sur ce site.
              Consultez la source officielle si le lien est fourni.
            </p>
          </div>
        )}

        {article.secondaryImages?.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {article.secondaryImages.map((img) => (
              <figure key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                {img.credit ? (
                  <figcaption className="mt-2 text-[11px] text-uwb-muted">
                    {img.credit}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        {article.attachments?.length ? (
          <div className="mt-10 border border-black/8 p-5">
            <h2 className="font-display text-xl font-semibold text-uwb-navy">
              Documents
            </h2>
            <ul className="mt-3 space-y-2">
              {article.attachments.map((file) => (
                <li key={file.url}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-uwb-red hover:underline"
                  >
                    {file.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {article.tags.length ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="border border-black/10 px-3 py-1 text-[11px] tracking-wide text-uwb-muted uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {article.sourceUrl ? (
          <p className="mt-10 text-sm text-uwb-muted">
            Source :{' '}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-uwb-red hover:underline"
            >
              Article officiel sur uwbcongo.org
            </a>
          </p>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-black/8 pt-8">
          <Button type="button" variant="ghost" className="rounded-none" onClick={share}>
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden /> Lien copié
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" aria-hidden /> Partager
              </>
            )}
          </Button>
          <Button to="/actualites" variant="ghost" className="rounded-none">
            ← Retour aux actualités
          </Button>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2000)
              } catch {
                /* ignore */
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-uwb-muted transition hover:text-uwb-red"
          >
            <Copy className="h-4 w-4" aria-hidden />
            Copier l’URL
          </button>
        </div>

        {related.length ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-uwb-navy md:text-3xl">
              Articles similaires
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/actualites/${item.slug}`}
                    className="group block border border-black/8 transition hover:border-uwb-red/30"
                  >
                    <img
                      src={item.coverImage}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <p className="text-[10px] font-semibold tracking-wide text-uwb-red uppercase">
                        {newsCategoryLabels[item.category]}
                      </p>
                      <p className="mt-2 font-display text-lg font-semibold leading-snug text-uwb-navy group-hover:text-uwb-red">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
