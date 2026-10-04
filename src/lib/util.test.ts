import { describe, expect, it } from 'vitest'
import { skillLevel } from './skill-level'
import { skillGroups } from '@/content/profile'
import { cn } from './cn'
import { fill } from './use-content'

describe('skillLevel', () => {
  it('is one level per two technologies', () => {
    expect(skillLevel(1)).toBe(1)
    expect(skillLevel(2)).toBe(1)
    expect(skillLevel(3)).toBe(2)
    expect(skillLevel(6)).toBe(3)
  })

  it('never drops below level 1', () => {
    expect(skillLevel(0)).toBe(1)
    expect(skillLevel(-4)).toBe(1)
  })

  it('stays within the 1..5 range the radar chart expects for real groups', () => {
    for (const group of skillGroups) {
      const level = skillLevel(group.items.length)
      expect(level).toBeGreaterThanOrEqual(1)
      expect(level).toBeLessThanOrEqual(5)
    }
  })
})

describe('cn', () => {
  it('joins truthy class names and drops every falsy value', () => {
    expect(cn('a', false, undefined, null, 0, '', Number.NaN, 'c')).toBe('a c')
  })

  it('flattens nested arrays', () => {
    expect(cn(['a', ['b', false, null]], 'd')).toBe('a b d')
  })

  it('keeps both classes when they conflict, so source order decides', () => {
    // Deliberately not tailwind-merge: conflicting utilities are left for the
    // stylesheet to resolve, and this documents that contract.
    expect(cn('p-2', 'p-4')).toBe('p-2 p-4')
  })
})

describe('fill', () => {
  it('substitutes known tokens', () => {
    expect(fill('{a} of {b}', { a: 1, b: 2 })).toBe('1 of 2')
  })

  it('leaves unknown tokens visible instead of blanking them', () => {
    expect(fill('{a} {missing}', { a: 'x' })).toBe('x {missing}')
  })
})
