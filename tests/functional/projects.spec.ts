// tests/functional/projects.spec.ts
import { test, expect } from '@playwright/test'
import resumeData from '../../data/resume.json'

const firstSlug = resumeData.projects[0].slug // "healthtech-clinic-analytics"
const firstName = resumeData.projects[0].name
const firstTech = resumeData.projects[0].tech[0] // "Power BI"

test.describe('Project Detail Page', () => {
  test('known slug loads without error', async ({ page }) => {
    const response = await page.goto(`/projects/${firstSlug}`)
    expect(response?.status()).toBeLessThan(400)
  })

  test('project title is visible on detail page', async ({ page }) => {
    await page.goto(`/projects/${firstSlug}`)
    await expect(
      page.locator(`text=${firstName}`).first()
    ).toBeVisible()
  })

  test('tech tags are visible', async ({ page }) => {
    await page.goto(`/projects/${firstSlug}`)
    await expect(page.locator(`text=${firstTech}`).first()).toBeVisible()
  })

  test('back navigation returns to home', async ({ page }) => {
    await page.goto(`/projects/${firstSlug}`)
    const backLink = page.locator('a[href="/"], a[href="/#projects"]').first()
    await expect(backLink).toBeVisible()
    await backLink.click()
    await expect(page).toHaveURL(/\/$|\/#projects/)
  })

  test('unknown slug does not throw a JS error', async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', err => errors.push(err))
    await page.goto('/projects/does-not-exist')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })
})
