import { test, expect } from '@playwright/test'

test.describe('create recipe', () => {
  test('new recipe button navigates to new recipe form', async ({ page }) => {
    await page.goto('/')
    await page.locator('.btn-new-recipe').click()
    await expect(page).toHaveURL(/#\/recipe\/new/)
    await expect(page.locator('.recipe-form')).toBeVisible()
  })

  test('submitting a new recipe shows it in the detail view', async ({ page }) => {
    await page.goto('/#/recipe/new')
    await page.locator('#rf-title').fill('Test Lemon Cake')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.recipe-detail__title')).toContainText('Test Lemon Cake')
  })

  test('submitting empty title shows validation error', async ({ page }) => {
    await page.goto('/#/recipe/new')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.recipe-form__error')).toBeVisible()
    await expect(page.locator('.recipe-form')).toBeVisible()
  })

  test('new recipe persists after page reload', async ({ page }) => {
    await page.goto('/#/recipe/new')
    await page.locator('#rf-title').fill('Persist Test Bread')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.recipe-detail__title')).toContainText('Persist Test Bread')
    const url = page.url()
    await page.goto(url)
    await expect(page.locator('.recipe-detail__title')).toContainText('Persist Test Bread')
  })
})

test.describe('delete recipe', () => {
  test('delete button with confirmation removes recipe from list', async ({ page }) => {
    await page.goto('/')
    const titleText = await page.locator('.recipe-card__title').first().textContent()
    await page.locator('.recipe-card').first().click()
    page.once('dialog', (dialog) => dialog.accept())
    await page.locator('.btn-delete').click()
    await expect(page.locator('.recipe-list')).toBeVisible()
    await expect(page.locator('.recipe-card__title').filter({ hasText: titleText ?? '' })).toHaveCount(0)
  })

  test('cancelling delete confirmation keeps recipe', async ({ page }) => {
    await page.goto('/')
    const countBefore = await page.locator('.recipe-card').count()
    await page.locator('.recipe-card').first().click()
    page.once('dialog', (dialog) => dialog.dismiss())
    await page.locator('.btn-delete').click()
    await expect(page.locator('.recipe-detail')).toBeVisible()
    await page.locator('.btn-back').click()
    await expect(page.locator('.recipe-card')).toHaveCount(countBefore)
  })
})

test.describe('edit recipe', () => {
  test('edit form pre-fills existing recipe title', async ({ page }) => {
    await page.goto('/')
    const titleText = await page.locator('.recipe-card__title').first().textContent()
    await page.locator('.recipe-card').first().click()
    await page.locator('.btn-edit').click()
    await expect(page.locator('#rf-title')).toHaveValue(titleText ?? '')
  })

  test('saving edit updates the recipe title in detail view', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await page.locator('.btn-edit').click()
    await page.locator('#rf-title').fill('Updated Recipe Title')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.recipe-detail__title')).toContainText('Updated Recipe Title')
  })
})

test.describe('recipe detail view', () => {
  test('clicking a recipe card opens the detail view', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('.recipe-card').first()
    const titleText = await firstCard.locator('.recipe-card__title').textContent()
    await firstCard.click()
    await expect(page.locator('.recipe-detail')).toBeVisible()
    await expect(page.locator('.recipe-detail__title')).toContainText(titleText ?? '')
  })

  test('back button returns to recipe list', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await page.locator('.btn-back').click()
    await expect(page.locator('.recipe-list')).toBeVisible()
  })

  test('detail view shows ingredients and steps', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await expect(page.locator('.recipe-detail__ingredients')).toBeVisible()
    await expect(page.locator('.recipe-detail__steps')).toBeVisible()
  })

  test('detail view edit button navigates to edit hash', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await page.locator('.btn-edit').click()
    await expect(page).toHaveURL(/#\/recipe\/.+\/edit/)
  })

  test('detail view is usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await expect(page.locator('.recipe-detail__title')).toBeVisible()
    const overflow = await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth)
    expect(overflow).toBeTruthy()
  })
})
