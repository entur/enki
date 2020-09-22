import { exportIsValid } from './validateForm';
import { format, subDays } from 'date-fns';
import { newExport } from 'model/Export';

it('returns false when name is empty', () => {
  expect(exportIsValid(newExport())).toBe(false);
});

it('returns false when toDate is before fromDate', () => {
  expect(
    exportIsValid({
      name: 'Test export',
      fromDate: format(new Date(), 'yyyy-MM-dd'),
      toDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      dryRun: true,
    })
  ).toBe(false);
});

it('returns true when valid', () => {
  expect(
    exportIsValid({
      name: 'Test export',
      fromDate: format(new Date(), 'yyyy-MM-dd'),
      toDate: format(new Date(), 'yyyy-MM-dd'),
      dryRun: true,
    })
  ).toBe(true);
});
