/**
 * Formations dérivées des cursus publiés par faculté.
 * Aucun cycle Licence/Master inventé.
 */

import { faculties } from './faculties'
import type { Formation } from '../types/formation'

export type { Formation }

function slugify(title: string, facultyId: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base}-${facultyId}`
}

export const formations: Formation[] = faculties.flatMap((faculty) =>
  faculty.programs.map((program) => ({
    id: program.id,
    slug: slugify(program.title, faculty.id),
    title: program.title,
    facultyId: faculty.id,
    facultySlug: faculty.slug,
    facultyName: faculty.name,
    facultyShortName: faculty.shortName,
    kind: faculty.kind,
    cycleLabel: program.cycle,
    cycleVerified: program.verified,
    summary: program.summary,
    domains: faculty.domains ?? [],
    objectives: faculty.mission,
    verified: program.verified && faculty.verified,
    sourceUrl: faculty.sourceUrl,
    image: faculty.image,
    imageCredit: faculty.imageCredit,
    status: 'published' as const,
  })),
)

/** Formations du catalogue public : entités listées uniquement (D3). */
export function getPublishedFormations(): Formation[] {
  return formations
    .filter((f) => f.status === 'published')
    .filter((f) => {
      const faculty = faculties.find((x) => x.id === f.facultyId)
      return Boolean(faculty?.verified)
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'))
}

export function getFormationBySlug(slug: string): Formation | undefined {
  return getPublishedFormations().find(
    (f) => f.slug === slug || f.id === slug,
  )
}

export function getFormationsByFaculty(facultyId: string): Formation[] {
  return getPublishedFormations().filter((f) => f.facultyId === facultyId)
}
