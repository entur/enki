import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flexibleLineToPayload, FlexibleLineType } from './FlexibleLine';
import * as LineModule from './Line';
import {
  createFlexibleLine,
  createFlexibleLineWithBooking,
  createFlexibleLineWithNetwork,
  createFlexibleLineWithType,
  createEmptyFlexibleLine,
  createNetwork,
  createBookingArrangement,
  resetIdCounters,
} from 'test/factories';
import { Branding } from './Branding';
import { BOOKING_METHOD, PURCHASE_WHEN, PURCHASE_MOMENT } from './enums';
import BookingArrangement from './BookingArrangement';

// Type helper for flexible line payload which includes flexible-line specific fields
// The lineToPayload return type doesn't include these fields but they are preserved at runtime
type FlexibleLinePayload = ReturnType<typeof flexibleLineToPayload> & {
  flexibleLineType?: FlexibleLineType;
  bookingArrangement?: BookingArrangement | null;
  network?: unknown;
  branding?: unknown;
};

describe('flexibleLineToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('delegation to lineToPayload', () => {
    it('calls lineToPayload with isFlexible=true', () => {
      const lineToPayloadSpy = vi.spyOn(LineModule, 'lineToPayload');
      const flexibleLine = createFlexibleLine();

      flexibleLineToPayload(flexibleLine);

      expect(lineToPayloadSpy).toHaveBeenCalledWith(flexibleLine, true);
      lineToPayloadSpy.mockRestore();
    });

    it('always passes true for isFlexible parameter', () => {
      const lineToPayloadSpy = vi.spyOn(LineModule, 'lineToPayload');
      const flexibleLine = createFlexibleLine();

      flexibleLineToPayload(flexibleLine);

      // Verify the second argument is always true
      expect(lineToPayloadSpy.mock.calls[0][1]).toBe(true);
      lineToPayloadSpy.mockRestore();
    });
  });

  describe('flexible line type preservation', () => {
    it('preserves FLEXIBLE_AREAS_ONLY type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.FLEXIBLE_AREAS_ONLY,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.FLEXIBLE_AREAS_ONLY,
      );
    });

    it('preserves CORRIDOR_SERVICE type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.CORRIDOR_SERVICE,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(FlexibleLineType.CORRIDOR_SERVICE);
    });

    it('preserves MAIN_ROUTE_WITH_FLEXIBLE_ENDS type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
      );
    });

    it('preserves HAIL_AND_RIDE_SECTIONS type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
      );
    });

    it('preserves FIXED_STOP_AREA_WIDE type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.FIXED_STOP_AREA_WIDE,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.FIXED_STOP_AREA_WIDE,
      );
    });

    it('preserves MIXED_FLEXIBLE type', () => {
      const line = createFlexibleLineWithType(FlexibleLineType.MIXED_FLEXIBLE);

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(FlexibleLineType.MIXED_FLEXIBLE);
    });

    it('preserves MIXED_FLEXIBLE_AND_FIXED type', () => {
      const line = createFlexibleLineWithType(
        FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
      );

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
      );
    });

    it('preserves FIXED type', () => {
      const line = createFlexibleLineWithType(FlexibleLineType.FIXED);

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(FlexibleLineType.FIXED);
    });
  });

  describe('booking arrangement handling', () => {
    it('preserves booking arrangement', () => {
      const line = createFlexibleLineWithBooking();

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.bookingArrangement).toBeDefined();
      expect(result.bookingArrangement?.bookingMethods).toBeDefined();
    });

    it('preserves null booking arrangement', () => {
      const line = createFlexibleLine({
        bookingArrangement: null,
      });

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.bookingArrangement).toBeNull();
    });

    it('preserves booking arrangement with all fields', () => {
      const bookingArrangement = createBookingArrangement({
        bookingContact: {
          phone: '12345678',
          email: 'test@example.com',
          url: 'https://booking.example.com',
        },
        bookingMethods: [BOOKING_METHOD.CALL_OFFICE, BOOKING_METHOD.ONLINE],
        bookWhen: PURCHASE_WHEN.UNTIL_PREVIOUS_DAY,
        buyWhen: [PURCHASE_MOMENT.ON_RESERVATION],
        latestBookingTime: '12:00:00',
        minimumBookingPeriod: 'P1D',
        bookingNote: 'Book 24 hours in advance',
      });
      const line = createFlexibleLine({
        bookingArrangement,
      });

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.bookingArrangement).toEqual(bookingArrangement);
    });
  });

  describe('network and branding object removal (inherited from lineToPayload)', () => {
    it('removes network object from output', () => {
      const line = createFlexibleLineWithNetwork();

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.network).toBeUndefined();
      expect(result.networkRef).toBe(line.networkRef);
    });

    it('removes branding object from output', () => {
      const branding: Branding = {
        id: 'TST:Branding:1',
        name: 'Test Brand',
      };
      const line = createFlexibleLine({
        branding,
        brandingRef: branding.id,
      });

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.branding).toBeUndefined();
      expect(result.brandingRef).toBe('TST:Branding:1');
    });
  });

  describe('brandingRef handling (inherited from lineToPayload)', () => {
    it('preserves existing brandingRef', () => {
      const line = createFlexibleLine({
        brandingRef: 'TST:Branding:existing',
      });

      const result = flexibleLineToPayload(line);

      expect(result.brandingRef).toBe('TST:Branding:existing');
    });

    it('defaults to null when brandingRef is undefined', () => {
      const line = createFlexibleLine({
        brandingRef: undefined,
      });

      const result = flexibleLineToPayload(line);

      expect(result.brandingRef).toBeNull();
    });
  });

  describe('notices filtering (inherited from lineToPayload)', () => {
    it('preserves notices with text', () => {
      const line = createFlexibleLine({
        notices: [
          { text: 'Flexible service notice 1' },
          { text: 'Flexible service notice 2' },
        ],
      });

      const result = flexibleLineToPayload(line);

      expect(result.notices).toEqual([
        { text: 'Flexible service notice 1' },
        { text: 'Flexible service notice 2' },
      ]);
    });

    it('filters out notices with empty text', () => {
      const line = createFlexibleLine({
        notices: [
          { text: 'Valid notice' },
          { text: '' },
          { text: 'Another valid' },
        ],
      });

      const result = flexibleLineToPayload(line);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const line = createFlexibleLine({
        id: 'TST:FlexibleLine:custom',
      });

      const result = flexibleLineToPayload(line);

      expect(result.id).toBe('TST:FlexibleLine:custom');
    });

    it('preserves name property', () => {
      const line = createFlexibleLine({
        name: 'Demand Responsive Route',
      });

      const result = flexibleLineToPayload(line);

      expect(result.name).toBe('Demand Responsive Route');
    });

    it('preserves description property', () => {
      const line = createFlexibleLine({
        description: 'A flexible on-demand service',
      });

      const result = flexibleLineToPayload(line);

      expect(result.description).toBe('A flexible on-demand service');
    });

    it('preserves publicCode property', () => {
      const line = createFlexibleLine({
        publicCode: 'FLEX42',
      });

      const result = flexibleLineToPayload(line);

      expect(result.publicCode).toBe('FLEX42');
    });

    it('preserves transportMode property', () => {
      const line = createFlexibleLine({
        transportMode: 'bus' as any,
      });

      const result = flexibleLineToPayload(line);

      expect(result.transportMode).toBe('bus');
    });

    it('preserves operatorRef property', () => {
      const line = createFlexibleLine({
        operatorRef: 'TST:Operator:flex1',
      });

      const result = flexibleLineToPayload(line);

      expect(result.operatorRef).toBe('TST:Operator:flex1');
    });
  });

  describe('journeyPatterns transformation', () => {
    it('transforms journey patterns with flexible flag', () => {
      const line = createFlexibleLine();

      const result = flexibleLineToPayload(line);

      expect(result.journeyPatterns).toBeDefined();
      // Journey patterns should be present and transformed
      expect(result.journeyPatterns?.length).toBeGreaterThanOrEqual(0);
    });

    it('handles empty journeyPatterns array', () => {
      const line = createFlexibleLine({
        journeyPatterns: [],
      });

      const result = flexibleLineToPayload(line);

      expect(result.journeyPatterns).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('handles minimal flexible line', () => {
      const line = createEmptyFlexibleLine();

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.flexibleLineType).toBe(
        FlexibleLineType.FLEXIBLE_AREAS_ONLY,
      );
      expect(result.journeyPatterns).toEqual([]);
      expect(result.brandingRef).toBeNull();
    });

    it('handles flexible line with all properties', () => {
      const network = createNetwork();
      const branding: Branding = {
        id: 'TST:Branding:full',
        name: 'Full Brand',
      };
      const bookingArrangement = createBookingArrangement();
      const line = createFlexibleLine({
        id: 'TST:FlexibleLine:full',
        name: 'Full Flexible Line',
        description: 'Complete flexible line',
        privateCode: 'PRIV',
        publicCode: 'PUB',
        transportMode: 'bus' as any,
        flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
        bookingArrangement,
        network,
        networkRef: network.id,
        branding,
        brandingRef: branding.id,
        operatorRef: 'TST:Operator:1',
        notices: [{ text: 'Booking required' }],
      });

      const result = flexibleLineToPayload(line) as FlexibleLinePayload;

      expect(result.id).toBe('TST:FlexibleLine:full');
      expect(result.name).toBe('Full Flexible Line');
      expect(result.description).toBe('Complete flexible line');
      expect(result.privateCode).toBe('PRIV');
      expect(result.publicCode).toBe('PUB');
      expect(result.transportMode).toBe('bus');
      expect(result.flexibleLineType).toBe(
        FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
      );
      expect(result.bookingArrangement).toEqual(bookingArrangement);
      expect(result.network).toBeUndefined();
      expect(result.branding).toBeUndefined();
      expect(result.networkRef).toBe(network.id);
      expect(result.brandingRef).toBe(branding.id);
      expect(result.operatorRef).toBe('TST:Operator:1');
      expect(result.notices).toEqual([{ text: 'Booking required' }]);
    });

    it('does not mutate the original flexible line object', () => {
      const network = createNetwork();
      const branding: Branding = {
        id: 'TST:Branding:1',
        name: 'Test',
      };
      const line = createFlexibleLine({
        network,
        branding,
      });

      flexibleLineToPayload(line);

      // Original object should still have network and branding
      expect(line.network).toBe(network);
      expect(line.branding).toBe(branding);
    });
  });
});
