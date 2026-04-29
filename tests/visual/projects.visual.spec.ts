// tests/visual/projects.visual.spec.ts
import { test, expect } from '../fixtures/base'
import resumeData from '../../data/resume.json'

const firstSlug = resumeData.projects[0].slug

test.describe('Project Detail — Visual Snapshots', () => {
  test('project detail page desktop', async ({ page, waitForAnimations }) => {
    await page.goto(`/projects/${firstSlug}`)
    await page.waitForLoadState('networkidle')
    await waitForAnimations()
    await expect(page).toHaveScreenshot('project-detail-desktop.png', {
      fullPage: true,
    })
  })

  test('project detail page mobile', async ({ page, waitForAnimations }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`/projects/${firstSlug}`)
    await page.waitForLoadState('networkidle')
    await waitForAnimations()
    await expect(page).toHaveScreenshot('project-detail-mobile.png', {
      fullPage: true,
    })
  })
})
