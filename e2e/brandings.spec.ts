import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Brandings', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test('renders brandings listing with heading and create link', async ({
    page,
  }) => {
    await page.goto('/brandings');
    await expect(
      page.getByRole('heading', { name: 'Brandings', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /create branding/i }),
    ).toBeVisible();
  });

  test('shows mock branding data in table', async ({ page }) => {
    await page.goto('/brandings');

    // Ruter Flex row
    await expect(
      page.getByRole('cell', { name: 'Ruter Flex' }),
    ).toBeVisible();
    await expect(page.getByRole('cell', { name: 'RFlex' })).toBeVisible();
    await expect(
      page.getByRole('cell', {
        name: 'Branding for Ruter fleksible linjer',
      }),
    ).toBeVisible();

    // AtB Flex row
    await expect(page.getByRole('cell', { name: 'AtB Flex' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'AFlex' })).toBeVisible();
    await expect(
      page.getByRole('cell', {
        name: 'Branding for AtB fleksible linjer',
      }),
    ).toBeVisible();
  });

  test('can navigate to create branding page', async ({ page }) => {
    await page.goto('/brandings');
    await page.getByRole('link', { name: /create branding/i }).click();
    await expect(page).toHaveURL(/\/brandings\/create/);
  });

  test('create form has expected fields', async ({ page }) => {
    await page.goto('/brandings/create');

    await expect(
      page.getByRole('textbox', { name: /^name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /short name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /description/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /^url/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /image url/i }),
    ).toBeVisible();
  });

  test('can open existing branding for editing', async ({ page }) => {
    await page.goto('/brandings');

    // Click the Ruter Flex row to navigate to edit
    await page.getByRole('cell', { name: 'Ruter Flex' }).click();
    await expect(page).toHaveURL(/\/brandings\/edit\//);

    // Verify form is populated with existing data
    await expect(
      page.getByRole('textbox', { name: /^name/i }),
    ).toHaveValue('Ruter Flex');
    await expect(
      page.getByRole('textbox', { name: /short name/i }),
    ).toHaveValue('RFlex');
    await expect(
      page.getByRole('textbox', { name: /description/i }),
    ).toHaveValue('Branding for Ruter fleksible linjer');
  });
});
