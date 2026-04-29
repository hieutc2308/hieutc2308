import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  use: {
    headless: !!process.env.CI,
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
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
      },
})
