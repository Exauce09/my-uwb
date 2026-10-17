import { useEffect, useState } from 'react'
import { CampusMap } from '../components/contact/CampusMap'
import { ContactDepartments } from '../components/contact/ContactDepartments'
import { ContactFAQ } from '../components/contact/ContactFAQ'
import { ContactFinalCta } from '../components/contact/ContactFinalCta'
import { ContactForm } from '../components/contact/ContactForm'
import { ContactHero } from '../components/contact/ContactHero'
import { ContactInfo } from '../components/contact/ContactInfo'
import { ContactLinks } from '../components/contact/ContactLinks'

export function ContactPage() {
  const [formSubject, setFormSubject] = useState('')
  const [formService, setFormService] = useState('')

  useEffect(() => {
    const previous = document.title
    document.title = 'Contact et localisation · Université William Booth'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? null
    meta?.setAttribute(
      'content',
      'Coordonnées, localisation et contact de l’Université William Booth à Kinshasa — 12 Avenue Du Kasai, Gombe.',
    )
    return () => {
      document.title = previous
      if (meta && prevDesc !== null) meta.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div>
      <ContactHero />
      <ContactInfo />
      <CampusMap />
      <ContactDepartments
        onSelect={(subject, serviceId) => {
          setFormSubject(subject)
          setFormService(serviceId)
        }}
      />
      <ContactForm
        key={`${formSubject}-${formService}`}
        initialSubject={formSubject}
        initialService={formService}
      />
      <ContactFAQ />
      <ContactLinks />
      <ContactFinalCta />
    </div>
  )
}
