import { useState } from 'preact/hooks'
import { loadData } from '../store'
import { navigate } from '../lib/router'
import type { Category, Recipe } from '../types/recipe'

const CATEGORIES: Category[] = ['bread', 'cakes', 'cookies', 'pastry', 'savoury', 'other']

function totalTime(recipe: Recipe): string {
  const mins = (recipe.prepTimeMin ?? 0) + (recipe.cookTimeMin ?? 0)
  if (mins === 0) return '—'
  return `${mins} min`
}

function matchesQuery(recipe: Recipe, q: string): boolean {
  if (!q) return true
  const lower = q.toLowerCase()
  return (
    recipe.title.toLowerCase().includes(lower) ||
    recipe.ingredients.some((i) => i.name.toLowerCase().includes(lower)) ||
    recipe.notes.toLowerCase().includes(lower)
  )
}

export function RecipeList() {
  const [recipes] = useState(() => loadData().recipes)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')

  const afterCategory = activeCategory === 'all' ? recipes : recipes.filter((r) => r.category === activeCategory)
  const visible = afterCategory.filter((r) => matchesQuery(r, query))

  return (
    <div>
      <div class="recipe-list__toolbar">
        <button class="btn-new-recipe" onClick={() => navigate('/recipe/new')}>+ New recipe</button>
      </div>

      <div class="recipe-search">
        <input
          class="recipe-search__input"
          type="search"
          placeholder="Search recipes…"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          aria-label="Search recipes"
        />
      </div>

      <div class="recipe-filter" role="group" aria-label="Filter by category">
        <button
          class={`recipe-filter__btn${activeCategory === 'all' ? ' recipe-filter__btn--active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >All</button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            class={`recipe-filter__btn${activeCategory === cat ? ' recipe-filter__btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p class="recipe-list__empty">
          {recipes.length === 0
            ? 'No recipes yet. Add your first one!'
            : query
            ? `No recipes match "${query}".`
            : `No ${activeCategory} recipes yet.`}
        </p>
      ) : (
        <ul class="recipe-list" aria-label="Recipe list">
          {visible.map((recipe) => (
            <li
              key={recipe.id}
              class="recipe-card"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              role="button"
              aria-label={`View ${recipe.title}`}
            >
              <h2 class="recipe-card__title">{recipe.title}</h2>
              <span class="recipe-card__category">{recipe.category}</span>
              <span class="recipe-card__time">{totalTime(recipe)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
