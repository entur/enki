import { test, expect } from '@playwright/test';
import { selectProvider } from './helpers';

test.describe('Line editor', () => {
  test.beforeEach(async ({ page }) => {
    await selectProvider(page);
  });

  test.describe('Lines listing', () => {
    test('renders lines listing with mock data', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /lines/i }),
      ).toBeVisible();
      // Verify mock lines are listed
      await expect(
        page.getByText('Linje 201 Majorstuen - Tøyen'),
      ).toBeVisible();
      await expect(
        page.getByText('Linje 202 Jernbanetorget - Lysaker'),
      ).toBeVisible();
    });

    test('can navigate to create line page', async ({ page }) => {
      const createButton = page.getByRole('link', {
        name: /create line/i,
      });
      await createButton.click();
      await expect(page).toHaveURL(/\/lines\/create/);
    });
  });

  test.describe('Step 1 — General (existing line)', () => {
    test.beforeEach(async ({ page }) => {
      // Open Line 201 from listing
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);
    });

    test('shows stepper with all three steps', async ({ page }) => {
      await expect(page.getByText('1. General')).toBeVisible();
      await expect(page.getByText('2. Journey Patterns')).toBeVisible();
      await expect(page.getByText('3. Service Journeys')).toBeVisible();
    });

    test('shows About the line heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /about the line/i }),
      ).toBeVisible();
    });

    test('has form fields populated with line data', async ({ page }) => {
      await expect(
        page.getByRole('textbox', { name: /name/i }).first(),
      ).toHaveValue('Linje 201 Majorstuen - Tøyen');
      await expect(
        page.getByRole('textbox', { name: /description/i }).first(),
      ).toHaveValue('Fast linje mellom Majorstuen og Tøyen');
      await expect(
        page.getByRole('textbox', { name: /public code/i }),
      ).toHaveValue('201');
      await expect(
        page.getByRole('textbox', { name: /private code/i }),
      ).toHaveValue('L201');
    });

    test('has dropdown fields with correct values', async ({ page }) => {
      // Wait for the edit page to fully render before checking dropdown values
      await expect(
        page.getByRole('heading', { name: /about the line/i }),
      ).toBeVisible();
      // @entur design system comboboxes show selected value as text, not input value
      await expect(page.getByText('Vy Buss AS').first()).toBeVisible();
      await expect(page.getByText('Bus').first()).toBeVisible();
      await expect(page.getByText('Local bus')).toBeVisible();
    });

    test('shows notices section with existing notice', async ({ page }) => {
      await expect(page.getByText('Notices')).toBeVisible();
      // Notice text is in a textarea within the notices table
      await expect(
        page.locator('textarea').first(),
      ).toHaveValue('Ruteendring fra 1. mars');
    });

    test('has Save and Delete buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
      await expect(
        page.getByRole('button', { name: /delete/i }),
      ).toBeVisible();
    });
  });

  test.describe('Step 1 — General (new line)', () => {
    test('shows empty form for new line', async ({ page }) => {
      await page.goto('/lines/create');

      await expect(
        page.getByRole('heading', { name: /about the line/i }),
      ).toBeVisible();

      // Name field should be empty
      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await expect(nameInput).toHaveValue('');
    });

    test('can fill in name field', async ({ page }) => {
      await page.goto('/lines/create');

      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await nameInput.fill('Test New Line');
      await expect(nameInput).toHaveValue('Test New Line');
    });
  });

  test.describe('Step navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);
    });

    test('can navigate forward to Step 2 with Next button', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Next' }).click();

      await expect(
        page.getByRole('heading', { name: /journey patterns/i }),
      ).toBeVisible();
    });

    test('can navigate forward to Step 3 with Next button', async ({
      page,
    }) => {
      // Step 1 → Step 2
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /journey patterns/i }),
      ).toBeVisible();

      // Step 2 → Step 3
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /service journeys/i }),
      ).toBeVisible();
    });

    test('can navigate back to Step 1 by clicking completed step', async ({
      page,
    }) => {
      // Go to Step 2
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /journey patterns/i }),
      ).toBeVisible();

      // Click completed Step 1 to go back (completed steps become buttons)
      await page.getByText('1. General').click();
      await expect(
        page.getByRole('heading', { name: /about the line/i }),
      ).toBeVisible();
    });
  });

  test.describe('Step 2 — Journey Patterns', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);
      // Navigate to Step 2
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /journey patterns/i }),
      ).toBeVisible();
    });

    test('shows both journey pattern accordions', async ({ page }) => {
      await expect(
        page.getByRole('button', {
          name: 'Majorstuen - Tøyen via Stortinget',
        }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', {
          name: 'Tøyen - Majorstuen via Stortinget',
        }),
      ).toBeVisible();
    });

    test('shows expanded JP with stop point quay IDs', async ({ page }) => {
      // The last JP is expanded by default
      await expect(
        page.locator('input[value="NSR:Quay:2003"]'),
      ).toBeVisible();
      await expect(
        page.locator('input[value="NSR:Quay:2002"]'),
      ).toBeVisible();
      await expect(
        page.locator('input[value="NSR:Quay:2001"]'),
      ).toBeVisible();
    });

    test('shows expanded JP with front text and resolved stop names', async ({
      page,
    }) => {
      // Verify resolved stop place names
      await expect(page.getByText('Tøyen 1')).toBeVisible();
      await expect(page.getByText('Stortinget 1')).toBeVisible();
      await expect(page.getByText('Majorstuen A')).toBeVisible();
    });

    test('shows Create more Journey Patterns text', async ({ page }) => {
      await expect(
        page.getByText('Create more Journey Patterns'),
      ).toBeVisible();
    });

    test('shows Save button on Step 2', async ({ page }) => {
      await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    });
  });

  test.describe('Step 3 — Service Journeys', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);
      // Navigate to Step 3
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /service journeys/i }),
      ).toBeVisible();
    });

    test('shows SJ grouped by JP with headings', async ({ page }) => {
      await expect(
        page.getByRole('heading', {
          name: 'Majorstuen - Tøyen via Stortinget',
        }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: 'Tøyen - Majorstuen via Stortinget',
        }),
      ).toBeVisible();
    });

    test('shows service journey accordions under first JP', async ({
      page,
    }) => {
      await expect(
        page.getByRole('button', { name: 'Morgenrute' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Formiddagsrute' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Ettermiddagsrute' }),
      ).toBeVisible();
    });

    test('shows service journey accordions under second JP', async ({
      page,
    }) => {
      await expect(
        page.getByRole('button', { name: 'Morgenretur' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Ettermiddagsretur' }),
      ).toBeVisible();
    });

    test('shows expanded SJ with name and description fields', async ({
      page,
    }) => {
      // The last SJ in the last JP group is expanded by default
      // Verify the expanded SJ has text fields
      await expect(
        page.getByRole('textbox', { name: /^name/i }).first(),
      ).toBeVisible();
    });

    test('shows expanded SJ with day types', async ({ page }) => {
      // Day type chips should be visible in the expanded SJ
      await expect(page.getByText('Hverdager').first()).toBeVisible();
    });

    test('shows expanded SJ with passing times section', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Passing times' }),
      ).toBeVisible();
    });

    test('shows stop names in passing times', async ({ page }) => {
      // Stop names in the passing times grid
      await expect(page.getByText('Majorstuen').first()).toBeVisible();
      await expect(page.getByText('Stortinget').first()).toBeVisible();
      await expect(page.getByText('Tøyen').first()).toBeVisible();
    });

    test('shows Create more Service Journeys text', async ({ page }) => {
      await expect(
        page.getByText('Create more Service Journeys'),
      ).toBeVisible();
    });

    test('shows Save button on Step 3', async ({ page }) => {
      await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    });
  });

  test.describe('Workflows — save and delete', () => {
    test('can edit line name and save successfully', async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);

      // Modify the line name
      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await nameInput.fill('Updated Line Name');
      await expect(nameInput).toHaveValue('Updated Line Name');

      // Click Save
      await page.getByRole('button', { name: /save/i }).click();

      // Verify success notification
      await expect(page.getByText('The line was successfully saved!')).toBeVisible();
    });

    test('can save line from Step 2 (Journey Patterns)', async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);

      // Navigate to Step 2
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /journey patterns/i }),
      ).toBeVisible();

      // Click Save from Step 2
      await page.getByRole('button', { name: /save/i }).click();

      // Verify success notification
      await expect(page.getByText('The line was successfully saved!')).toBeVisible();
    });

    test('can save line from Step 3 (Service Journeys)', async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);

      // Navigate to Step 3
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page.getByRole('heading', { name: /service journeys/i }),
      ).toBeVisible();

      // Click Save from Step 3
      await page.getByRole('button', { name: /save/i }).click();

      // Verify success notification
      await expect(page.getByText('The line was successfully saved!')).toBeVisible();
    });

    test('can delete a line with confirmation dialog', async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);

      // Click Delete
      await page.getByRole('button', { name: /delete/i }).click();

      // Verify confirmation dialog appears
      await expect(
        page.getByRole('heading', { name: 'Delete line' }),
      ).toBeVisible();
      await expect(
        page.getByText('Are you sure you want to delete this line?'),
      ).toBeVisible();

      // Confirm deletion
      await page.getByRole('button', { name: 'Yes' }).click();

      // Verify redirect to lines listing and success notification
      await expect(page).toHaveURL(/\/lines$/);
      await expect(page.getByText('The line was deleted')).toBeVisible();
    });

    test('can cancel line deletion', async ({ page }) => {
      await page.getByText('Linje 201 Majorstuen - Tøyen').click();
      await expect(page).toHaveURL(/\/lines\/edit\//);

      // Click Delete
      await page.getByRole('button', { name: /delete/i }).click();

      // Verify confirmation dialog
      await expect(
        page.getByRole('heading', { name: 'Delete line' }),
      ).toBeVisible();

      // Cancel deletion
      await page.getByRole('button', { name: 'No' }).click();

      // Should remain on the edit page
      await expect(page).toHaveURL(/\/lines\/edit\//);
    });
  });
});
