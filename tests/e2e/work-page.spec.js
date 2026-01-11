// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Work Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SCENIC|Work/);
  });

  test('portfolio grid is visible', async ({ page }) => {
    const grid = page.locator('.portfolio-grid');
    await expect(grid).toBeVisible();
  });

  test('displays portfolio items', async ({ page }) => {
    const items = page.locator('.portfolio-item');
    await expect(items.first()).toBeVisible();
    // Should have multiple portfolio items
    const count = await items.count();
    expect(count).toBeGreaterThan(10);
  });

  test('Masonry layout initializes', async ({ page }) => {
    // Wait for Masonry to initialize (adds masonry class or positions items)
    await page.waitForFunction(() => {
      const grid = document.querySelector('.portfolio-grid');
      const firstItem = grid?.querySelector('.portfolio-item');
      // Masonry positions items absolutely or with transforms
      return firstItem && window.getComputedStyle(firstItem).position !== 'static';
    }, { timeout: 5000 });
  });

  test('images have alt text', async ({ page }) => {
    const images = page.locator('.portfolio-item img');
    const firstImage = images.first();
    await expect(firstImage).toHaveAttribute('alt', /.+/);
  });

  test('CTA section is visible', async ({ page }) => {
    const cta = page.locator('.cta-section');
    await expect(cta).toBeVisible();
  });
});
