import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Lines listing', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders lines listing page', async ({ page }) => {
    await page.goto('/lines');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('displays mock line data', async ({ page }) => {
    await page.goto('/lines');
    // Verify mock lines appear (Line 201 and Line 202 from mock data)
    await expect(page.getByText('201')).toBeVisible();
    await expect(page.getByText('202')).toBeVisible();
  });

  test('navigates to create line page', async ({ page }) => {
    await page.goto('/lines');
    // Click the create line button
    const createButton = page.getByRole('link', { name: /create/i });
    await createButton.click();
    await expect(page).toHaveURL(/\/lines\/create/);
  });
});
