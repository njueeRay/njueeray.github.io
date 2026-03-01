/**
 * Home page E2E tests
 * Covers: title, Hero section, navigation links
 */
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Ray Huang/);
  });

  test('renders navigation with key links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    // Blog and Team links exist in nav
    await expect(nav.getByRole('link', { name: /blog/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /team/i })).toBeVisible();
  });

  test('renders Hero section with terminal aesthetic', async ({ page }) => {
    // Hero should contain a heading or terminal-style container
    const hero = page.locator('#main-content').first();
    await expect(hero).toBeVisible();
    // Page should contain Ray Huang somewhere in text
    await expect(page.locator('body')).toContainText('Ray');
  });

  test('theme toggle button is present', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeBtn).toBeVisible();
  });
});
