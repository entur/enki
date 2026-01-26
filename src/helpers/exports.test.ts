import { sortExportsByDate } from './exports';
import { createExport } from 'test/factories/export';

describe('exports helpers', () => {
  describe('sortExportsByDate', () => {
    it('should sort exports by date in descending order (newest first)', () => {
      const oldExport = createExport({ created: '2024-01-01T10:00:00Z' });
      const newExport = createExport({ created: '2024-01-15T10:00:00Z' });
      const middleExport = createExport({ created: '2024-01-08T10:00:00Z' });

      const result = sortExportsByDate([oldExport, newExport, middleExport]);

      expect(result[0]).toBe(newExport);
      expect(result[1]).toBe(middleExport);
      expect(result[2]).toBe(oldExport);
    });

    it('should return empty array for empty input', () => {
      const result = sortExportsByDate([]);
      expect(result).toEqual([]);
    });

    it('should handle single export', () => {
      const singleExport = createExport({ created: '2024-01-01T10:00:00Z' });
      const result = sortExportsByDate([singleExport]);
      expect(result).toEqual([singleExport]);
    });

    it('should handle exports with same date', () => {
      const export1 = createExport({
        id: 'export1',
        created: '2024-01-01T10:00:00Z',
      });
      const export2 = createExport({
        id: 'export2',
        created: '2024-01-01T10:00:00Z',
      });

      const result = sortExportsByDate([export1, export2]);

      expect(result).toHaveLength(2);
      expect(result).toContain(export1);
      expect(result).toContain(export2);
    });

    it('should not mutate original array', () => {
      const exports = [
        createExport({ created: '2024-01-01T10:00:00Z' }),
        createExport({ created: '2024-01-15T10:00:00Z' }),
      ];
      const originalOrder = [...exports];

      sortExportsByDate(exports);

      expect(exports[0]).toBe(originalOrder[0]);
      expect(exports[1]).toBe(originalOrder[1]);
    });

    it('should sort exports with undefined created to the end', () => {
      const withDate = createExport({ created: '2024-01-01T10:00:00Z' });
      const withoutDate = createExport({ created: undefined });

      const result = sortExportsByDate([withoutDate, withDate]);

      expect(result[0]).toBe(withDate);
      expect(result[1]).toBe(withoutDate);
    });

    it('should handle multiple exports with undefined created', () => {
      const withDate = createExport({ created: '2024-01-01T10:00:00Z' });
      const withoutDate1 = createExport({
        id: 'no-date-1',
        created: undefined,
      });
      const withoutDate2 = createExport({
        id: 'no-date-2',
        created: undefined,
      });

      const result = sortExportsByDate([withoutDate1, withDate, withoutDate2]);

      expect(result[0]).toBe(withDate);
      expect(result.slice(1)).toContain(withoutDate1);
      expect(result.slice(1)).toContain(withoutDate2);
    });
  });
});
