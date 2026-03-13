import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, saveData, addRecipe, updateRecipe, deleteRecipe, getRecipeById } from './index'
import { SEED_DATA } from './seeds'

describe('store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds localStorage with sample recipes on first load', () => {
    const data = loadData()
    expect(data.version).toBe(1)
    expect(data.recipes).toHaveLength(2)
    expect(data.recipes[0].id).toBe('sample-sourdough-bagels')
    expect(data.recipes[1].id).toBe('sample-choc-chip-cookies')
  })

  it('writes seeds to localStorage on first load', () => {
    loadData()
    expect(localStorage.getItem('bake-lady-data')).not.toBeNull()
  })

  it('persists and retrieves data', () => {
    const testData = { version: 1, recipes: [] }
    saveData(testData)
    const loaded = loadData()
    expect(loaded).toEqual(testData)
  })

  it('returns seed data on corrupt localStorage', () => {
    localStorage.setItem('bake-lady-data', 'not-json{{{')
    const data = loadData()
    expect(data).toBe(SEED_DATA)
  })

  describe('addRecipe', () => {
    it('returns a recipe with a generated id and timestamps', () => {
      const recipe = addRecipe({
        title: 'Test Cake',
        description: 'A test',
        category: 'cakes',
        prepTimeMin: 10,
        cookTimeMin: 30,
        servings: 8,
        ingredients: [],
        steps: [],
        sourceUrl: '',
        notes: '',
      })
      expect(recipe.id).toBeTruthy()
      expect(recipe.title).toBe('Test Cake')
      expect(recipe.createdAt).toBeTruthy()
      expect(recipe.updatedAt).toBe(recipe.createdAt)
    })

    it('persists new recipe to localStorage (seeds + 1)', () => {
      addRecipe({
        title: 'New',
        description: '',
        category: 'other',
        prepTimeMin: null,
        cookTimeMin: null,
        servings: 1,
        ingredients: [],
        steps: [],
        sourceUrl: '',
        notes: '',
      })
      expect(loadData().recipes).toHaveLength(3)
    })
  })

  describe('updateRecipe', () => {
    it('updates a field and sets updatedAt', () => {
      const id = SEED_DATA.recipes[0].id
      loadData() // initialize seeds in localStorage
      const updated = updateRecipe(id, { title: 'New Title' })
      expect(updated?.title).toBe('New Title')
      expect(updated?.id).toBe(id)
      // updatedAt is a fresh ISO timestamp, not the seed's fixed date
      expect(updated?.updatedAt).not.toBe(SEED_DATA.recipes[0].createdAt)
    })

    it('returns null for unknown id', () => {
      expect(updateRecipe('nonexistent', { title: 'x' })).toBeNull()
    })
  })

  describe('deleteRecipe', () => {
    it('removes the recipe by id', () => {
      const id = SEED_DATA.recipes[0].id
      loadData() // initialize seeds
      deleteRecipe(id)
      expect(getRecipeById(id)).toBeUndefined()
      expect(loadData().recipes).toHaveLength(1)
    })
  })

  describe('getRecipeById', () => {
    it('returns the recipe for a known id', () => {
      const id = SEED_DATA.recipes[0].id
      loadData() // initialize seeds
      expect(getRecipeById(id)?.id).toBe(id)
    })

    it('returns undefined for an unknown id', () => {
      expect(getRecipeById('nonexistent')).toBeUndefined()
    })
  })
})
