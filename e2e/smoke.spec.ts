import { test, expect } from '@playwright/test'

test('app loads and shows Bake Lady heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Bake Lady')
})

test('no console errors on load', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('recipe list renders seeded recipes', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.recipe-list')).toBeVisible()
  await expect(page.locator('.recipe-card')).toHaveCount(2)
  await expect(page.getByText('Sourdough Discard Protein Bagels')).toBeVisible()
  await expect(page.getByText('Classic Chocolate Chip Cookies')).toBeVisible()
})

test('recipe cards show category and time', async ({ page }) => {
  await page.goto('/')
  const firstCard = page.locator('.recipe-card').first()
  await expect(firstCard.locator('.recipe-card__category')).toBeVisible()
  await expect(firstCard.locator('.recipe-card__time')).toBeVisible()
  // Sourdough bagels: 30 + 25 = 55 min
  await expect(page.locator('.recipe-card__time').first()).toContainText('55 min')
})

test('recipe list renders on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('.recipe-list')).toBeVisible()
  await expect(page.locator('.recipe-card')).toHaveCount(2)
})

test('body font-size is at least 16px', async ({ page }) => {
  await page.goto('/')
  const fontSize = await page.evaluate(() => {
    const style = window.getComputedStyle(document.body)
    return parseFloat(style.fontSize)
  })
  expect(fontSize).toBeGreaterThanOrEqual(16)
})

test('no horizontal overflow on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const overflows = await page.evaluate(() => {
    return document.body.scrollWidth <= window.innerWidth
  })
  expect(overflows).toBe(true)
})
