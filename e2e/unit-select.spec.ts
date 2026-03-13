import { test, expect } from '@playwright/test'

test.describe('unit dropdown', () => {
  test('ingredient unit field is a select element', async ({ page }) => {
    await page.goto('/#/recipe/new')
    const unitSelect = page.locator('.recipe-form__ingredient-row select').first()
    await expect(unitSelect).toBeVisible()
  })

  test('default unit is — for a new ingredient', async ({ page }) => {
    await page.goto('/#/recipe/new')
    const unitSelect = page.locator('.recipe-form__ingredient-row select').first()
    await expect(unitSelect).toHaveValue('—')
  })

  test('all expected units are available in the dropdown', async ({ page }) => {
    await page.goto('/#/recipe/new')
    const unitSelect = page.locator('.recipe-form__ingredient-row select').first()
    const options = await unitSelect.locator('option').allTextContents()
    for (const unit of ['—', 'tsp', 'tbsp', 'cup', 'ml', 'g', 'kg', 'oz', 'lb', 'pinch', 'slice', 'piece']) {
      expect(options).toContain(unit)
    }
  })

  test('can select a unit and it persists on the detail view', async ({ page }) => {
    await page.goto('/#/recipe/new')
    await page.locator('#rf-title').fill('Unit Test Recipe')
    const unitSelect = page.locator('.recipe-form__ingredient-row select').first()
    await unitSelect.selectOption('g')
    await page.locator('.recipe-form__ingredient-row input[aria-label="Ingredient 1 quantity"]').fill('200')
    await page.locator('.recipe-form__ingredient-row input[aria-label="Ingredient 1 name"]').fill('flour')
    await page.locator('button.btn-save').click()
    await expect(page.locator('.recipe-detail__ingredients')).toContainText('g')
  })

  test('unit select meets 44px tap target on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/recipe/new')
    const unitSelect = page.locator('.recipe-form__ingredient-row select').first()
    const h = await unitSelect.evaluate((el) => el.getBoundingClientRect().height)
    expect(h).toBeGreaterThanOrEqual(44)
  })

  test('no horizontal overflow with unit select at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/recipe/new')
    const overflow = await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth)
    expect(overflow).toBeTruthy()
  })

  test('legacy unit value (cups) displays gracefully in edit form', async ({ page }) => {
    // Seed recipe uses 'cup' — open edit form and verify unit select works
    await page.goto('/')
    await page.locator('.recipe-card').filter({ hasText: 'Bagel' }).click()
    await expect(page.locator('.recipe-detail__title')).toBeVisible()
    await page.locator('.btn-edit').click()
    await expect(page.locator('.recipe-form')).toBeVisible()
    const selects = page.locator('.recipe-form__ingredient-row select')
    await expect(selects.first()).toBeVisible()
    // First ingredient (warm water) should show 'cup'
    await expect(selects.first()).toHaveValue('cup')
  })
})
