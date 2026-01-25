import { test, expect } from '@playwright/test';

test.describe('Pocket Helper E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('h1');
    });

    test('should load home page and show app name', async ({ page }) => {
        const appHeader = page.locator('h1').first();
        await expect(appHeader).toContainText(/Pocket Helper/i);
    });

    test('should open settings and change language', async ({ page }) => {
        await page.locator('button').filter({ has: page.locator('svg.lucide-settings') }).first().click();
        await expect(page.getByText('Language Preferences')).toBeVisible();
        await page.getByRole('button', { name: 'العربية' }).click();
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await page.locator('button').filter({ has: page.locator('svg.lucide-x') }).click();
    });

    test('should navigate to Guides and back', async ({ page }) => {
        // Look for the specific NavLink to /guides in the bottom nav
        const guidesLink = page.locator('nav a[href="#/guides"]');
        await guidesLink.click();

        // Wait for the h1 in the Guides page
        const guidesHeader = page.locator('h1').first();
        await expect(guidesHeader).toContainText(/Safety Guides/i);

        // Go back home using bottom nav
        await page.locator('nav a[href="#/"]').first().click();
        await expect(page.locator('h1').first()).toContainText(/Pocket Helper/i);
    });

    test('should open SOS modal/action', async ({ page }) => {
        const sosButton = page.getByRole('button', { name: /Send SOS/i });
        await expect(sosButton).toBeVisible();

        page.once('dialog', async dialog => {
            expect(dialog.message()).toMatch(/Please set an emergency contact/i);
            await dialog.dismiss();
        });

        await sosButton.click();
    });

    test('should toggle theme', async ({ page }) => {
        await page.locator('button').filter({ has: page.locator('svg.lucide-settings') }).first().click();
        await page.getByRole('button', { name: 'Dark', exact: true }).click();
        await expect(page.locator('html')).toHaveClass(/dark/);
        await page.getByRole('button', { name: 'Gold', exact: true }).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'gold');
    });
});
