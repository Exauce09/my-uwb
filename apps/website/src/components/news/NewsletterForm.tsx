import { useState, type FormEvent } from 'react'
import { newsCopy } from '../../data/newsCategories'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Prêt pour branchement backend SIGU — aucun envoi réel pour l’instant. */
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { newsletter } = newsCopy

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setError(newsletter.invalid)
      setSubmitted(false)
      return
    }
    setError('')
    // Aucun envoi ni enregistrement — rappel uniquement (pas d’inscription simulée).
    setSubmitted(true)
  }

  return (
    <section className="bg-uwb-navy py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-gold-soft uppercase">
                {newsletter.kicker}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
                {newsletter.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
                {newsletter.intro}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3" noValidate>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="news-newsletter-email">
                  Adresse électronique
                </label>
                <input
                  id="news-newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setSubmitted(false)
                    setError('')
                  }}
                  placeholder={newsletter.placeholder}
                  className="w-full border border-white/25 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-uwb-red focus:ring-2 focus:ring-uwb-red/30"
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error
                      ? 'news-newsletter-error'
                      : submitted
                        ? 'news-newsletter-status'
                        : undefined
                  }
                />
                <Button type="submit" className="rounded-none sm:shrink-0">
                  {newsletter.submit}
                </Button>
              </div>
              {error ? (
                <p
                  id="news-newsletter-error"
                  className="text-sm text-uwb-gold-soft"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              {submitted ? (
                <p
                  id="news-newsletter-status"
                  className="text-sm text-white/70"
                  role="status"
                >
                  {newsletter.inactive}
                </p>
              ) : (
                <p className="text-xs text-white/45">{newsletter.inactive}</p>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
