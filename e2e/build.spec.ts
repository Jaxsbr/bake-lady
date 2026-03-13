import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import path from 'path'

test.describe('built file:// output', () => {
  test.beforeAll(() => {
    execSync('npm run build', { stdio: 'pipe', cwd: path.resolve(process.cwd()) })
  })

  test('dist/index.html opens from file:// and shows recipe list', async ({ page }) => {
    const distFile = path.resolve(process.cwd(), 'dist', 'index.html')
    await page.goto(`file://${distFile}`)
    await expect(page.locator('h1')).toContainText('Bake Lady')
    await expect(page.locator('.recipe-list')).toBeVisible()
    await expect(page.locator('.recipe-card')).toHaveCount(2)
    await expect(page.getByText('Sourdough Discard Protein Bagels')).toBeVisible()
    await expect(page.getByText('Classic Chocolate Chip Cookies')).toBeVisible()
  })

  test('built file makes no external network requests', async ({ page }) => {
    const externalRequests: string[] = []
    page.on('request', (req) => {
      const url = req.url()
      if (!url.startsWith('file://') && !url.startsWith('data:')) {
        externalRequests.push(url)
      }
    })
    const distFile = path.resolve(process.cwd(), 'dist', 'index.html')
    await page.goto(`file://${distFile}`)
    await expect(page.locator('.recipe-list')).toBeVisible()
    expect(externalRequests).toHaveLength(0)
  })
})
