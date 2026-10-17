import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { admissionsCopy } from '../../data/admissions'
import { site } from '../../data/site'
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

export function AdmissionsContactForm() {
  const { contact } = admissionsCopy
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [demoAck, setDemoAck] = useState(false)

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Indiquez votre nom complet.'
    if (!EMAIL_RE.test(email.trim())) {
      next.email = 'Indiquez une adresse électronique valide.'
    }
    if (!subject) next.subject = 'Choisissez l’objet de votre demande.'
    if (message.trim().length < 20) {
      next.message = 'Votre message doit contenir au moins 20 caractères.'
    }
    if (!consent) {
      next.consent =
        'Le consentement au traitement des données est requis pour cette demande.'
    }
    return next
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setDemoAck(false)
      return
    }
    // Aucun envoi réseau — formulaire de démonstration.
    setDemoAck(true)
  }

  return (
    <section
      id="contact-admissions"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
                  {contact.kicker}
                </p>
                <ProvisionalBadge />
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                {contact.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
                {contact.intro}
              </p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-uwb-red uppercase">
                {contact.demoBadge}
              </p>
            </Reveal>

            <form
              onSubmit={onSubmit}
              className="mt-8 space-y-5"
              noValidate
              aria-describedby={demoAck ? 'admissions-contact-demo' : undefined}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="adm-contact-name">
                    Nom complet *
                  </label>
                  <input
                    id="adm-contact-name"
                    name="name"
                    autoComplete="name"
                    className={fieldClass}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setDemoAck(false)
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? 'adm-contact-name-err' : undefined
                    }
                  />
                  {errors.name ? (
                    <p
                      id="adm-contact-name-err"
                      className="mt-1.5 text-sm text-uwb-red"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="adm-contact-email">
                    Adresse électronique *
                  </label>
                  <input
                    id="adm-contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    className={fieldClass}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setDemoAck(false)
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? 'adm-contact-email-err' : undefined
                    }
                  />
                  {errors.email ? (
                    <p
                      id="adm-contact-email-err"
                      className="mt-1.5 text-sm text-uwb-red"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="adm-contact-phone">
                    Téléphone (facultatif)
                  </label>
                  <input
                    id="adm-contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className={fieldClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="adm-contact-subject">
                    Objet de la demande *
                  </label>
                  <select
                    id="adm-contact-subject"
                    className={fieldClass}
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      setDemoAck(false)
                    }}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? 'adm-contact-subject-err' : undefined
                    }
                  >
                    <option value="">Sélectionnez</option>
                    {contact.subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.subject ? (
                    <p
                      id="adm-contact-subject-err"
                      className="mt-1.5 text-sm text-uwb-red"
                      role="alert"
                    >
                      {errors.subject}
                    </p>
                  ) : null}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="adm-contact-message">
                    Message *
                  </label>
                  <textarea
                    id="adm-contact-message"
                    rows={5}
                    className={fieldClass}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setDemoAck(false)
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'adm-contact-message-err' : undefined
                    }
                  />
                  {errors.message ? (
                    <p
                      id="adm-contact-message-err"
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
                    setDemoAck(false)
                  }}
                  aria-invalid={Boolean(errors.consent)}
                />
                <span>
                  J’accepte que l’Université William Booth traite ces
                  informations pour répondre à ma demande d’information sur les
                  admissions. *
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
                Valider la demande (démonstration)
              </button>

              {demoAck ? (
                <p
                  id="admissions-contact-demo"
                  className="border border-uwb-red/20 bg-uwb-red/[0.04] p-4 text-sm leading-relaxed text-uwb-navy"
                  role="status"
                >
                  Formulaire validé côté navigateur uniquement. Aucun message
                  n’a été envoyé à l’université. Utilisez les coordonnées
                  ci-contre ou la page Contact pour écrire réellement à l’UWB.
                </p>
              ) : null}
            </form>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="border border-black/8 bg-uwb-surface p-6">
                <h3 className="font-display text-xl font-semibold text-uwb-navy">
                  Coordonnées vérifiées
                </h3>
                <ul className="mt-5 space-y-4 text-sm text-uwb-navy">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-uwb-red" />
                    <span>{site.contact.address.value}</span>
                  </li>
                  {site.contact.phones.map((p) => (
                    <li key={p.value} className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-uwb-red" />
                      <a
                        href={`tel:${p.value.replace(/\s/g, '')}`}
                        className="outline-none hover:text-uwb-red focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                      >
                        {p.value}
                      </a>
                    </li>
                  ))}
                  {site.contact.emails.map((e) => (
                    <li key={e.value} className="flex gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-uwb-red" />
                      <a
                        href={`mailto:${e.value}`}
                        className="outline-none hover:text-uwb-red focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                      >
                        {e.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}
