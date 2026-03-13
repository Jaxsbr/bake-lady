import { test, expect } from '@playwright/test'

test.describe('aesthetics — tap targets', () => {
  test('all buttons on detail view are at least 44px tall', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    const buttons = page.locator('.recipe-detail button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const h = await buttons.nth(i).evaluate((el) => el.getBoundingClientRect().height)
      expect(h, `button ${i} on detail view`).toBeGreaterThanOrEqual(44)
    }
  })

  test('all buttons on new recipe form are at least 44px tall', async ({ page }) => {
    await page.goto('/#/recipe/new')
    const buttons = page.locator('.recipe-form button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const h = await buttons.nth(i).evaluate((el) => el.getBoundingClientRect().height)
      expect(h, `button ${i} on new form`).toBeGreaterThanOrEqual(44)
    }
  })

  test('all inputs on new recipe form are at least 44px tall', async ({ page }) => {
    await page.goto('/#/recipe/new')
    const inputs = page.locator('.recipe-form input, .recipe-form select, .recipe-form textarea')
    const count = await inputs.count()
    for (let i = 0; i < count; i++) {
      const h = await inputs.nth(i).evaluate((el) => el.getBoundingClientRect().height)
      expect(h, `input ${i} on new form`).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('aesthetics — layout overflow', () => {
  test('new recipe form has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/recipe/new')
    const overflow = await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth)
    expect(overflow).toBeTruthy()
  })

  test('edit recipe form has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.locator('.recipe-card').first().click()
    await page.locator('.btn-edit').click()
    const overflow = await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth)
    expect(overflow).toBeTruthy()
  })
})

test.describe('aesthetics — visual identity', () => {
  test('--color-warm CSS custom property is defined', async ({ page }) => {
    await page.goto('/')
    const val = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-warm').trim(),
    )
    expect(val).not.toBe('')
  })

  test('--font-heading CSS custom property is defined', async ({ page }) => {
    await page.goto('/')
    const val = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim(),
    )
    expect(val).not.toBe('')
  })

  test('headings use a serif font family', async ({ page }) => {
    await page.goto('/')
    const fontFamily = await page.locator('.app-header h1').evaluate(
      (el) => getComputedStyle(el).fontFamily,
    )
    expect(fontFamily.toLowerCase()).toMatch(/serif|georgia|times/i)
  })

  test('body background uses warm colour (not pure white)', async ({ page }) => {
    await page.goto('/')
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    // Should not be plain white rgb(255,255,255)
    expect(bg).not.toBe('rgb(255, 255, 255)')
  })
})
