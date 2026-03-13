import { useState } from 'preact/hooks'
import { getRecipeById, addRecipe, updateRecipe } from '../store'
import { navigate } from '../lib/router'
import type { Category, Ingredient } from '../types/recipe'
import { UNITS } from '../types/recipe'

interface RecipeFormProps {
  id?: string
}

interface IngredientDraft {
  name: string
  quantity: string
  unit: string
}

const CATEGORIES: Category[] = ['bread', 'cakes', 'cookies', 'pastry', 'savoury', 'other']

function toIngredient(d: IngredientDraft): Ingredient {
  const qty = d.quantity.trim() === '' ? null : Number(d.quantity)
  return { name: d.name, quantity: isNaN(qty as number) ? null : qty, unit: d.unit }
}

export function RecipeForm({ id }: RecipeFormProps) {
  const existing = id ? getRecipeById(id) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [category, setCategory] = useState<Category>(existing?.category ?? 'other')
  const [prepTimeMin, setPrepTimeMin] = useState(existing?.prepTimeMin?.toString() ?? '')
  const [cookTimeMin, setCookTimeMin] = useState(existing?.cookTimeMin?.toString() ?? '')
  const [servings, setServings] = useState(existing?.servings?.toString() ?? '1')
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(
    existing?.ingredients.map((i) => ({ name: i.name, quantity: i.quantity?.toString() ?? '', unit: i.unit || '—' })) ??
      [{ name: '', quantity: '', unit: '—' }],
  )
  const [steps, setSteps] = useState<string[]>(existing?.steps ?? [''])
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [sourceUrl, setSourceUrl] = useState(existing?.sourceUrl ?? '')
  const [titleError, setTitleError] = useState(false)

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    setTitleError(false)

    const draft = {
      title: title.trim(),
      description: description.trim(),
      category,
      prepTimeMin: prepTimeMin.trim() === '' ? null : Number(prepTimeMin),
      cookTimeMin: cookTimeMin.trim() === '' ? null : Number(cookTimeMin),
      servings: Number(servings) || 1,
      ingredients: ingredients.filter((i) => i.name.trim()).map(toIngredient),
      steps: steps.filter((s) => s.trim()),
      notes: notes.trim(),
      sourceUrl: sourceUrl.trim(),
    }

    if (id) {
      updateRecipe(id, draft)
      navigate(`/recipe/${id}`)
    } else {
      const recipe = addRecipe(draft)
      navigate(`/recipe/${recipe.id}`)
    }
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }])
  }

  function removeIngredient(idx: number) {
    setIngredients(ingredients.filter((_, i) => i !== idx))
  }

  function updateIngredient(idx: number, field: keyof IngredientDraft, value: string) {
    const next = [...ingredients]
    next[idx] = { ...next[idx], [field]: value }
    setIngredients(next)
  }

  function addStep() {
    setSteps([...steps, ''])
  }

  function removeStep(idx: number) {
    setSteps(steps.filter((_, i) => i !== idx))
  }

  function updateStep(idx: number, value: string) {
    const next = [...steps]
    next[idx] = value
    setSteps(next)
  }

  const backTarget = id ? `/recipe/${id}` : '/'

  return (
    <form class="recipe-form" onSubmit={handleSubmit} noValidate>
      <nav class="recipe-detail__nav">
        <button type="button" class="btn-back" onClick={() => navigate(backTarget)}>← Back</button>
        <h2 class="recipe-form__heading">{id ? 'Edit recipe' : 'New recipe'}</h2>
      </nav>

      <div class="recipe-form__field">
        <label class="recipe-form__label" htmlFor="rf-title">Title *</label>
        <input
          id="rf-title"
          class={`recipe-form__input${titleError ? ' recipe-form__input--error' : ''}`}
          type="text"
          value={title}
          onInput={(e) => { setTitle((e.target as HTMLInputElement).value); setTitleError(false) }}
          placeholder="e.g. Sourdough Bagels"
        />
        {titleError && <p class="recipe-form__error">Title is required.</p>}
      </div>

      <div class="recipe-form__field">
        <label class="recipe-form__label" htmlFor="rf-description">Description</label>
        <textarea
          id="rf-description"
          class="recipe-form__input"
          value={description}
          onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
          rows={2}
          placeholder="A short description…"
        />
      </div>

      <div class="recipe-form__row">
        <div class="recipe-form__field">
          <label class="recipe-form__label" htmlFor="rf-category">Category</label>
          <select
            id="rf-category"
            class="recipe-form__input"
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value as Category)}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div class="recipe-form__field">
          <label class="recipe-form__label" htmlFor="rf-servings">Servings</label>
          <input
            id="rf-servings"
            class="recipe-form__input"
            type="number"
            min="1"
            value={servings}
            onInput={(e) => setServings((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div class="recipe-form__row">
        <div class="recipe-form__field">
          <label class="recipe-form__label" htmlFor="rf-prep">Prep time (min)</label>
          <input
            id="rf-prep"
            class="recipe-form__input"
            type="number"
            min="0"
            value={prepTimeMin}
            onInput={(e) => setPrepTimeMin((e.target as HTMLInputElement).value)}
            placeholder="—"
          />
        </div>
        <div class="recipe-form__field">
          <label class="recipe-form__label" htmlFor="rf-cook">Cook time (min)</label>
          <input
            id="rf-cook"
            class="recipe-form__input"
            type="number"
            min="0"
            value={cookTimeMin}
            onInput={(e) => setCookTimeMin((e.target as HTMLInputElement).value)}
            placeholder="—"
          />
        </div>
      </div>

      <fieldset class="recipe-form__fieldset">
        <legend class="recipe-form__legend">Ingredients</legend>
        {ingredients.map((ing, idx) => (
          <div key={idx} class="recipe-form__ingredient-row">
            <input
              class="recipe-form__input recipe-form__input--qty"
              type="text"
              placeholder="Qty"
              value={ing.quantity}
              onInput={(e) => updateIngredient(idx, 'quantity', (e.target as HTMLInputElement).value)}
              aria-label={`Ingredient ${idx + 1} quantity`}
            />
            <select
              class="recipe-form__input recipe-form__input--unit"
              value={ing.unit}
              onChange={(e) => updateIngredient(idx, 'unit', (e.target as HTMLSelectElement).value)}
              aria-label={`Ingredient ${idx + 1} unit`}
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              {!UNITS.includes(ing.unit as typeof UNITS[number]) && ing.unit && (
                <option value={ing.unit}>{ing.unit}</option>
              )}
            </select>
            <input
              class="recipe-form__input recipe-form__input--name"
              type="text"
              placeholder="Ingredient name"
              value={ing.name}
              onInput={(e) => updateIngredient(idx, 'name', (e.target as HTMLInputElement).value)}
              aria-label={`Ingredient ${idx + 1} name`}
            />
            <button
              type="button"
              class="btn-remove"
              onClick={() => removeIngredient(idx)}
              aria-label={`Remove ingredient ${idx + 1}`}
              disabled={ingredients.length === 1}
            >×</button>
          </div>
        ))}
        <button type="button" class="btn-add" onClick={addIngredient}>+ Add ingredient</button>
      </fieldset>

      <fieldset class="recipe-form__fieldset">
        <legend class="recipe-form__legend">Method</legend>
        {steps.map((step, idx) => (
          <div key={idx} class="recipe-form__step-row">
            <span class="recipe-form__step-num">{idx + 1}.</span>
            <textarea
              class="recipe-form__input"
              rows={2}
              value={step}
              onInput={(e) => updateStep(idx, (e.target as HTMLTextAreaElement).value)}
              placeholder={`Step ${idx + 1}…`}
              aria-label={`Step ${idx + 1}`}
            />
            <button
              type="button"
              class="btn-remove"
              onClick={() => removeStep(idx)}
              aria-label={`Remove step ${idx + 1}`}
              disabled={steps.length === 1}
            >×</button>
          </div>
        ))}
        <button type="button" class="btn-add" onClick={addStep}>+ Add step</button>
      </fieldset>

      <div class="recipe-form__field">
        <label class="recipe-form__label" htmlFor="rf-notes">Notes</label>
        <textarea
          id="rf-notes"
          class="recipe-form__input"
          value={notes}
          onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
          rows={3}
          placeholder="Tips, variations…"
        />
      </div>

      <div class="recipe-form__field">
        <label class="recipe-form__label" htmlFor="rf-source">Source URL</label>
        <input
          id="rf-source"
          class="recipe-form__input"
          type="url"
          value={sourceUrl}
          onInput={(e) => setSourceUrl((e.target as HTMLInputElement).value)}
          placeholder="https://…"
        />
      </div>

      <div class="recipe-form__actions">
        <button type="submit" class="btn-save">{id ? 'Save changes' : 'Add recipe'}</button>
      </div>
    </form>
  )
}
