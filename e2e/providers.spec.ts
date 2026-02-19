import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Providers', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders providers listing with heading and create link', async ({
    page,
  }) => {
    await page.goto('/providers');
    await expect(
      page.getByRole('heading', { name: 'Providers', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /create provider/i }),
    ).toBeVisible();
  });

  test('shows mock provider data in table', async ({ page }) => {
    await page.goto('/providers');

    // Verify provider names are visible
    await expect(
      page.getByRole('cell', { name: 'Ruter Flex' }),
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'AtB Flex' }),
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'Test provider' }),
    ).toBeVisible();

    // Verify namespace URLs are visible (unique per provider)
    await expect(
      page.getByRole('cell', { name: 'http://www.rutebanken.org/ns/rut' }),
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'http://www.rutebanken.org/ns/atb' }),
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'http://www.rutebanken.org/ns/tst' }),
    ).toBeVisible();
  });

  test('can navigate to create provider page', async ({ page }) => {
    await page.goto('/providers');
    await page.getByRole('link', { name: /create provider/i }).click();
    await expect(page).toHaveURL(/\/providers\/create/);
  });

  test('create form has expected fields', async ({ page }) => {
    await page.goto('/providers/create');

    await expect(
      page.getByRole('textbox', { name: /^name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /^code/i }),
    ).toBeVisible();
    // XML namespace fields are auto-populated and disabled
    await expect(
      page.getByRole('textbox', { name: 'XML namespace *' }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /xml namespace url/i }),
    ).toBeVisible();
  });

  test('can open existing provider for editing', async ({ page }) => {
    await page.goto('/providers');

    // Click the Ruter Flex row to navigate to edit
    await page.getByRole('cell', { name: 'Ruter Flex' }).click();
    await expect(page).toHaveURL(/\/providers\/edit\//);

    // Verify form is populated with existing data
    await expect(
      page.getByRole('textbox', { name: /^name/i }),
    ).toHaveValue('Ruter Flex');
    await expect(
      page.getByRole('textbox', { name: /^code/i }),
    ).toHaveValue('RUT');
  });
});
