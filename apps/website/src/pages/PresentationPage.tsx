import { useEffect } from 'react'
import { AboutCampusLife } from '../components/about/AboutCampusLife'
import { AboutCta } from '../components/about/AboutCta'
import { AboutFaculties } from '../components/about/AboutFaculties'
import { AboutGovernance } from '../components/about/AboutGovernance'
import { AboutHero } from '../components/about/AboutHero'
import { AboutIdentity } from '../components/about/AboutIdentity'
import { AboutPillars } from '../components/about/AboutPillars'
import { AboutResearch } from '../components/about/AboutResearch'
import { AboutStudents } from '../components/about/AboutStudents'
import { AboutValues } from '../components/about/AboutValues'
import { presentation } from '../data/presentation'

export function PresentationPage() {
  const { seo } = presentation.about

  useEffect(() => {
    const previous = document.title
    document.title = seo.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDesc = meta?.getAttribute('content') ?? ''
    if (meta) meta.setAttribute('content', seo.description)
    return () => {
      document.title = previous
      if (meta) meta.setAttribute('content', previousDesc)
    }
  }, [seo.description, seo.title])

  return (
    <div>
      <AboutHero />
      <AboutIdentity />
      <AboutPillars />
      <AboutValues />
      <AboutFaculties />
      <AboutCampusLife />
      <AboutResearch />
      <AboutStudents />
      <AboutGovernance />
      <AboutCta />
    </div>
  )
}
