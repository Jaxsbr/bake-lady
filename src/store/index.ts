import { nanoid } from 'nanoid'
import type { AppData, Recipe } from '../types/recipe'
import { SEED_DATA } from './seeds'

const STORAGE_KEY = 'bake-lady-data'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveData(SEED_DATA)
      return SEED_DATA
    }
    return JSON.parse(raw) as AppData
  } catch {
    return SEED_DATA
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addRecipe(draft: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
  const now = new Date().toISOString()
  const recipe: Recipe = { ...draft, id: nanoid(), createdAt: now, updatedAt: now }
  const data = loadData()
  saveData({ ...data, recipes: [...data.recipes, recipe] })
  return recipe
}

export function updateRecipe(
  id: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>,
): Recipe | null {
  const data = loadData()
  const idx = data.recipes.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const updated: Recipe = {
    ...data.recipes[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  const recipes = [...data.recipes]
  recipes[idx] = updated
  saveData({ ...data, recipes })
  return updated
}

export function deleteRecipe(id: string): void {
  const data = loadData()
  saveData({ ...data, recipes: data.recipes.filter((r) => r.id !== id) })
}

export function getRecipeById(id: string): Recipe | undefined {
  return loadData().recipes.find((r) => r.id === id)
}
