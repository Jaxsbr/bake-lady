import { describe, it, expect } from 'vitest'
import { parseHash } from './router'

describe('parseHash', () => {
  it('returns home for empty hash', () => {
    expect(parseHash('')).toEqual({ type: 'home' })
    expect(parseHash('#')).toEqual({ type: 'home' })
    expect(parseHash('#/')).toEqual({ type: 'home' })
  })

  it('returns detail for #/recipe/:id', () => {
    expect(parseHash('#/recipe/abc123')).toEqual({ type: 'detail', id: 'abc123' })
  })

  it('returns new for #/recipe/new', () => {
    expect(parseHash('#/recipe/new')).toEqual({ type: 'new' })
  })

  it('returns edit for #/recipe/:id/edit', () => {
    expect(parseHash('#/recipe/abc123/edit')).toEqual({ type: 'edit', id: 'abc123' })
  })

  it('returns home for unknown paths', () => {
    expect(parseHash('#/unknown')).toEqual({ type: 'home' })
  })

  it('edit takes priority over detail', () => {
    const result = parseHash('#/recipe/abc/edit')
    expect(result.type).toBe('edit')
  })
})
