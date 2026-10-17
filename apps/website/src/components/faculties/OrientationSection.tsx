import { faculties } from '../../data/faculties'
import { facultyCopy, orientationLabels } from '../../data/facultyCopy'
import type { OrientationCategoryId } from '../../types/faculty'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

const order: OrientationCategoryId[] = [
  'informatique-technologies',
  'economie-gestion',
  'communication',
  'droit',
  'sante',
  'theologie',
]

type Props = {
  onSelect: (facultyIds: string[]) => void
}

export function OrientationSection({ onSelect }: Props) {
  const categories = order
    .map((id) => ({
      id,
      label: orientationLabels[id],
      facultyIds: faculties
        .filter((f) => f.verified && f.orientationCategory === id)
        .map((f) => f.id),
    }))
    .filter((c) => c.facultyIds.length > 0)

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {facultyCopy.orientation.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {facultyCopy.orientation.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {facultyCopy.orientation.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => onSelect(cat.facultyIds)}
                className="group w-full border border-black/8 bg-uwb-surface px-6 py-7 text-left transition hover:border-uwb-red hover:bg-white"
              >
                <span className="font-display text-2xl font-semibold text-uwb-navy transition group-hover:text-uwb-red">
                  {cat.label}
                </span>
                <span className="mt-2 block text-xs text-uwb-muted">
                  {cat.facultyIds.length} entité
                  {cat.facultyIds.length > 1 ? 's' : ''} confirmée
                  {cat.facultyIds.length > 1 ? 's' : ''}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={() => {
                document
                  .getElementById('catalogue-formations')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {facultyCopy.orientation.all}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
