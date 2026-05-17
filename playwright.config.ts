import { defineConfig, devices } from '@playwright/test'

const localURL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './tests',
  outputDir: '.tmp/playwright/test-results',
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: '.tmp/playwright/report', open: 'never' }]]
    : [['list']],
  use: {
    baseURL: localURL,
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'functional',
      testMatch: '**/functional/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'functional-firefox',
      testMatch: '**/functional/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'visual',
      testMatch: '**/visual/**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: localURL,
        reuseExistingServer: true,
      },
})
