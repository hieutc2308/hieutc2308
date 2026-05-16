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

  test('hero content is visible without client animations', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto(process.env.BASE_URL ?? 'http://localhost:3000')
    const hero = page.locator('main > section').first()

    await expect(hero.getByText('Hanoi, Vietnam')).toBeVisible()
    await expect(hero.getByRole('heading', { name: /Tran Chi Hieu/ })).toBeVisible()
    await expect(hero.getByRole('button', { name: 'See My Work' })).toBeVisible()

    await context.close()
  })

  test('hero animated title is visible', async ({ page }) => {
    // AnimatedHero renders all titles as absolutely-positioned spans simultaneously,
    // cycling opacity between them. Verify the spans are in the DOM.
    const titles = page.locator('text=BI Developer')
      .or(page.locator('text=Data Analyst'))
      .or(page.locator('text=Analytic Engineer'))
    expect(await titles.count()).toBeGreaterThan(0)
  })

  test('long hero role title fits within the hero viewport', async ({ page }) => {
    await page.setViewportSize({ width: 714, height: 456 })
    await page.goto('/')

    const role = page.getByText('Analytic Engineer', { exact: true })
    const box = await role.boundingBox()
    const fontSize = await role.evaluate((element) => {
      return Number.parseFloat(window.getComputedStyle(element).fontSize)
    })
    expect(box).not.toBeNull()
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(714)
    expect(fontSize).toBeLessThanOrEqual(48)
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

  test('hero primary CTA uses restrained button styling', async ({ page }) => {
    const cta = page.getByRole('button', { name: 'See My Work' })
    await expect(cta).toBeVisible()
    await expect(cta).not.toHaveClass(/border-glow-btn/)
  })

  test('hero does not duplicate portfolio metrics', async ({ page }) => {
    const hero = page.locator('main > section').first()
    await expect(hero.getByText('Years', { exact: true })).toHaveCount(0)
    await expect(hero.getByText('Projects', { exact: true })).toHaveCount(0)
    await expect(hero.getByText('Certs', { exact: true })).toHaveCount(0)
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

  // ── About ──────────────────────────────────────────────────────────────────

  test('about metrics are all visible at once', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()
    const metrics = page.locator('#about [data-testid="about-metric-card"]')
    await expect(metrics).toHaveCount(4)

    for (let i = 0; i < 4; i++) {
      await expect(metrics.nth(i)).toBeVisible()
    }
  })

  test('about paragraphs use justified alignment', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()

    const alignment = await page.locator('#about p').first().evaluate((element) => {
      return window.getComputedStyle(element).textAlign
    })

    expect(alignment).toBe('justify')
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

  test('project detail page shows the case study template', async ({ page }) => {
    await page.goto('/projects/healthtech-clinic-analytics')
    await expect(page.getByRole('heading', { name: 'HealthTech Platform (Clinic Analytics)' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Project Overview' })).toBeVisible()
    await expect(page.getByText('Documents')).toBeVisible()
    await expect(page.getByText('portfolio-projects/healthtech-clinic-analytics')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible()
  })

  test('browser back restores visible projects section after project navigation', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    const card = page.locator('#projects a[href^="/projects/"]').first()
    await expect(card).toBeVisible()
    await Promise.all([
      page.waitForURL(/\/projects\//),
      card.click(),
    ])

    await page.goBack()
    await expect(page).toHaveURL('/')
    await expect(page.locator('#projects h2')).toBeVisible()
    await expect(card).toBeVisible()
    await expect
      .poll(async () => Number(await card.evaluate((element) => window.getComputedStyle(element).opacity)))
      .toBeGreaterThan(0.5)
  })

  test('browser back restores visible reveal sections after leaving the page', async ({ page }) => {
    const sections = [
      { id: 'about', target: page.locator('#about h2') },
      { id: 'experience', target: page.locator('#experience article').first() },
      { id: 'skills', target: page.locator('#skills h2') },
      { id: 'projects', target: page.locator('#projects a[href^="/projects/"]').first() },
      { id: 'certifications', target: page.locator('#certifications h2') },
      { id: 'contact', target: page.locator('#contact form') },
    ]

    for (const { id, target } of sections) {
      await page.goto('/')
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.evaluate(() => {
        window.location.assign('/places')
      })
      await page.waitForURL('/places')
      await page.goBack()
      await expect(page).toHaveURL('/')
      await expect(target).toBeVisible()
      await expect
        .poll(async () => Number(await target.evaluate((element) => window.getComputedStyle(element).opacity)))
        .toBeGreaterThan(0.5)
    }
  })

  test('browser back from saved places restores skills timeline', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Saved Places' }).click()
    await page.waitForURL('/places')

    await page.goBack()
    await expect(page).toHaveURL('/')
    await page.locator('#skills').scrollIntoViewIfNeeded()

    await expect(page.locator('#skills').getByText('BI & Visualization')).toBeVisible()
    await expect(page.locator('#skills').getByText('Languages')).toBeVisible()
    await expect(page.locator('#skills template[data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"]')).toHaveCount(0)
  })

  test('project cards are large showcase panels', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    const firstCard = page.locator('#projects a[href^="/projects/"]').first()
    await expect(firstCard).toBeVisible()

    const box = await firstCard.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(300)
  })

  // ── Testimonials ───────────────────────────────────────────────────────────

  test('testimonials keep carousel navigation controls', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded()
    await expect(page.locator('#testimonial-prev')).toBeVisible()
    await expect(page.locator('#testimonial-next')).toBeVisible()
  })

  // ── Footer ─────────────────────────────────────────────────────────────────

  test('footer has GitHub, LinkedIn, Gmail links', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.locator('footer a[aria-label="GitHub"]')).toBeVisible()
    await expect(page.locator('footer a[aria-label="LinkedIn"]')).toBeVisible()
    await expect(page.locator('footer a[aria-label="Gmail"]')).toBeVisible()
  })

  test('footer hides the places promo link', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.locator('footer a[href="/places"]')).toHaveCount(0)
  })
})
