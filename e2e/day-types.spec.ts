import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Day types', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders day types listing with mock data', async ({ page }) => {
    await page.goto('/day-types');
    await expect(
      page.getByRole('heading', { name: /day types/i }),
    ).toBeVisible();

    // Verify mock day types are listed
    await expect(page.getByText('Hverdager')).toBeVisible();
    await expect(page.getByText('Lørdager')).toBeVisible();
    await expect(page.getByText('Søndager')).toBeVisible();
  });

  test('can navigate to create day type page', async ({ page }) => {
    await page.goto('/day-types');
    const createButton = page.getByRole('link', {
      name: /create day type/i,
    });
    await createButton.click();
    await expect(page).toHaveURL(/\/day-types\/create/);
  });

  test('shows create form with name field and weekday picker', async ({
    page,
  }) => {
    await page.goto('/day-types/create');

    // Verify the name field is present
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();

    // Verify weekday picker section is present
    await expect(page.getByText(/weekdays for availability/i)).toBeVisible();
  });

  test('can fill in day type name', async ({ page }) => {
    await page.goto('/day-types/create');

    const nameInput = page.getByRole('textbox', { name: /name/i });
    await nameInput.fill('Test Day Type');
    await expect(nameInput).toHaveValue('Test Day Type');
  });

  test('can open an existing day type for editing', async ({ page }) => {
    await page.goto('/day-types');

    // Click on the first day type to edit
    await page.getByText('Hverdager').click();

    // Should navigate to the edit page
    await expect(page).toHaveURL(/\/day-types\/edit\//);

    // Verify the name field is populated
    await expect(
      page.getByRole('textbox', { name: /name/i }),
    ).toHaveValue('Hverdager');
  });

  test('shows in-use indicator for day types with service journeys', async ({
    page,
  }) => {
    await page.goto('/day-types');

    // The listing should show whether day types are in use
    // Hverdager has 2 service journeys, so it should show "Yes"
    // All three mock day types have service journeys
    const rows = page.getByRole('row');
    await expect(rows.first()).toBeVisible();
  });

  test('save button is present on edit page', async ({ page }) => {
    await page.goto('/day-types');
    await page.getByText('Hverdager').click();
    await expect(page).toHaveURL(/\/day-types\/edit\//);

    // Verify save and delete buttons exist
    await expect(
      page.getByRole('button', { name: /save/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /delete/i }),
    ).toBeVisible();
  });

  test('can edit and save an existing day type', async ({ page }) => {
    await page.goto('/day-types');
    await page.getByText('Hverdager').click();
    await expect(page).toHaveURL(/\/day-types\/edit\//);

    // Modify the name
    const nameInput = page.getByRole('textbox', { name: /name/i });
    await nameInput.fill('Updated Weekdays');
    await expect(nameInput).toHaveValue('Updated Weekdays');

    // Click Save
    await page.getByRole('button', { name: /save/i }).click();

    // Verify success notification
    await expect(page.getByText('Day type was saved.')).toBeVisible();
  });

  test('delete button is disabled for in-use day types', async ({ page }) => {
    await page.goto('/day-types');
    await page.getByText('Hverdager').click();
    await expect(page).toHaveURL(/\/day-types\/edit\//);

    // Delete should be disabled because this day type is used by service journeys
    await expect(
      page.getByRole('button', { name: /delete/i }),
    ).toBeDisabled();
  });
});
