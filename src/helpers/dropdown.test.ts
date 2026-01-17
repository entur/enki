import {
  getInit,
  mapToItems,
  getEnumInit,
  mapEnumToItems,
  mapVehicleModeAndLabelToItems,
  mapVehicleSubmodeAndLabelToItems,
  mapFlexibleLineTypeAndLabelToItems,
} from './dropdown';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  vehicleModeMessages,
  vehicleSubmodeMessages,
} from '../model/enums';
import { FlexibleLineType } from 'model/FlexibleLine';

// Mock formatMessage function for i18n-dependent tests
const mockFormatMessage = (descriptor: { id: string }) =>
  `translated_${descriptor.id}`;

describe('dropdown', () => {
  describe('getInit', () => {
    const items = [
      { id: '1', name: 'First Item' },
      { id: '2', name: 'Second Item' },
    ];

    it('should return matching item as NormalizedDropdownItemType', () => {
      expect(getInit(items, '1')).toEqual({
        value: '1',
        label: 'First Item',
      });
    });

    it('should return null when init is undefined', () => {
      expect(getInit(items, undefined)).toBeNull();
    });

    it('should return null when init is null', () => {
      expect(getInit(items, null)).toBeNull();
    });

    it('should return null when no matching item found', () => {
      expect(getInit(items, 'non-existent')).toBeNull();
    });

    it('should handle items with undefined id and name', () => {
      const itemsWithUndefined = [{ id: undefined, name: undefined }];
      expect(getInit(itemsWithUndefined, undefined)).toEqual({
        value: '',
        label: '',
      });
    });
  });

  describe('mapToItems', () => {
    it('should map items to NormalizedDropdownItemType array', () => {
      const items = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ];
      expect(mapToItems(items)).toEqual([
        { value: '1', label: 'First' },
        { value: '2', label: 'Second' },
      ]);
    });

    it('should return empty array for empty input', () => {
      expect(mapToItems([])).toEqual([]);
    });

    it('should handle items with undefined id and name', () => {
      const items = [{ id: undefined, name: undefined }];
      expect(mapToItems(items)).toEqual([{ value: '', label: '' }]);
    });
  });

  describe('getEnumInit', () => {
    it('should return NormalizedDropdownItemType for enum value', () => {
      expect(getEnumInit(VEHICLE_MODE.BUS)).toEqual({
        value: 'bus',
        label: 'bus',
      });
    });

    it('should return null when init is undefined', () => {
      expect(getEnumInit(undefined)).toBeNull();
    });

    it('should handle string values', () => {
      expect(getEnumInit('custom')).toEqual({
        value: 'custom',
        label: 'custom',
      });
    });
  });

  describe('mapEnumToItems', () => {
    it('should map enum values to NormalizedDropdownItemType array', () => {
      enum TestEnum {
        A = 'value_a',
        B = 'value_b',
      }
      expect(mapEnumToItems(TestEnum)).toEqual([
        { value: 'value_a', label: 'value_a' },
        { value: 'value_b', label: 'value_b' },
      ]);
    });

    it('should handle empty object', () => {
      expect(mapEnumToItems({})).toEqual([]);
    });
  });

  describe('mapVehicleModeAndLabelToItems', () => {
    it('should map vehicle modes with translated labels', () => {
      const result = mapVehicleModeAndLabelToItems(
        vehicleModeMessages,
        mockFormatMessage,
      );

      expect(result).toContainEqual({
        value: VEHICLE_MODE.BUS,
        label: 'translated_bus',
      });
      expect(result.length).toBe(Object.keys(vehicleModeMessages).length);
    });
  });

  describe('mapVehicleSubmodeAndLabelToItems', () => {
    it('should map vehicle submodes with translated labels', () => {
      const submodes: VEHICLE_SUBMODE[] = ['localBus', 'expressBus'];
      const result = mapVehicleSubmodeAndLabelToItems(
        submodes,
        mockFormatMessage,
      );

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        value: 'localBus',
        label: `translated_${vehicleSubmodeMessages['localBus']}`,
      });
      expect(result).toContainEqual({
        value: 'expressBus',
        label: `translated_${vehicleSubmodeMessages['expressBus']}`,
      });
    });

    it('should return empty array for empty input', () => {
      const result = mapVehicleSubmodeAndLabelToItems([], mockFormatMessage);
      expect(result).toEqual([]);
    });
  });

  describe('mapFlexibleLineTypeAndLabelToItems', () => {
    it('should map flexible line types with translated labels', () => {
      const types = [
        FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        FlexibleLineType.FIXED,
      ];
      const result = mapFlexibleLineTypeAndLabelToItems(
        types,
        mockFormatMessage,
      );

      expect(result).toEqual([
        {
          value: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          label: 'translated_flexibleLineType_flexibleAreasOnly',
        },
        {
          value: FlexibleLineType.FIXED,
          label: 'translated_flexibleLineType_fixed',
        },
      ]);
    });

    it('should return empty array for empty input', () => {
      const result = mapFlexibleLineTypeAndLabelToItems([], mockFormatMessage);
      expect(result).toEqual([]);
    });
  });
});
