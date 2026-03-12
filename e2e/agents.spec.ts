/**
 * Agents section E2E tests — v7.0-pre
 * Covers: /agents index, /agents/[id] detail, /agents/office canvas
 */
import { test, expect } from '@playwright/test';

test.describe('/agents index', () => {
  test('renders agent list with at least 7 cards', async ({ page }) => {
    await page.goto('/agents');
    const cards = page.locator('[data-agent-id], .agent-card, article');
    // there should be 7 agents
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('shows link to office page', async ({ page }) => {
    await page.goto('/agents');
    const officeLink = page.getByRole('link', { name: /office|办公室/i });
    await expect(officeLink).toBeVisible();
  });
});

test.describe('/agents/office', () => {
  test('page loads and canvas is rendered', async ({ page }) => {
    await page.goto('/agents/office');
    await expect(page).toHaveTitle(/办公室|office/i);

    // Canvas element should be present (React Island)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached();
  });

  test('canvas has accessible role and label', async ({ page }) => {
    await page.goto('/agents/office');
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeAttached();
    const label = await canvas.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('office page visual snapshot', async ({ page }) => {
    await page.goto('/agents/office');
    // Wait for React island to hydrate (canvas animation starts)
    await page.waitForTimeout(1200);

    const container = page.locator('.office-canvas-wrapper, [class*="office"]').first();
    if (await container.isVisible()) {
      await expect(container).toHaveScreenshot('office-canvas.png', {
        maxDiffPixelRatio: 0.05, // allow 5% diff for animation frames
      });
    } else {
      // Fallback: snapshot the whole page above fold
      await expect(page).toHaveScreenshot('office-page.png', {
        clip: { x: 0, y: 0, width: 1280, height: 720 },
        maxDiffPixelRatio: 0.05,
      });
    }
  });
});

test.describe('/agents/[id] detail pages', () => {
  const AGENT_IDS = ['brain', 'pm', 'dev', 'researcher', 'code-reviewer'];

  for (const id of AGENT_IDS) {
    test(`/agents/${id} renders agent detail`, async ({ page }) => {
      const response = await page.goto(`/agents/${id}`);
      expect(response?.status()).toBe(200);

      // Should have a main heading with agent name
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Should link back to /agents
      const backLink = page.getByRole('link', { name: /团队|team|back|返回/i });
      await expect(backLink.first()).toBeVisible();
    });
  }
});
