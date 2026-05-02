// tests/functional/home.spec.ts
import { test, expect } from '@playwright/test'

test('no unhandled JS errors on load', async ({ page }) => {
  const errors: Error[] = []
  page.on('pageerror', err => errors.push(err))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(errors).toHaveLength(0)
})

test.describe('Portfolio Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Page load ──────────────────────────────────────────────────────────────

  test('page title matches', async ({ page }) => {
    await expect(page).toHaveTitle('Tran Chi Hieu — BI Developer & Data Analyst')
  })

  test('no broken images', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const { complete, naturalWidth } = await images.nth(i).evaluate((el: HTMLImageElement) => ({
        complete: el.complete,
        naturalWidth: el.naturalWidth,
      }))
      // Only check images that have finished loading — lazy images off-screen are skipped
      if (complete) {
        expect(naturalWidth).toBeGreaterThan(0)
      }
    }
  })

  // ── Top nav ────────────────────────────────────────────────────────────────

  test('top nav is visible on load', async ({ page }) => {
    await expect(page.locator('nav.rounded-full')).toBeVisible()
  })

  test('top nav Portfolio link href is /', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Portfolio' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/')
  })

  test('top nav Saved Places link href is /places', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Saved Places' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/places')
  })

  // ── Section nav (right-side dots) ─────────────────────────────────────────

  test('section nav About button scrolls #about into viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'Navigate to About' }).click()
    await expect(page.locator('#about')).toBeInViewport()
  })

  test('section nav Projects button scrolls #projects into viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'Navigate to Projects' }).click()
    await expect(page.locator('#projects')).toBeInViewport()
  })

  // ── Hero ───────────────────────────────────────────────────────────────────

  test('hero heading "Tran Chi Hieu" is visible', async ({ page }) => {
    await expect(
      page.locator('text=Tran Chi Hieu').first()
    ).toBeVisible()
  })

  test('hero animated title is visible', async ({ page }) => {
    // AnimatedHero renders all titles as absolutely-positioned spans simultaneously,
    // cycling opacity between them. Verify the spans are in the DOM.
    const titles = page.locator('text=BI Developer')
      .or(page.locator('text=Data Analyst'))
      .or(page.locator('text=Analytic Engineer'))
    expect(await titles.count()).toBeGreaterThan(0)
  })

  test('hero LinkedIn link is present', async ({ page }) => {
    await expect(
      page.locator('a[href="https://www.linkedin.com/in/hieutc2308/"]').first()
    ).toBeVisible()
  })

  test('hero GitHub link is present', async ({ page }) => {
    await expect(
      page.locator('a[href="https://github.com/hieutc"]').first()
    ).toBeVisible()
  })

  test('mobile homepage has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })

  test('mobile section nav does not compete with hero content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByRole('button', { name: 'Navigate to About' })).toBeHidden()
    await expect(page.locator('h1').first()).toBeVisible()
  })

  // ── Skills ─────────────────────────────────────────────────────────────────

  test('skills section renders SVG orbital timeline', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded()
    await expect(
      page.locator('#skills svg, #skills canvas').first()
    ).toBeVisible({ timeout: 5000 })
  })

  // ── Projects ───────────────────────────────────────────────────────────────

  test('at least 3 project cards visible', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    const cards = page.locator('#projects a[href^="/projects/"]')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThanOrEqual(3)
  })

  test('clicking a project card navigates to its detail page', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    const card = page.locator('#projects a[href^="/projects/"]').first()
    await expect(card).toBeVisible()
    await expect(card).toBeInViewport()
    await Promise.all([
      page.waitForURL(/\/projects\//),
      card.click(),
    ])
    await expect(page.locator('h1').first()).toBeVisible()
  })

  // ── Footer ─────────────────────────────────────────────────────────────────

  test('footer has GitHub, LinkedIn, Gmail links', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.locator('footer a[aria-label="GitHub"]')).toBeVisible()
    await expect(page.locator('footer a[aria-label="LinkedIn"]')).toBeVisible()
    await expect(page.locator('footer a[aria-label="Gmail"]')).toBeVisible()
  })

  test('footer has /places link', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.locator('footer a[href="/places"]')).toBeVisible()
  })
})
