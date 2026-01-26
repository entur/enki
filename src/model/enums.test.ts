import { describe, it, expect } from 'vitest';
import {
  mapLineModeToStopPlaceMode,
  VEHICLE_MODE,
  TAXI_SUBMODE,
} from './enums';

describe('mapLineModeToStopPlaceMode', () => {
  describe('undefined handling', () => {
    it('returns undefined when transportMode is undefined', () => {
      const result = mapLineModeToStopPlaceMode(undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined when transportMode is undefined with submode', () => {
      const result = mapLineModeToStopPlaceMode(
        undefined,
        TAXI_SUBMODE.WATER_TAXI,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('TAXI mode mapping', () => {
    it('returns WATER when TAXI mode with WATER_TAXI submode', () => {
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.TAXI,
        TAXI_SUBMODE.WATER_TAXI,
      );
      expect(result).toBe(VEHICLE_MODE.WATER);
    });

    it('returns BUS when TAXI mode with CHARTER_TAXI submode', () => {
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.TAXI,
        TAXI_SUBMODE.CHARTER_TAXI,
      );
      expect(result).toBe(VEHICLE_MODE.BUS);
    });

    it('returns BUS when TAXI mode with COMMUNAL_TAXI submode', () => {
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.TAXI,
        TAXI_SUBMODE.COMMUNAL_TAXI,
      );
      expect(result).toBe(VEHICLE_MODE.BUS);
    });

    it('returns BUS when TAXI mode with no submode', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.TAXI);
      expect(result).toBe(VEHICLE_MODE.BUS);
    });

    it('returns BUS when TAXI mode with undefined submode', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.TAXI, undefined);
      expect(result).toBe(VEHICLE_MODE.BUS);
    });
  });

  describe('COACH mode mapping', () => {
    it('returns BUS when COACH mode', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.COACH);
      expect(result).toBe(VEHICLE_MODE.BUS);
    });

    it('returns BUS when COACH mode with any submode', () => {
      // Using a COACH submode from the enum (internationalCoach)
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.COACH,
        'internationalCoach' as any,
      );
      expect(result).toBe(VEHICLE_MODE.BUS);
    });
  });

  describe('passthrough modes', () => {
    it('returns BUS when transportMode is BUS', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.BUS);
      expect(result).toBe(VEHICLE_MODE.BUS);
    });

    it('returns RAIL when transportMode is RAIL', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.RAIL);
      expect(result).toBe(VEHICLE_MODE.RAIL);
    });

    it('returns TRAM when transportMode is TRAM', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.TRAM);
      expect(result).toBe(VEHICLE_MODE.TRAM);
    });

    it('returns WATER when transportMode is WATER', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.WATER);
      expect(result).toBe(VEHICLE_MODE.WATER);
    });

    it('returns METRO when transportMode is METRO', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.METRO);
      expect(result).toBe(VEHICLE_MODE.METRO);
    });

    it('returns AIR when transportMode is AIR', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.AIR);
      expect(result).toBe(VEHICLE_MODE.AIR);
    });

    it('returns CABLEWAY when transportMode is CABLEWAY', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.CABLEWAY);
      expect(result).toBe(VEHICLE_MODE.CABLEWAY);
    });

    it('returns FUNICULAR when transportMode is FUNICULAR', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.FUNICULAR);
      expect(result).toBe(VEHICLE_MODE.FUNICULAR);
    });

    it('returns SNOW_AND_ICE when transportMode is SNOW_AND_ICE', () => {
      const result = mapLineModeToStopPlaceMode(VEHICLE_MODE.SNOW_AND_ICE);
      expect(result).toBe(VEHICLE_MODE.SNOW_AND_ICE);
    });
  });

  describe('submodes on passthrough modes', () => {
    it('returns WATER when WATER mode with any submode', () => {
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.WATER,
        'localCarFerry' as any,
      );
      expect(result).toBe(VEHICLE_MODE.WATER);
    });

    it('returns BUS when BUS mode with any submode', () => {
      const result = mapLineModeToStopPlaceMode(
        VEHICLE_MODE.BUS,
        'expressBus' as any,
      );
      expect(result).toBe(VEHICLE_MODE.BUS);
    });
  });
});
