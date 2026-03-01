/**
 * Accessibility E2E tests
 * Covers: skip-to-content, main landmark, HTML lang attr, 404, Team page, Tag cloud
 */
import { test, expect } from '@playwright/test';

test.describe('Accessibility basics', () => {
  test('homepage has correct html lang attribute', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    // Should have a lang attribute (non-empty)
    const lang = await html.getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('skip-to-content link is present and targets #main-content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('main landmark with id="main-content" is present', async ({ page }) => {
    await page.goto('/');
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeAttached();
  });

  test('nav has aria-label', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav.navbar');
    await expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });
});

test.describe('404 page', () => {
  test('returns 404 status and shows error content', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-at-all');
    expect(response?.status()).toBe(404);

    // Custom 404 page should have some content
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});

test.describe('Team page', () => {
  test('team page renders activity feed', async ({ page }) => {
    await page.goto('/team');
    const activityFeed = page.locator('ol[aria-label="团队博文动态流"]');
    await expect(activityFeed).toBeVisible();

    // Should have at least one activity item
    const items = activityFeed.locator('li');
    await expect(items.first()).toBeVisible();
  });
});

test.describe('Tags page', () => {
  test('tag cloud is visible', async ({ page }) => {
    await page.goto('/blog/tags/');
    const tagCloud = page.locator('ul[aria-label="标签云"]');
    await expect(tagCloud).toBeVisible();

    const tags = tagCloud.locator('li');
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });
});
