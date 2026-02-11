import { Page, expect } from '@playwright/test';

export async function selectProvider(page: Page) {
  await page.goto('/');
  // Should redirect to /select-provider since no provider is selected
  await expect(page).toHaveURL(/\/select-provider/);
  // Wait for provider selector and click to open dropdown
  const combobox = page.getByRole('combobox');
  await combobox.click();
  // Select first provider option
  await page.getByRole('option').first().click();
  // Should navigate to /lines after provider selection
  await expect(page).toHaveURL(/\/lines/);
}
