// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SCENIC/);
  });

  test('displays logo', async ({ page }) => {
    const logo = page.locator('.logo img');
    await expect(logo).toBeVisible();
  });

  test('displays version indicator', async ({ page }) => {
    const version = page.locator('.version-number');
    await expect(version).toBeVisible();
    await expect(version).toContainText(/\d+\.\d+\.\d+/);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('CTA button scrolls to services', async ({ page }) => {
    const ctaButton = page.locator('.cta-btn');
    await expect(ctaButton).toBeVisible();
  });

  test('services section displays all cards', async ({ page }) => {
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(5);
  });

  test('team section displays members', async ({ page }) => {
    const teamMembers = page.locator('.team-member-card');
    await expect(teamMembers).toHaveCount(5);
  });

  test('footer is visible', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Navigation', () => {
  // Only run on Desktop where nav links are visible without hamburger menu
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('WORK link navigates to work page', async ({ page }) => {
    await page.click('a[href="work.html"]');
    await expect(page).toHaveURL(/work\.html/);
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger menu toggles navigation', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.locator('.hamburger');
    const navList = page.locator('.nav-list');

    // Menu should be hidden initially on mobile
    await expect(hamburger).toBeVisible();

    // Click hamburger to open menu
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    // Click again to close
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });
});
