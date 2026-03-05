import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Stop places', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders stop places listing with mock data', async ({ page }) => {
    await page.goto('/stop-places');
    await expect(
      page.getByRole('heading', { name: /flexible stop places/i }),
    ).toBeVisible();

    // Verify mock stop places are listed
    await expect(page.getByText('Oslo Sentrum Sone')).toBeVisible();
    await expect(page.getByText('Grünerløkka Sone')).toBeVisible();
    await expect(page.getByText('Bygdøy Sone')).toBeVisible();
  });

  test('can navigate to create stop place page', async ({ page }) => {
    await page.goto('/stop-places');
    const createButton = page.getByRole('link', {
      name: /create flexible stop place/i,
    });
    await createButton.click();
    await expect(page).toHaveURL(/\/stop-places\/create/);
  });

  test('shows create form with expected fields', async ({ page }) => {
    await page.goto('/stop-places/create');

    // Verify form fields are present
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByLabel(/description/i).first()).toBeVisible();
    await expect(page.getByLabel(/private code/i)).toBeVisible();
  });

  test('can fill in stop place name and description', async ({ page }) => {
    await page.goto('/stop-places/create');

    // Fill in the name
    const nameInput = page.getByLabel(/name/i).first();
    await nameInput.fill('Test Sone');
    await expect(nameInput).toHaveValue('Test Sone');

    // Fill in the description
    const descriptionInput = page.getByLabel(/description/i).first();
    await descriptionInput.fill('A test flexible stop place');
    await expect(descriptionInput).toHaveValue('A test flexible stop place');
  });

  test('can open an existing stop place for editing', async ({ page }) => {
    await page.goto('/stop-places');

    // Click on the first stop place to edit
    await page.getByText('Oslo Sentrum Sone').click();

    // Should navigate to the edit page
    await expect(page).toHaveURL(/\/stop-places\/edit\//);

    // Verify the name field is populated
    await expect(page.getByLabel(/name/i).first()).toHaveValue(
      'Oslo Sentrum Sone',
    );
  });

  test('shows map on the editor page', async ({ page }) => {
    await page.goto('/stop-places/create');

    // The editor should have a map container for drawing polygons
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });
});
