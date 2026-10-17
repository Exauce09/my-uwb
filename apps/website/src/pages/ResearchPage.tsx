import { ResearchSection } from '../components/home/ResearchSection'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../data/site'

export function ResearchPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recherche"
          title="Recherche, publications et innovation"
          description="Rubrique institutionnelle. Les dépôts détaillés et catalogues complets seront branchés progressivement."
        />
        <p className="mb-8 text-sm text-uwb-muted">
          Lien officiel publications :{' '}
          <a
            href={site.officialPublicationUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uwb-red hover:underline"
          >
            {site.officialPublicationUrl}
          </a>
        </p>
      </div>
      <ResearchSection />
    </div>
  )
}
