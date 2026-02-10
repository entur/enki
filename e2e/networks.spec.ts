import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Networks', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders networks listing with mock data', async ({ page }) => {
    await page.goto('/networks');
    // Verify mock network data appears in the table
    await expect(page.getByRole('cell', { name: 'Ruter Flex' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'AtB Flex' })).toBeVisible();
  });

  test('can navigate to create network page', async ({ page }) => {
    await page.goto('/networks');
    const createButton = page.getByRole('link', { name: /create/i });
    await createButton.click();
    await expect(page).toHaveURL(/\/networks\/create/);
  });

  test('can fill in and save a new network', async ({ page }) => {
    await page.goto('/networks/create');

    // Wait for form to load (organisations query must resolve)
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test Network');

    // Select an authority from the dropdown
    const authorityDropdown = page.getByRole('combobox', {
      name: /authority/i,
    });
    await authorityDropdown.click();
    await page.getByRole('option').first().click();

    // Click the create button
    const createButton = page.getByRole('button', {
      name: /create new network/i,
    });
    await createButton.click();
  });
});
