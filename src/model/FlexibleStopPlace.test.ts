import { describe, it, expect } from 'vitest';
import { mapFlexibleAreasToArea } from './FlexibleStopPlace';
import FlexibleStopPlace from './FlexibleStopPlace';
import FlexibleArea from './FlexibleArea';

describe('mapFlexibleAreasToArea', () => {
  describe('when flexibleAreas is empty or undefined', () => {
    it('returns original object when flexibleAreas is undefined', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result).toBe(stopPlace);
      expect(result).not.toHaveProperty('flexibleArea');
    });

    it('returns original object when flexibleAreas is empty array', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
        flexibleAreas: [],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result).toBe(stopPlace);
      expect(result).not.toHaveProperty('flexibleArea');
    });
  });

  describe('when flexibleAreas has elements', () => {
    it('maps first area when flexibleAreas has one element', () => {
      const area: FlexibleArea = {
        id: 'TST:FlexibleArea:1',
        name: 'Area 1',
      };
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
        flexibleAreas: [area],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.flexibleArea).toBe(area);
    });

    it('maps first area when flexibleAreas has multiple elements', () => {
      const area1: FlexibleArea = { id: 'TST:FlexibleArea:1', name: 'Area 1' };
      const area2: FlexibleArea = { id: 'TST:FlexibleArea:2', name: 'Area 2' };
      const area3: FlexibleArea = { id: 'TST:FlexibleArea:3', name: 'Area 3' };
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
        flexibleAreas: [area1, area2, area3],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.flexibleArea).toBe(area1);
    });
  });

  describe('property preservation', () => {
    it('preserves name property', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop Place',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.name).toBe('Test Stop Place');
    });

    it('preserves description property', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        description: 'A test description',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.description).toBe('A test description');
    });

    it('preserves privateCode property', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        privateCode: 'PRIV-001',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.privateCode).toBe('PRIV-001');
    });

    it('preserves transportMode property', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        transportMode: 'bus',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.transportMode).toBe('bus');
    });

    it('preserves id property', () => {
      const stopPlace: FlexibleStopPlace = {
        id: 'TST:FlexibleStopPlace:1',
        name: 'Test',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.id).toBe('TST:FlexibleStopPlace:1');
    });

    it('preserves keyValues property', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        keyValues: [{ key: 'testKey', values: ['value1'] }],
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.keyValues).toEqual([
        { key: 'testKey', values: ['value1'] },
      ]);
    });

    it('preserves flexibleAreas property in returned object', () => {
      const areas: FlexibleArea[] = [{ id: 'TST:FlexibleArea:1' }];
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        flexibleAreas: areas,
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result.flexibleAreas).toBe(areas);
    });
  });

  describe('immutability', () => {
    it('does not mutate the original object when mapping', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      mapFlexibleAreasToArea(stopPlace);

      expect(stopPlace).not.toHaveProperty('flexibleArea');
    });

    it('returns a new object when flexibleAreas has elements', () => {
      const stopPlace: FlexibleStopPlace = {
        name: 'Test Stop',
        flexibleAreas: [{ id: 'TST:FlexibleArea:1' }],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result).not.toBe(stopPlace);
    });
  });

  describe('edge cases', () => {
    it('handles FlexibleStopPlace that already has flexibleArea', () => {
      const existingArea: FlexibleArea = { id: 'TST:FlexibleArea:existing' };
      const newArea: FlexibleArea = { id: 'TST:FlexibleArea:new' };
      const stopPlace: FlexibleStopPlace = {
        name: 'Test',
        flexibleArea: existingArea,
        flexibleAreas: [newArea],
      };

      const result = mapFlexibleAreasToArea(stopPlace);

      // The new area should overwrite the existing one
      expect(result.flexibleArea).toBe(newArea);
    });

    it('handles minimal FlexibleStopPlace', () => {
      const stopPlace: FlexibleStopPlace = {};

      const result = mapFlexibleAreasToArea(stopPlace);

      expect(result).toBe(stopPlace);
    });
  });
});
