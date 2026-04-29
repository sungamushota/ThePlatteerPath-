import { describe, it, expect } from 'vitest'

// Mirror the slug generator from onboarding
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

describe('Slug Generator', () => {
  it('generates clean slugs from business names', () => {
    expect(generateSlug('Heavenly Kitchen')).toBe('heavenly-kitchen')
    expect(generateSlug("Bob's BBQ!")).toBe('bobs-bbq')
    expect(generateSlug('My Catering Co.')).toBe('my-catering-co')
  })

  it('does not produce trailing dashes', () => {
    expect(generateSlug('Heavenly Kitchen ')).toBe('heavenly-kitchen')
    expect(generateSlug('Test  ')).toBe('test')
    expect(generateSlug(' - Test - ')).toBe('test')
  })

  it('does not produce leading dashes', () => {
    expect(generateSlug(' Hello World')).toBe('hello-world')
    expect(generateSlug('-start')).toBe('start')
  })

  it('collapses multiple dashes', () => {
    expect(generateSlug('A   B   C')).toBe('a-b-c')
    expect(generateSlug('test---name')).toBe('test-name')
  })

  it('handles special characters', () => {
    expect(generateSlug('André\'s Café & Catering')).toBe('andrs-caf-catering')
    expect(generateSlug('100% Organic Eats!')).toBe('100-organic-eats')
  })

  it('truncates long names to 50 chars', () => {
    const longName = 'A'.repeat(100)
    expect(generateSlug(longName).length).toBeLessThanOrEqual(50)
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
    expect(generateSlug('   ')).toBe('')
  })
})
