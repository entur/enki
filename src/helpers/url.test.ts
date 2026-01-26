import { getFlexibleLineFromPath } from './url';
import FlexibleLine from 'model/FlexibleLine';
import { Params } from 'react-router-dom';

describe('url', () => {
  describe('getFlexibleLineFromPath', () => {
    const createFlexibleLine = (id: string): FlexibleLine => ({
      id,
      name: `Line ${id}`,
      journeyPatterns: [],
    });

    it('should return the matching FlexibleLine when id matches', () => {
      const lines: FlexibleLine[] = [
        createFlexibleLine('line-1'),
        createFlexibleLine('line-2'),
        createFlexibleLine('line-3'),
      ];
      const params: Params = { id: 'line-2' };

      const result = getFlexibleLineFromPath(lines, params);

      expect(result).toBeDefined();
      expect(result?.id).toBe('line-2');
    });

    it('should return undefined when no line matches the id', () => {
      const lines: FlexibleLine[] = [
        createFlexibleLine('line-1'),
        createFlexibleLine('line-2'),
      ];
      const params: Params = { id: 'non-existent' };

      const result = getFlexibleLineFromPath(lines, params);

      expect(result).toBeUndefined();
    });

    it('should return undefined for an empty lines array', () => {
      const lines: FlexibleLine[] = [];
      const params: Params = { id: 'line-1' };

      const result = getFlexibleLineFromPath(lines, params);

      expect(result).toBeUndefined();
    });

    it('should return undefined when params.id is undefined', () => {
      const lines: FlexibleLine[] = [createFlexibleLine('line-1')];
      const params: Params = {};

      const result = getFlexibleLineFromPath(lines, params);

      expect(result).toBeUndefined();
    });

    it('should return the first match when multiple lines have the same id', () => {
      const line1: FlexibleLine = {
        id: 'same-id',
        name: 'First',
        journeyPatterns: [],
      };
      const line2: FlexibleLine = {
        id: 'same-id',
        name: 'Second',
        journeyPatterns: [],
      };
      const lines: FlexibleLine[] = [line1, line2];
      const params: Params = { id: 'same-id' };

      const result = getFlexibleLineFromPath(lines, params);

      expect(result?.name).toBe('First');
    });

    it('should handle lines with undefined id', () => {
      const lineWithNoId: FlexibleLine = { name: 'No ID', journeyPatterns: [] };
      const lineWithId: FlexibleLine = {
        id: 'has-id',
        name: 'Has ID',
        journeyPatterns: [],
      };
      const lines: FlexibleLine[] = [lineWithNoId, lineWithId];
      const params: Params = { id: 'has-id' };

      const result = getFlexibleLineFromPath(lines, params);

      expect(result?.name).toBe('Has ID');
    });
  });
});
