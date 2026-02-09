import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Flexible line editor', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders flexible lines listing with mock data', async ({ page }) => {
    await page.goto('/flexible-lines');
    await expect(
      page.getByRole('heading', { name: /flexible lines/i }),
    ).toBeVisible();
    // Verify mock flexible lines are listed
    await expect(page.getByText('Fleksirute Oslo Sentrum')).toBeVisible();
    await expect(page.getByText('Bygdøy Ferge Flex')).toBeVisible();
  });

  test('can navigate to create flexible line page', async ({ page }) => {
    await page.goto('/flexible-lines');
    const createButton = page.getByRole('link', {
      name: /create flexible line/i,
    });
    await createButton.click();
    await expect(page).toHaveURL(/\/flexible-lines\/create/);
  });

  test('shows Step 1 (General) when creating a new flexible line', async ({
    page,
  }) => {
    await page.goto('/flexible-lines/create');

    // Verify stepper shows the three steps
    await expect(page.getByText('General')).toBeVisible();
    await expect(page.getByText('Journey Patterns')).toBeVisible();
    await expect(page.getByText('Service Journeys')).toBeVisible();

    // Verify Step 1 form fields are present
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByLabel(/description/i).first()).toBeVisible();
  });

  test('can fill Step 1 form fields', async ({ page }) => {
    await page.goto('/flexible-lines/create');

    // Fill in the name field
    const nameInput = page.getByLabel(/^name/i).first();
    await nameInput.fill('Test Flexible Line');

    // Fill in the description
    const descriptionInput = page.getByLabel(/description/i).first();
    await descriptionInput.fill('A test flexible line');

    // Verify the fields have the expected values
    await expect(nameInput).toHaveValue('Test Flexible Line');
    await expect(descriptionInput).toHaveValue('A test flexible line');
  });

  test('can open an existing flexible line for editing', async ({ page }) => {
    await page.goto('/flexible-lines');

    // Click on the first flexible line to open it
    await page.getByText('Fleksirute Oslo Sentrum').click();

    // Should navigate to the edit page
    await expect(page).toHaveURL(/\/flexible-lines\/edit\//);

    // Verify the line data is loaded in Step 1
    await expect(page.getByText('General')).toBeVisible();
  });

  test('can navigate between editor steps', async ({ page }) => {
    await page.goto('/flexible-lines/create');

    // Fill required name field to allow navigation
    const nameInput = page.getByLabel(/^name/i).first();
    await nameInput.fill('Test Line');

    // Click on Step 2 (Journey Patterns)
    await page.getByText('Journey Patterns').click();

    // Click on Step 3 (Service Journeys)
    await page.getByText('Service Journeys').click();

    // Navigate back to Step 1
    await page.getByText('General').click();
    await expect(nameInput).toHaveValue('Test Line');
  });
});
