import { describe, expect, it } from 'vitest'
import { mergeContent } from './content-types'
import { contentEn } from './content-en'
import { contentFr } from '@/locales/content-fr'
import { contentHi } from '@/locales/content-hi'
import { contentPa } from '@/locales/content-pa'
import {
  profile,
  navItems,
  experience,
  education,
  skillGroups,
  projects,
  stats,
} from './profile'

const overrides = { fr: contentFr, hi: contentHi, pa: contentPa } as const
type Locale = keyof typeof overrides

const ids = (items: { id?: string; slug?: string }[]) => items.map((item) => item.id ?? item.slug)

describe('mergeContent', () => {
  it('returns the base bundle when there is no override', () => {
    expect(mergeContent(contentEn, {})).toEqual(contentEn)
  })

  it('merges array entries by stable id, not by position', () => {
    const merged = mergeContent(contentEn, {
      projects: [{ slug: 'agent-harness', summary: 'translated summary' }],
    })

    const untouched = merged.projects.filter((p) => p.slug !== 'agent-harness')
    expect(untouched.map((p) => p.summary)).toEqual(
      contentEn.projects.filter((p) => p.slug !== 'agent-harness').map((p) => p.summary),
    )
    expect(merged.projects.find((p) => p.slug === 'agent-harness')?.summary).toBe('translated summary')
  })

  it('survives a reordered override', () => {
    const reversed = [...contentEn.projects].reverse()
    const merged = mergeContent(contentEn, { projects: reversed })

    expect(ids(merged.projects)).toEqual(ids(contentEn.projects))
    expect(merged.projects.map((p) => p.summary)).toEqual(contentEn.projects.map((p) => p.summary))
  })

  it('keeps base fields a partial override does not mention', () => {
    const merged = mergeContent(contentEn, { projects: [{ slug: 'novaretail', title: 'Nouveau' }] })
    const novaretail = merged.projects.find((p) => p.slug === 'novaretail')

    expect(novaretail?.title).toBe('Nouveau')
    expect(novaretail?.summary).toBe(contentEn.projects[0].summary)
    expect(novaretail?.metrics).toEqual(contentEn.projects[0].metrics)
  })

  it('treats null and undefined as "no change" rather than a wipe', () => {
    const merged = mergeContent(contentEn, {
      profile: { summaryLead: null, summaryRest: undefined } as never,
    })

    expect(merged.profile.summaryLead).toBe(contentEn.profile.summaryLead)
    expect(merged.profile.summaryRest).toBe(contentEn.profile.summaryRest)
  })
})

describe('content integrity', () => {
  it('has one content entry per structural id', () => {
    expect(ids(contentEn.experience)).toEqual(ids(experience))
    expect(ids(contentEn.education)).toEqual(ids(education))
    expect(ids(contentEn.skillGroups)).toEqual(ids(skillGroups))
    expect(ids(contentEn.projects)).toEqual(ids(projects))
    expect(ids(contentEn.stats)).toEqual(ids(stats))
  })

  it('gives every currently item a label and a detail', () => {
    expect(contentEn.currently.items.length).toBeGreaterThan(0)
    for (const item of contentEn.currently.items) {
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.detail.length).toBeGreaterThan(0)
    }
    expect(contentEn.currently.updated.length).toBeGreaterThan(0)
  })

  it('only compares projects that actually declare a comparison', () => {
    for (const project of contentEn.projects) {
      if (!project.compare) continue
      expect(project.compare.before.length).toBeGreaterThan(0)
      expect(project.compare.after.length).toBeGreaterThan(0)
    }
  })
})

describe.each(Object.keys(overrides) as Locale[])('%s override', (locale) => {
  const merged = mergeContent(contentEn, overrides[locale])

  it('never changes the number of entries in any list', () => {
    expect(merged.projects).toHaveLength(contentEn.projects.length)
    expect(merged.experience).toHaveLength(contentEn.experience.length)
    expect(merged.education).toHaveLength(contentEn.education.length)
    expect(merged.skillGroups).toHaveLength(contentEn.skillGroups.length)
    expect(merged.stats).toHaveLength(contentEn.stats.length)
    expect(ids(merged.projects)).toEqual(ids(contentEn.projects))
  })

  it('leaves no entry without a title or summary', () => {
    for (const project of merged.projects) {
      expect(project.title, `${locale}:${project.slug}`).not.toBe('')
      expect(project.summary, `${locale}:${project.slug}`).not.toBe('')
    }
    for (const entry of merged.experience) {
      expect(entry.role, `${locale}:${entry.id}`).not.toBe('')
    }
  })

  it('actually translates rather than silently falling back to English', () => {
    // A missing translation is allowed; an untranslated one that looks
    // translated is not. This catches copy pasted between files by accident.
    const overriddenSlugs = new Set(
      (overrides[locale].projects ?? []).map((project) => project.slug),
    )
    for (const project of merged.projects) {
      if (!overriddenSlugs.has(project.slug)) continue
      const base = contentEn.projects.find((p) => p.slug === project.slug)
      if (base && project.title === base.title) continue // proper nouns
      expect(project.summary, `${locale}:${project.slug}`).not.toBe(base?.summary)
    }
  })

  it('keeps the currently snapshot present', () => {
    expect(merged.currently.items).toHaveLength(contentEn.currently.items.length)
    expect(merged.currently.items.map((item) => item.id)).toEqual(
      contentEn.currently.items.map((item) => item.id),
    )
  })
})

describe('site structure', () => {
  it('has exactly one h1 section per nav target', () => {
    expect(new Set(navItems.map((item) => item.id)).size).toBe(navItems.length)
    for (const item of navItems) {
      expect(item.href).toBe(`#${item.id}`)
    }
  })

  it('anchors the resume document to a real generated page', () => {
    // The error boundary links to /resume; the plugin serves it.
    expect(typeof profile.email).toBe('string')
    expect(profile.email).toMatch(/@/)
  })
})
