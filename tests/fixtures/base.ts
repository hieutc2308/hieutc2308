// tests/fixtures/base.ts
import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export const test = base.extend<{ waitForAnimations: () => Promise<void> }>({
  waitForAnimations: async ({ page }: { page: Page }, use) => {
    const wait = async () => {
      // 800ms covers the longest Framer Motion entrance (600-700ms) plus buffer
      await page.waitForTimeout(800)
    }
    await use(wait)
  },
})

export { expect }
