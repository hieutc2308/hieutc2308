// tests/visual/home.visual.spec.ts
import { test, expect } from '../fixtures/base'

test.describe('Home — Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('hero section', async ({ page, waitForAnimations }) => {
    await waitForAnimations()
    await expect(page).toHaveScreenshot('hero.png', {
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    })
  })

  test('about section', async ({ page, waitForAnimations }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()
    await waitForAnimations()
    await expect(page.locator('#about')).toHaveScreenshot('about.png')
  })

  test('skills section', async ({ page, waitForAnimations }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200) // extra time for SSR-disabled dynamic import
    await waitForAnimations()
    await expect(page.locator('#skills')).toHaveScreenshot('skills.png')
  })

  test('projects section', async ({ page, waitForAnimations }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await waitForAnimations()
    await expect(page.locator('#projects')).toHaveScreenshot('projects.png')
  })

  test('certifications section', async ({ page, waitForAnimations }) => {
    await page.locator('#certifications').scrollIntoViewIfNeeded()
    await waitForAnimations()
    await expect(
      page.locator('#certifications')
    ).toHaveScreenshot('certifications.png')
  })

  test('full page — mobile viewport', async ({ page, waitForAnimations }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await waitForAnimations()
    await expect(page).toHaveScreenshot('full-mobile.png', { fullPage: true })
  })

  test('full page — tablet viewport', async ({ page, waitForAnimations }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await waitForAnimations()
    await expect(page).toHaveScreenshot('full-tablet.png', { fullPage: true })
  })
})
