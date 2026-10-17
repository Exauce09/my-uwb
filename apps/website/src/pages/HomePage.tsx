import { AdmissionsSection } from '../components/home/AdmissionsSection'
import { AnniversaryBanner } from '../components/home/AnniversaryBanner'
import { CampusLifeSection } from '../components/home/CampusLifeSection'
import { FacultiesSection } from '../components/home/FacultiesSection'
import { Hero } from '../components/home/Hero'
import { NewsAndResearchSection } from '../components/home/NewsAndResearchSection'
import { QuickAccessBar } from '../components/home/QuickAccessBar'
import { UniversityAboutSection } from '../components/home/UniversityAboutSection'
import { Reveal } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'

export function HomePage() {
  return (
    <>
      <Hero />
      <AnniversaryBanner />
      <QuickAccessBar />
      <UniversityAboutSection />
      <FacultiesSection />
      <CampusLifeSection />
      <NewsAndResearchSection />
      <AdmissionsSection />

      <section className="bg-uwb-surface py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-uwb-blue">
              Services numériques & SIGU-UWB
            </h2>
            <p className="mt-2 text-sm text-uwb-muted">
              Portails à venir — liens officiels déjà disponibles.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex gap-3">
              <Button to="/services-numeriques" className="rounded-none">
                Services
              </Button>
              <Button to="/sigu" variant="ghost" className="rounded-none">
                SIGU
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
