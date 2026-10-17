import { getPublishedArticles } from '../../data/news'
import { NewsCard } from '../NewsCard'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

export function NewsSection() {
  const articles = getPublishedArticles().slice(0, 3)

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Actualités"
              title="La vie de l’université"
              description="Articles repris de la page d’accueil officielle uwbcongo.org."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Button to="/actualites" variant="ghost">
              Toutes les actualités
            </Button>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.id} delay={index * 0.08}>
              <NewsCard article={article} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
