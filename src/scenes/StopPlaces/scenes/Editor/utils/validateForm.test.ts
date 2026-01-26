import { describe, it, expect } from 'vitest';
import {
  validateFlexibleStopPlace,
  validateFlexibleStopPlaceType,
  FlexibleStopPlaceErrors,
} from './validateForm';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { KeyValues } from 'model/KeyValues';
import { FLEXIBLE_STOP_AREA_TYPE } from 'model/enums';

describe('validateForm', () => {
  describe('validateFlexibleStopPlace', () => {
    describe('name validation', () => {
      it('should return name error for undefined name', () => {
        const stopPlace: FlexibleStopPlace = {};
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBe('validateFormErrorNameEmpty');
      });

      it('should return name error for empty string name', () => {
        const stopPlace: FlexibleStopPlace = { name: '' };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBe('validateFormErrorNameEmpty');
      });

      it('should return name error for whitespace-only name', () => {
        const stopPlace: FlexibleStopPlace = { name: '   ' };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBe('validateFormErrorNameEmpty');
      });

      it('should not return name error for valid name', () => {
        const stopPlace: FlexibleStopPlace = { name: 'Valid Name' };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBeUndefined();
      });
    });

    describe('flexibleArea polygon validation', () => {
      it('should return flexibleArea error when polygon has no coordinates', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [{ polygon: { coordinates: [] } }],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBe(
          'validateFormErrorFlexibleAreaNotEnoughPolygons',
        );
      });

      it('should return flexibleArea error when polygon has fewer than 4 coordinates', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
              },
            },
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBe(
          'validateFormErrorFlexibleAreaNotEnoughPolygons',
        );
      });

      it('should not return flexibleArea error when polygon has exactly 4 coordinates', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [0, 0],
                ],
              },
            },
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBeUndefined();
      });

      it('should not return flexibleArea error when polygon has more than 4 coordinates', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [3, 3],
                  [0, 0],
                ],
              },
            },
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBeUndefined();
      });

      it('should return flexibleArea error if any area has insufficient coordinates', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [0, 0],
                ],
              },
            }, // valid
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                ],
              },
            }, // invalid
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBe(
          'validateFormErrorFlexibleAreaNotEnoughPolygons',
        );
      });

      it('should not return flexibleArea error when flexibleAreas is undefined', () => {
        const stopPlace: FlexibleStopPlace = { name: 'Test' };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBeUndefined();
      });

      it('should not return flexibleArea error when flexibleAreas is empty array', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBeUndefined();
      });

      it('should return flexibleArea error when polygon is undefined', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          flexibleAreas: [{}],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleArea).toBe(
          'validateFormErrorFlexibleAreaNotEnoughPolygons',
        );
      });
    });

    describe('flexibleStopPlaceType validation', () => {
      const validTypeKeyValues: KeyValues[] = [
        {
          key: 'FlexibleStopAreaType',
          values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
        },
      ];

      it('should not return type error when stop place has valid type', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          keyValues: validTypeKeyValues,
          flexibleAreas: [{ keyValues: undefined }],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleStopPlaceType).toBeUndefined();
      });

      it('should not return type error when all areas have valid type', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          keyValues: undefined,
          flexibleAreas: [
            { keyValues: validTypeKeyValues },
            { keyValues: validTypeKeyValues },
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleStopPlaceType).toBeUndefined();
      });

      it('should return type error when stop place and some areas lack valid type', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          keyValues: undefined,
          flexibleAreas: [
            { keyValues: validTypeKeyValues },
            { keyValues: undefined },
          ],
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleStopPlaceType).toBe(
          'validateFormErrorFlexibleStopPlaceType',
        );
      });

      it('should not return type error when no flexibleAreas exist', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Test',
          keyValues: undefined,
          flexibleAreas: undefined,
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.flexibleStopPlaceType).toBeUndefined();
      });
    });

    describe('combined validation', () => {
      it('should return all errors for completely invalid stop place', () => {
        const stopPlace: FlexibleStopPlace = {
          name: '',
          flexibleAreas: [
            { polygon: { coordinates: [[0, 0]] }, keyValues: undefined },
          ],
          keyValues: undefined,
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBe('validateFormErrorNameEmpty');
        expect(errors.flexibleArea).toBe(
          'validateFormErrorFlexibleAreaNotEnoughPolygons',
        );
        expect(errors.flexibleStopPlaceType).toBe(
          'validateFormErrorFlexibleStopPlaceType',
        );
      });

      it('should return no errors for fully valid stop place', () => {
        const stopPlace: FlexibleStopPlace = {
          name: 'Valid Stop Place',
          flexibleAreas: [
            {
              polygon: {
                coordinates: [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [0, 0],
                ],
              },
              keyValues: [
                {
                  key: 'FlexibleStopAreaType',
                  values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
                },
              ],
            },
          ],
          keyValues: undefined,
        };
        const errors = validateFlexibleStopPlace(stopPlace);
        expect(errors.name).toBeUndefined();
        expect(errors.flexibleArea).toBeUndefined();
        expect(errors.flexibleStopPlaceType).toBeUndefined();
      });
    });
  });

  describe('validateFlexibleStopPlaceType', () => {
    it('should return true for valid UnrestrictedRoadNetwork type', () => {
      const keyValues: KeyValues[] = [
        {
          key: 'FlexibleStopAreaType',
          values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
        },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(true);
    });

    it('should return true for valid UnrestrictedPublicTransportAreas type', () => {
      const keyValues: KeyValues[] = [
        {
          key: 'FlexibleStopAreaType',
          values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_PUBLIC_TRANSPORT_AREAS],
        },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(true);
    });

    it('should return false for undefined keyValues', () => {
      expect(validateFlexibleStopPlaceType({ keyValues: undefined })).toBe(
        false,
      );
    });

    it('should return false for empty keyValues array', () => {
      expect(validateFlexibleStopPlaceType({ keyValues: [] })).toBe(false);
    });

    it('should return false when FlexibleStopAreaType key is missing', () => {
      const keyValues: KeyValues[] = [
        { key: 'SomeOtherKey', values: ['value'] },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(false);
    });

    it('should return false when values array is empty', () => {
      const keyValues: KeyValues[] = [
        { key: 'FlexibleStopAreaType', values: [] },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(false);
    });

    it('should return false when values array has multiple values', () => {
      const keyValues: KeyValues[] = [
        {
          key: 'FlexibleStopAreaType',
          values: [
            FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK,
            FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_PUBLIC_TRANSPORT_AREAS,
          ],
        },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(false);
    });

    it('should return false for invalid type value', () => {
      const keyValues: KeyValues[] = [
        { key: 'FlexibleStopAreaType', values: ['InvalidType'] },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(false);
    });

    it('should return true when FlexibleStopAreaType is among other key values', () => {
      const keyValues: KeyValues[] = [
        { key: 'SomeOtherKey', values: ['value'] },
        {
          key: 'FlexibleStopAreaType',
          values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
        },
        { key: 'AnotherKey', values: ['another'] },
      ];
      expect(validateFlexibleStopPlaceType({ keyValues })).toBe(true);
    });
  });
});
