export type Category = 'bread' | 'cakes' | 'cookies' | 'pastry' | 'savoury' | 'other'

export const UNITS = ['—', 'tsp', 'tbsp', 'cup', 'ml', 'l', 'g', 'kg', 'oz', 'lb', 'fl oz', 'pinch', 'slice', 'piece'] as const
export type Unit = (typeof UNITS)[number]

export interface Ingredient {
  name: string
  quantity: number | null
  unit: string  // string for graceful fallback with legacy data
}

export interface Recipe {
  id: string
  title: string
  description: string
  category: Category
  prepTimeMin: number | null
  cookTimeMin: number | null
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  sourceUrl: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface AppData {
  version: number
  recipes: Recipe[]
}
