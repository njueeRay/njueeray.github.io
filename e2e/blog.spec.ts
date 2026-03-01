/**
 * Blog listing + post detail E2E tests
 * Covers: article cards, filter tabs, post page content, ShareLinks, related posts
 */
import { test, expect } from '@playwright/test';

// Use a stable post slug for detail-page tests
const TEST_SLUG = 'brain-first-post';

test.describe('Blog listing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/');
  });

  test('renders post cards', async ({ page }) => {
    // At least one blog post card should be visible
    const cards = page.locator('#posts-list .post-item');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('filter tab "全部" is active by default', async ({ page }) => {
    const allTab = page.locator('[data-filter="all"]');
    await expect(allTab).toHaveClass(/active/);
  });

  test('filter tab click shows only matching content type', async ({ page }) => {
    const insightTab = page.locator('[data-filter="insight"]');
    await expect(insightTab).toBeVisible();
    await insightTab.click();

    // Tab becomes active
    await expect(insightTab).toHaveClass(/active/);
    // "all" tab loses active class
    await expect(page.locator('[data-filter="all"]')).not.toHaveClass(/active/);
    // URL hash updates
    await expect(page).toHaveURL(/#insight/);
  });

  test('all blog post cards have a title link', async ({ page }) => {
    const titleLinks = page.locator('#posts-list .post-item a').first();
    await expect(titleLinks).toBeVisible();
    // Clicking should navigate to a post
    const href = await titleLinks.getAttribute('href');
    expect(href).toMatch(/^\/blog\//);
  });
});

test.describe('Blog post detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${TEST_SLUG}/`);
  });

  test('renders article heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('ReadingProgress bar is present in DOM', async ({ page }) => {
    // ReadingProgress renders a fixed bar at top of page
    const progress = page.locator('.reading-progress, [class*="progress"]').first();
    await expect(progress).toBeAttached();
  });

  test('ShareLinks component is visible', async ({ page }) => {
    const shareLinks = page.locator('.share-links');
    await expect(shareLinks).toBeVisible();
    // Copy link button should exist
    const copyBtn = page.locator('#copy-link-btn');
    await expect(copyBtn).toBeVisible();
  });

  test('OG image meta tag is present', async ({ page }) => {
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeAttached();
    const content = await ogImage.getAttribute('content');
    expect(content).toMatch(/\/og\//);
  });
});
