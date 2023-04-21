import { newExport } from 'model/Export';
import { exportIsValid } from './validateForm';

it('returns false when name is empty', () => {
  expect(exportIsValid(newExport())).toBe(false);
});

it('returns true when valid', () => {
  expect(
    exportIsValid({
      name: 'Test export',
      dryRun: true,
    })
  ).toBe(true);
});
