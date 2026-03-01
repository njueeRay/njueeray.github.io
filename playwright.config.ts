/**
 * Playwright E2E Configuration — v5.4.0
 * - Local: tests against Astro dev server (reuses existing if running)
 * - CI: tests against `astro preview` (after `npm run build`)
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Fail fast in CI if any test.only is accidentally committed
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Single worker in CI saves memory; auto in dev
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',

  use: {
    baseURL: 'http://localhost:4321',
    // Capture trace on first retry for debugging
    trace: 'on-first-retry',
  },

  projects: [
    // Primary: Desktop Chromium — covers ~70% of real-world usage
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    // Secondary: Mobile Safari — verifies responsive layout
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    // CI runs `astro preview` against the already-built `dist/`
    // Local runs `astro dev` for faster feedback
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
