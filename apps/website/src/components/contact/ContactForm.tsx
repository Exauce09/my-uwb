import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  contactCopy,
  contactDefaultEmail,
} from '../../data/contact'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldClass =
  'w-full border border-black/10 bg-white px-4 py-3 text-sm text-uwb-navy outline-none transition focus:border-uwb-red focus:ring-2 focus:ring-uwb-red/25'
const labelClass =
  'mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-uwb-muted uppercase'

type Errors = Partial<
  Record<'name' | 'email' | 'subject' | 'message' | 'consent', string>
>

type Props = {
  /** Prefill subject from department cards */
  initialSubject?: string
  initialService?: string
}

export function ContactForm({ initialSubject = '', initialService = '' }: Props) {
  const { form } = contactCopy
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(initialSubject)
  const [service, setService] = useState(initialService)
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [readyMailto, setReadyMailto] = useState(false)

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject)
    if (initialService) setService(initialService)
  }, [initialSubject, initialService])

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Indiquez votre nom complet.'
    if (!EMAIL_RE.test(email.trim())) {
      next.email = 'Indiquez une adresse électronique valide.'
    }
    if (!subject) next.subject = 'Choisissez le sujet de votre demande.'
    if (message.trim().length < form.minMessage) {
      next.message = `Le message doit contenir au moins ${form.minMessage} caractères.`
    }
    if (message.trim().length > form.maxMessage) {
      next.message = `Le message ne peut pas dépasser ${form.maxMessage} caractères.`
    }
    if (!consent) {
      next.consent =
        'Le consentement à la transmission des informations est requis.'
    }
    return next
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setReadyMailto(false)
      return
    }
    // Pas d’envoi réseau — formulaire en préparation.
    setReadyMailto(true)
  }

  const mailtoHref = useMemo(() => {
    const serviceLabel =
      form.services.find((s) => s.value === service)?.label ?? 'Non précisé'
    const body = [
      `Nom : ${name.trim()}`,
      `E-mail : ${email.trim()}`,
      phone.trim() ? `Téléphone : ${phone.trim()}` : null,
      `Sujet : ${subject}`,
      `Orientation : ${serviceLabel}`,
      '',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n')

    return `mailto:${contactDefaultEmail}?subject=${encodeURIComponent(
      `[Contact UWB] ${subject}`,
    )}&body=${encodeURIComponent(body)}`
  }, [name, email, phone, subject, service, message, form.services])

  const remaining = form.maxMessage - message.length

  return (
    <section
      id="formulaire-contact"
      className="scroll-mt-28 border-y border-black/5 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {form.kicker}
            </p>
            <ProvisionalBadge />
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {form.title}
          </h2>
          <p className="mt-3 text-sm text-uwb-muted md:text-base">{form.intro}</p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-uwb-red uppercase">
            {form.preparationBadge}
          </p>
          <p className="mt-2 text-sm text-uwb-muted">{form.preparationNote}</p>
        </Reveal>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 border border-black/8 bg-white p-5 sm:p-8"
          noValidate
          aria-describedby={readyMailto ? 'contact-form-prep' : undefined}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="contact-name">
                Nom complet *
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                className={fieldClass}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setReadyMailto(false)
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-err' : undefined}
              />
              {errors.name ? (
                <p id="contact-name-err" className="mt-1.5 text-sm text-uwb-red" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-email">
                Adresse électronique *
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                className={fieldClass}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setReadyMailto(false)
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-err' : undefined}
              />
              {errors.email ? (
                <p id="contact-email-err" className="mt-1.5 text-sm text-uwb-red" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-phone">
                Téléphone (facultatif)
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                className={fieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-subject">
                Sujet de la demande *
              </label>
              <select
                id="contact-subject"
                className={fieldClass}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setReadyMailto(false)
                }}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? 'contact-subject-err' : undefined
                }
              >
                <option value="">Sélectionnez</option>
                {form.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject ? (
                <p
                  id="contact-subject-err"
                  className="mt-1.5 text-sm text-uwb-red"
                  role="alert"
                >
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-service">
                Orientation de la demande
              </label>
              <select
                id="contact-service"
                className={fieldClass}
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {form.services.map((s) => (
                  <option key={s.value || 'none'} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-uwb-muted">
                Catégorie indicative — non présentée comme service officiel
                constitué.
              </p>
            </div>

            <div className="sm:col-span-2">
              <div className="mb-1.5 flex items-end justify-between gap-3">
                <label className={labelClass + ' mb-0'} htmlFor="contact-message">
                  Message *
                </label>
                <span
                  className={`text-xs ${
                    remaining < 0 ? 'text-uwb-red' : 'text-uwb-muted'
                  }`}
                  aria-live="polite"
                >
                  {message.length} / {form.maxMessage}
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={6}
                className={fieldClass}
                value={message}
                maxLength={form.maxMessage + 50}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setReadyMailto(false)
                }}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'contact-message-err' : undefined
                }
              />
              {errors.message ? (
                <p
                  id="contact-message-err"
                  className="mt-1.5 text-sm text-uwb-red"
                  role="alert"
                >
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-uwb-navy">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-uwb-red"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                setReadyMailto(false)
              }}
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              J’accepte que l’Université William Booth utilise ces informations
              pour répondre à ma demande. Aucune transmission automatique n’a
              lieu sur cette page tant que le backend n’est pas branché. *
            </span>
          </label>
          {errors.consent ? (
            <p className="text-sm text-uwb-red" role="alert">
              {errors.consent}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex bg-uwb-red px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-uwb-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uwb-red/40"
          >
            Valider et préparer le courriel
          </button>

          {readyMailto ? (
            <div
              id="contact-form-prep"
              className="space-y-3 border border-uwb-red/20 bg-uwb-red/[0.04] p-4"
              role="status"
            >
              <p className="text-sm leading-relaxed text-uwb-navy">
                Formulaire validé. Aucun envoi automatique n’a été effectué.
                Ouvrez votre messagerie pour adresser le message à{' '}
                <strong>{contactDefaultEmail}</strong> (adresse vérifiée).
              </p>
              <a
                href={mailtoHref}
                className="inline-flex bg-uwb-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-uwb-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uwb-red/40"
              >
                Ouvrir mon client de messagerie
              </a>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  )
}
