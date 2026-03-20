import { test, expect } from '@playwright/test';

test.describe('App loads and provider selection', () => {
  test('redirects to /select-provider when no provider is selected', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/select-provider/);
  });

  test('can select a provider and navigate to lines', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/select-provider/);

    // Open the provider dropdown
    const combobox = page.getByRole('combobox');
    await combobox.click();

    // Verify provider options are shown
    const options = page.getByRole('option');
    await expect(options.first()).toBeVisible();

    // Select first provider
    await options.first().click();

    // Should redirect to /lines after selection
    await expect(page).toHaveURL(/\/lines/);
  });

  test('shows lines listing page after provider selection', async ({
    page,
  }) => {
    await page.goto('/');
    // Wait for either provider selection page or lines page
    await page.waitForURL(/\/(select-provider|lines)/);

    // If on provider selection page, select a provider
    if (page.url().includes('/select-provider')) {
      const combobox = page.getByRole('combobox');
      await combobox.click();
      await page.getByRole('option').first().click();
    }

    await expect(page).toHaveURL(/\/lines/);
    // Verify the lines page has loaded with content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
