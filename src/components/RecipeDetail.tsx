import { getRecipeById, deleteRecipe } from '../store'
import { navigate } from '../lib/router'
import type { Ingredient } from '../types/recipe'

interface RecipeDetailProps {
  id: string
}

function formatTime(prep: number | null, cook: number | null): string {
  const parts: string[] = []
  if (prep) parts.push(`Prep ${prep} min`)
  if (cook) parts.push(`Cook ${cook} min`)
  return parts.length ? parts.join(' · ') : '—'
}

function formatIngredient(ing: Ingredient): string {
  const qty = ing.quantity !== null ? `${ing.quantity}` : ''
  return [qty, ing.unit, ing.name].filter(Boolean).join(' ')
}

export function RecipeDetail({ id }: RecipeDetailProps) {
  const recipe = getRecipeById(id)

  if (!recipe) {
    return (
      <div class="recipe-detail">
        <button class="btn-back" onClick={() => navigate('/')}>← Back</button>
        <p class="recipe-detail__not-found">Recipe not found.</p>
      </div>
    )
  }

  return (
    <article class="recipe-detail">
      <nav class="recipe-detail__nav">
        <button class="btn-back" onClick={() => navigate('/')}>← Back</button>
        <div class="recipe-detail__actions">
          <button class="btn-edit" onClick={() => navigate(`/recipe/${id}/edit`)}>Edit</button>
          <button
            class="btn-delete"
            onClick={() => {
              if (window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
                deleteRecipe(id)
                navigate('/')
              }
            }}
          >Delete</button>
        </div>
      </nav>

      <header class="recipe-detail__header">
        <h2 class="recipe-detail__title">{recipe.title}</h2>
        <div class="recipe-detail__meta">
          <span class="recipe-card__category">{recipe.category}</span>
          <span class="recipe-detail__time">{formatTime(recipe.prepTimeMin, recipe.cookTimeMin)}</span>
          <span class="recipe-detail__servings">Serves {recipe.servings}</span>
        </div>
      </header>

      {recipe.description && (
        <p class="recipe-detail__description">{recipe.description}</p>
      )}

      {recipe.ingredients.length > 0 && (
        <section class="recipe-detail__section">
          <h3>Ingredients</h3>
          <ul class="recipe-detail__ingredients">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{formatIngredient(ing)}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps.length > 0 && (
        <section class="recipe-detail__section">
          <h3>Method</h3>
          <ol class="recipe-detail__steps">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {recipe.notes && (
        <section class="recipe-detail__section">
          <h3>Notes</h3>
          <p class="recipe-detail__notes">{recipe.notes}</p>
        </section>
      )}

      {recipe.sourceUrl && (
        <section class="recipe-detail__section">
          <h3>Source</h3>
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" class="recipe-detail__source">
            {recipe.sourceUrl}
          </a>
        </section>
      )}
    </article>
  )
}
