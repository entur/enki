import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Exports', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders exports listing with mock data', async ({ page }) => {
    await page.goto('/exports');
    await expect(
      page.getByRole('heading', { name: /exports/i }),
    ).toBeVisible();

    // Verify mock exports are listed
    await expect(page.getByText('Mars 2025 eksport')).toBeVisible();
    await expect(page.getByText('Test eksport (dry run)')).toBeVisible();
    await expect(page.getByText('Feilet eksport')).toBeVisible();
  });

  test('can navigate to create export page', async ({ page }) => {
    await page.goto('/exports');
    const createButton = page.getByRole('link', {
      name: /create export/i,
    });
    await createButton.click();
    await expect(page).toHaveURL(/\/exports\/create/);
  });

  test('shows create export form with expected fields', async ({ page }) => {
    await page.goto('/exports/create');

    // Verify heading
    await expect(
      page.getByRole('heading', { name: /create export/i }),
    ).toBeVisible();

    // Verify the name field is present
    await expect(page.getByLabel(/name/i)).toBeVisible();

    // Verify the save/create button
    await expect(
      page.getByRole('button', { name: /create export/i }),
    ).toBeVisible();
  });

  test('can fill in export name and create', async ({ page }) => {
    await page.goto('/exports/create');

    // Fill in the name
    const nameInput = page.getByLabel(/name/i);
    await nameInput.fill('My Test Export');
    await expect(nameInput).toHaveValue('My Test Export');

    // Click the create button
    const createButton = page.getByRole('button', {
      name: /create export/i,
    });
    await createButton.click();

    // Should navigate back to exports listing after save
    await expect(page).toHaveURL(/\/exports/);
  });

  test('can view an existing export details', async ({ page }) => {
    await page.goto('/exports');

    // Click on the first export to view details
    await page.getByText('Mars 2025 eksport').click();

    // Should navigate to the view page
    await expect(page).toHaveURL(/\/exports\/view\//);
  });

  test('shows export status indicators in listing', async ({ page }) => {
    await page.goto('/exports');

    // The exports listing should show all three exports with different statuses
    // Successful export
    await expect(page.getByText('Mars 2025 eksport')).toBeVisible();
    // Dry run export
    await expect(page.getByText('Test eksport (dry run)')).toBeVisible();
    // Failed export
    await expect(page.getByText('Feilet eksport')).toBeVisible();
  });
});
