import { describe, expect, it } from 'vitest'
import { renderResume } from './resume-page'
import { contentEn } from '../src/content/content-en'
import {
  profile,
  experience,
  education,
  skillGroups,
  projects as projectData,
} from '../src/content/profile'

const html = renderResume()

describe('resume document', () => {
  it('is a standalone document with no JavaScript and no external assets', () => {
    expect(html).not.toMatch(/<script/i)
    expect(html).not.toMatch(/<link[^>]+stylesheet/i)
    expect(html).not.toMatch(/<img/i)
    // Inline event handlers only. A bare /on\w+=/ would also match content="".
    expect(html).not.toMatch(
      /\son(?:click|error|load|submit|change|input|focus|blur|key\w+|mouse\w+|touch\w+|animation\w+|transition\w+)\s*=/i,
    )
    expect(html).not.toMatch(/javascript:/i)
  })

  it('declares a language and a single h1', () => {
    expect(html).toContain('<html lang="en">')
    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toContain(`<h1>${profile.name}</h1>`)
  })

  it('exposes contact details as real text, not just link labels', () => {
    expect(html).toContain(profile.email)
    expect(html).toContain(profile.phone)
    expect(html).toContain(contentEn.profile.location)
    expect(html).toMatch(/href="mailto:/)
  })

  it('has one section heading per resume block', () => {
    for (const heading of ['Summary', 'Experience', 'Projects', 'Skills', 'Education']) {
      expect(html, `missing ${heading}`).toContain(`<h2>${heading}</h2>`)
    }
  })

  it('includes every role, project and qualification', () => {
    for (const entry of experience) {
      expect(html, `missing role ${entry.company}`).toContain(entry.company)
      expect(html).toContain(entry.start)
    }
    for (const project of contentEn.projects) {
      expect(html, `missing project ${project.title}`).toContain(project.title)
    }
    for (const entry of education) {
      expect(html, `missing school ${entry.institution}`).toContain(entry.institution)
    }
  })

  it('lists every technology in every skill group', () => {
    for (const group of skillGroups) {
      for (const item of group.items) {
        expect(html, `missing technology ${item}`).toContain(item)
      }
    }
    const total = skillGroups.reduce((count, group) => count + group.items.length, 0)
    expect(html).toContain(`${total} technologies across ${skillGroups.length} categories`)
  })

  it('renders the open-ended current role as "Present"', () => {
    const ongoing = experience.find((entry) => entry.end === null)
    expect(ongoing).toBeDefined()
    expect(html).toContain('Present')
  })

  it('omits metrics that have no matching value rather than printing "undefined"', () => {
    expect(html).not.toMatch(/undefined/)
    expect(html).not.toMatch(/\[object Object\]/)
    for (const project of contentEn.projects) {
      for (const metric of project.metrics) {
        const hasValue = projectData
          .find((item) => item.slug === project.slug)
          ?.metrics.some((item) => item.id === metric.id)
        if (!hasValue) expect(html).not.toContain(`${metric.label}: `)
      }
    }
  })

  it('escapes angle brackets coming from content', () => {
    const hostile = renderResume().replace('<h1>', '<h1>&lt;script&gt;')
    expect(hostile).not.toMatch(/<script/i)
  })
})
