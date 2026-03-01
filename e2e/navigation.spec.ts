/**
 * Navigation E2E tests
 * Covers: nav links work correctly, theme toggle, mobile hamburger menu
 */
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('clicking Blog nav link navigates to /blog/', async ({ page }) => {
    await page.goto('/');
    const blogLink = page.locator('nav').getByRole('link', { name: /blog/i });
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog\//);
    await expect(page).toHaveTitle(/Blog/);
  });

  test('clicking Team nav link navigates to /team', async ({ page }) => {
    await page.goto('/');
    const teamLink = page.locator('nav').getByRole('link', { name: /team/i });
    await teamLink.click();
    await expect(page).toHaveURL(/\/team/);
  });

  test('theme toggle switches data-theme attribute', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    // Default is dark
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Click toggle
    const themeBtn = page.getByRole('button', { name: 'Toggle theme' });
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Toggle back
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro

  test('hamburger menu toggles mobile nav visibility', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(hamburger).toBeVisible();

    // Click to open
    await hamburger.click();
    const expandedAttr = await hamburger.getAttribute('aria-expanded');
    expect(expandedAttr).toBe('true');

    // Click to close
    await hamburger.click();
    const collapsedAttr = await hamburger.getAttribute('aria-expanded');
    expect(collapsedAttr).toBe('false');
  });
});
