import { Page, expect } from '@playwright/test';

export async function selectProvider(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  // Wait for MSW service worker and app to initialize, then redirect
  await expect(page).toHaveURL(/\/select-provider/, { timeout: 15000 });
  // Wait for provider selector and click to open dropdown
  const combobox = page.getByRole('combobox');
  await combobox.click();
  // Select first provider option
  await page.getByRole('option').first().click();
  // Should navigate to /lines after provider selection
  await expect(page).toHaveURL(/\/lines/, { timeout: 10000 });
}
