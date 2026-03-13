import { test, expect } from '@playwright/test'

test.describe('category filter', () => {
  test('filter bar renders All and all category buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.recipe-filter__btn').filter({ hasText: 'All' })).toBeVisible()
    await expect(page.locator('.recipe-filter__btn').filter({ hasText: 'bread' })).toBeVisible()
    await expect(page.locator('.recipe-filter__btn').filter({ hasText: 'cakes' })).toBeVisible()
  })

  test('All is active by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.recipe-filter__btn--active')).toContainText('All')
  })

  test('selecting a matching category shows only those recipes', async ({ page }) => {
    await page.goto('/')
    // Seed has sourdough bagels (bread) and choc chip cookies (cookies)
    await page.locator('.recipe-filter__btn').filter({ hasText: 'bread' }).click()
    await expect(page.locator('.recipe-card')).toHaveCount(1)
    await expect(page.locator('.recipe-card__title')).toContainText('Sourdough')
  })

  test('selecting a category with no recipes shows empty message', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-filter__btn').filter({ hasText: 'cakes' }).click()
    await expect(page.locator('.recipe-list__empty')).toBeVisible()
    await expect(page.locator('.recipe-list__empty')).toContainText('cakes')
  })

  test('clicking All after a filter restores full list', async ({ page }) => {
    await page.goto('/')
    const total = await page.locator('.recipe-card').count()
    await page.locator('.recipe-filter__btn').filter({ hasText: 'bread' }).click()
    await page.locator('.recipe-filter__btn').filter({ hasText: 'All' }).click()
    await expect(page.locator('.recipe-card')).toHaveCount(total)
  })

  test('filter works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.locator('.recipe-filter__btn').filter({ hasText: 'cookies' }).click()
    await expect(page.locator('.recipe-card')).toHaveCount(1)
    const overflow = await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth)
    expect(overflow).toBeTruthy()
  })
})

test.describe('search', () => {
  test('search input is visible on home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.recipe-search__input')).toBeVisible()
  })

  test('typing a title filters recipes', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-search__input').fill('bagel')
    await expect(page.locator('.recipe-card')).toHaveCount(1)
    await expect(page.locator('.recipe-card__title')).toContainText('Bagel')
  })

  test('search by ingredient name works', async ({ page }) => {
    await page.goto('/')
    // Sourdough bagels contain "sourdough discard" or "bread flour" etc
    await page.locator('.recipe-search__input').fill('bread flour')
    await expect(page.locator('.recipe-card')).toHaveCount(1)
  })

  test('no match shows empty message with query text', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-search__input').fill('zzznomatch')
    await expect(page.locator('.recipe-list__empty')).toContainText('zzznomatch')
  })

  test('clearing search restores full list', async ({ page }) => {
    await page.goto('/')
    const total = await page.locator('.recipe-card').count()
    await page.locator('.recipe-search__input').fill('bagel')
    await page.locator('.recipe-search__input').fill('')
    await expect(page.locator('.recipe-card')).toHaveCount(total)
  })

  test('search and category filter combine', async ({ page }) => {
    await page.goto('/')
    await page.locator('.recipe-filter__btn').filter({ hasText: 'bread' }).click()
    await page.locator('.recipe-search__input').fill('bagel')
    await expect(page.locator('.recipe-card')).toHaveCount(1)
    // Searching for something not in bread category returns empty
    await page.locator('.recipe-search__input').fill('cookie')
    await expect(page.locator('.recipe-list__empty')).toBeVisible()
  })
})
