import { describe, it, expect, beforeEach } from 'vitest';
import { IntlShape } from 'react-intl';
import {
  resetIdCounters,
  createPassingTime,
  createFirstStopPoint,
  createLastStopPoint,
  createStopPointSequence,
  createFlexibleStopPoint,
  createFlexibleStopPointSequence,
  createFirstStopPassingTime,
  createLastStopPassingTime,
  createPassingTimeSequence,
  createDayType,
  createWeekendDayType,
  createDayTypeAssignment,
  createServiceJourney,
  createServiceJourneyWithPassingTimes,
  createServiceJourneyWithDayTypes,
  createJourneyPattern,
  createFlexibleJourneyPattern,
  createEmptyJourneyPattern,
  createMinimalJourneyPattern,
  createLine,
  createLineWithNetwork,
  createFlexibleLine,
  createFlexibleLineWithNetwork,
  createFlexibleLineWithType,
  createEmptyLine,
  createEmptyFlexibleLine,
} from 'test/factories';
import { FlexibleLineType } from 'model/FlexibleLine';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import {
  validateServiceJourney,
  validServiceJourneys,
  validJourneyPattern,
  validFlexibleLineJourneyPattern,
  aboutLineStepIsValid,
  aboutFlexibleLineStepIsValid,
  getMaxAllowedStepIndex,
  getMaxAllowedFlexibleLineStepIndex,
  currentStepIsValid,
  currentFlexibleLineStepIsValid,
  validLine,
  validFlexibleLine,
} from './line';

/**
 * Mock IntlShape that returns the message key as the formatted message.
 * This allows tests to verify which error message key was returned.
 */
const mockIntl: IntlShape = {
  formatMessage: ({ id }: { id: string }) => id,
} as IntlShape;

describe('line validation', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('validateServiceJourney', () => {
    describe('name validation', () => {
      it('returns false when name is null', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: null as any,
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when name is empty string', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: '   ',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when name is provided', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: 'Morning Express',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('passing times validation', () => {
      it('returns false when passingTimes is undefined', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: undefined,
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when passingTimes is empty', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when only one passing time (need at least 2)', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [createFirstStopPassingTime('09:00:00')],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when passing times have invalid ordering', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [
            createFirstStopPassingTime('10:00:00'),
            createLastStopPassingTime('09:00:00'),
          ],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when passing times are valid', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(3),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('dayTypes validation', () => {
      it('returns false when dayTypes is undefined', () => {
        const sj = createServiceJourney({
          dayTypes: undefined,
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when dayTypes is empty array', () => {
        const sj = createServiceJourney({
          dayTypes: [],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when first dayType has empty daysOfWeek', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType({ daysOfWeek: [] })],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when first dayType has null daysOfWeek', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType({ daysOfWeek: null as any })],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when dayType has invalid date range', () => {
        const sj = createServiceJourney({
          dayTypes: [
            createDayType({
              dayTypeAssignments: [
                createDayTypeAssignment({
                  operatingPeriod: {
                    fromDate: 'invalid-date',
                    toDate: '2024-12-31',
                  },
                }),
              ],
            }),
          ],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when dayType is valid with daysOfWeek set', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('returns true when multiple dayTypes are valid', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType(), createWeekendDayType()],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('validDayTimes check (first dayType daysOfWeek)', () => {
      it('returns false when first dayType has no daysOfWeek but subsequent ones do', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType({ daysOfWeek: [] }), createDayType()],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when first dayType has daysOfWeek', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType()],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid service journey', () => {
        const sj = createServiceJourneyWithPassingTimes(4);
        sj.dayTypes = [createDayType()];
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('returns false when multiple validation rules fail', () => {
        const sj = createServiceJourney({
          name: '',
          dayTypes: [],
          passingTimes: [],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('validates with weekend day type', () => {
        const sj = createServiceJourney({
          name: 'Weekend Service',
          dayTypes: [createWeekendDayType()],
          passingTimes: createPassingTimeSequence(3),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('validates overnight service journey', () => {
        const sj = createServiceJourney({
          name: 'Night Service',
          dayTypes: [createDayType()],
          passingTimes: [
            createFirstStopPassingTime('23:00:00'),
            createPassingTime({
              arrivalTime: '00:30:00',
              departureTime: '00:35:00',
              arrivalDayOffset: 1,
              departureDayOffset: 1,
            }),
            createPassingTime({
              arrivalTime: '01:00:00',
              arrivalDayOffset: 1,
              departureTime: null,
            }),
          ],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });
  });

  describe('validServiceJourneys', () => {
    describe('undefined/empty input handling', () => {
      it('returns false when serviceJourneys is undefined', () => {
        expect(validServiceJourneys(undefined, mockIntl)).toBe(false);
      });

      it('returns true when serviceJourneys is empty array (vacuous truth)', () => {
        expect(validServiceJourneys([], mockIntl)).toBe(true);
      });
    });

    describe('array validation', () => {
      it('returns true when all service journeys are valid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Morning',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Afternoon',
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });

      it('returns false when any service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Valid Journey',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });

      it('returns false when first service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });

      it('returns false when last service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Also Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourney({
            name: 'Invalid - no dayTypes',
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });
    });

    describe('single service journey', () => {
      it('returns true for single valid service journey', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });

      it('returns false for single invalid service journey', () => {
        const sjs = [
          createServiceJourney({
            name: 'Missing Day Types',
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });
    });

    describe('mixed day types', () => {
      it('validates journeys with different day types', () => {
        const sjs = [
          createServiceJourney({
            name: 'Weekday Service',
            dayTypes: [createDayType()],
            passingTimes: createPassingTimeSequence(3),
          }),
          createServiceJourney({
            name: 'Weekend Service',
            dayTypes: [createWeekendDayType()],
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });
    });
  });

  describe('validJourneyPattern', () => {
    describe('undefined/null input handling', () => {
      it('returns false when journeyPattern is undefined', () => {
        expect(validJourneyPattern(undefined)).toBe(false);
      });

      it('returns false when journeyPattern is null', () => {
        expect(validJourneyPattern(null as any)).toBe(false);
      });
    });

    describe('name validation', () => {
      it('returns false when name is blank/empty', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const jp = createJourneyPattern({ name: '   ' });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when name is null', () => {
        const jp = createJourneyPattern({ name: null as any });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns true when name is provided', () => {
        const jp = createJourneyPattern({ name: 'Route A' });
        expect(validJourneyPattern(jp)).toBe(true);
      });
    });

    describe('stop points validation', () => {
      it('returns false when pointsInSequence is null/empty (coerced to empty array)', () => {
        const jp = createJourneyPattern({
          pointsInSequence: null as any,
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when pointsInSequence is empty array', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when only 1 stop point (need at least 2)', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when stop points have validation errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, {
              quayRef: null,
              flexibleStopPlaceRef: null,
            }),
            createLastStopPoint(),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns true when stop points are valid', () => {
        const jp = createJourneyPattern({
          pointsInSequence: createStopPointSequence(3),
        });
        expect(validJourneyPattern(jp)).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('returns true for default journey pattern from factory', () => {
        const jp = createJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('returns true for minimal journey pattern (2 stops)', () => {
        const jp = createMinimalJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('returns false for empty journey pattern', () => {
        const jp = createEmptyJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when both name and stop points are invalid', () => {
        const jp = createJourneyPattern({
          name: '',
          pointsInSequence: [],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('validates journey pattern with many stops', () => {
        const jp = createJourneyPattern({
          pointsInSequence: createStopPointSequence(10),
        });
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('validates journey pattern with first stop boarding errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, {
              forBoarding: false,
            }),
            createLastStopPoint(),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('validates journey pattern with last stop alighting errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(),
            createLastStopPoint(undefined, {
              forAlighting: false,
            }),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });
    });
  });

  describe('validFlexibleLineJourneyPattern', () => {
    describe('FLEXIBLE_AREAS_ONLY type', () => {
      it('returns false when journeyPattern is undefined', () => {
        expect(
          validFlexibleLineJourneyPattern(
            undefined,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when name is blank', () => {
        const jp = createFlexibleJourneyPattern(3, { name: '' });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when flexible stop point has no flexibleStopPlaceRef', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              flexibleStopPlaceRef: null,
              destinationDisplay: { frontText: 'Destination' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when first flexible stop has no frontText', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              destinationDisplay: { frontText: '' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns true for valid flexible journey pattern', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              destinationDisplay: { frontText: 'Flexible Area' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(true);
      });

      it('returns true with multiple flexible stops', () => {
        const stops = createFlexibleStopPointSequence(4);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Multi-stop Flexible' },
        };

        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(true);
      });
    });

    describe('non-FLEXIBLE_AREAS_ONLY types (falls back to validJourneyPattern)', () => {
      it('uses standard validation for CORRIDOR_SERVICE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(true);
      });

      it('uses standard validation for MAIN_ROUTE_WITH_FLEXIBLE_ENDS', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
          ),
        ).toBe(true);
      });

      it('uses standard validation for HAIL_AND_RIDE_SECTIONS', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
          ),
        ).toBe(true);
      });

      it('uses standard validation for FIXED_STOP_AREA_WIDE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FIXED_STOP_AREA_WIDE,
          ),
        ).toBe(true);
      });

      it('uses standard validation for MIXED_FLEXIBLE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(jp, FlexibleLineType.MIXED_FLEXIBLE),
        ).toBe(true);
      });

      it('uses standard validation for MIXED_FLEXIBLE_AND_FIXED', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
          ),
        ).toBe(true);
      });

      it('uses standard validation for FIXED', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(jp, FlexibleLineType.FIXED),
        ).toBe(true);
      });

      it('returns false for invalid pattern with non-FLEXIBLE_AREAS_ONLY type', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(false);
      });
    });

    describe('undefined flexibleLineType', () => {
      it('uses standard validation when flexibleLineType is undefined', () => {
        const jp = createJourneyPattern();
        expect(validFlexibleLineJourneyPattern(jp, undefined)).toBe(true);
      });

      it('returns false for invalid pattern when flexibleLineType is undefined', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(validFlexibleLineJourneyPattern(jp, undefined)).toBe(false);
      });
    });

    describe('mixed stop types (quay and flexible)', () => {
      it('validates journey pattern with mixed stop types for non-FLEXIBLE_AREAS_ONLY', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(),
            createFlexibleStopPoint(),
            createLastStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(true);
      });
    });
  });

  describe('aboutLineStepIsValid', () => {
    describe('name validation', () => {
      it('returns false when name is blank', () => {
        const line = createLine({
          name: '',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when name is null', () => {
        const line = createLine({
          name: null as any,
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const line = createLine({
          name: '   ',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('publicCode validation', () => {
      it('returns false when publicCode is blank and optionalPublicCode is false', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
        expect(aboutLineStepIsValid(line, false)).toBe(false);
      });

      it('returns true when publicCode is blank but optionalPublicCode is true', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line, true)).toBe(true);
      });

      it('returns true when publicCode is null but optionalPublicCode is true', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: null as any,
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line, true)).toBe(true);
      });

      it('returns true when publicCode is provided', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });
    });

    describe('operatorRef validation', () => {
      it('returns false when operatorRef is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when operatorRef is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: undefined,
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('networkRef validation', () => {
      it('returns false when networkRef is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when networkRef is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: undefined,
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('transportMode validation', () => {
      it('returns false when transportMode is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: '' as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportMode is null', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates with various transport modes', () => {
        const modes = [
          VEHICLE_MODE.BUS,
          VEHICLE_MODE.TRAM,
          VEHICLE_MODE.RAIL,
          VEHICLE_MODE.METRO,
          VEHICLE_MODE.WATER,
          VEHICLE_MODE.AIR,
          VEHICLE_MODE.COACH,
        ];

        modes.forEach((mode) => {
          const line = createLine({
            name: 'Test Line',
            publicCode: '42',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: mode,
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          });
          expect(aboutLineStepIsValid(line)).toBe(true);
        });
      });
    });

    describe('transportSubmode validation', () => {
      it('returns false when transportSubmode is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: '' as any,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportSubmode is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates with various transport submodes', () => {
        const submodes = [
          'localBus',
          'regionalBus',
          'expressBus',
          'localTram',
          'local',
        ];

        submodes.forEach((submode) => {
          const line = createLine({
            name: 'Test Line',
            publicCode: '42',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: VEHICLE_MODE.BUS,
            transportSubmode: submode as any,
          });
          expect(aboutLineStepIsValid(line)).toBe(true);
        });
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid line', () => {
        const line = createLine({
          name: 'Express 42',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'expressBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });

      it('returns false when multiple fields are invalid', () => {
        const line = createLine({
          name: '',
          publicCode: '',
          operatorRef: '',
          networkRef: '',
          transportMode: undefined as any,
          transportSubmode: undefined,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates line with network reference from factory', () => {
        const line = createLineWithNetwork({
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates line with all required fields', () => {
        const line = createLineWithNetwork({
          operatorRef: 'TST:Operator:1',
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });

      it('returns false for empty line', () => {
        const line = createEmptyLine();
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });
  });

  describe('aboutFlexibleLineStepIsValid', () => {
    describe('inherits aboutLineStepIsValid checks', () => {
      it('returns false when name is blank', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when publicCode is blank and optionalPublicCode is false', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
        expect(aboutFlexibleLineStepIsValid(line, true)).toBe(true);
      });

      it('returns false when operatorRef is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when networkRef is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportMode is null', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportSubmode is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });
    });

    describe('flexibleLineType validation (unique to flexible lines)', () => {
      it('returns false when flexibleLineType is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: '' as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when flexibleLineType is null', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns true for all FlexibleLineType values', () => {
        const types = [
          FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          FlexibleLineType.CORRIDOR_SERVICE,
          FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
          FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
          FlexibleLineType.MIXED_FLEXIBLE,
          FlexibleLineType.FIXED_STOP_AREA_WIDE,
          FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
          FlexibleLineType.FIXED,
        ];

        types.forEach((type) => {
          const line = createFlexibleLine({
            name: 'Test Flexible',
            publicCode: 'FLEX1',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: VEHICLE_MODE.BUS,
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
            flexibleLineType: type,
          });
          expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
        });
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid flexible line', () => {
        const line = createFlexibleLine({
          name: 'Flex Express',
          publicCode: 'FLEX42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns false when multiple fields are invalid', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: '',
          operatorRef: '',
          networkRef: '',
          transportMode: undefined as any,
          transportSubmode: undefined,
          flexibleLineType: undefined as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false even with valid flexibleLineType but invalid base fields', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false for valid base fields but missing flexibleLineType', () => {
        const line = createFlexibleLine({
          name: 'Valid Name',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('validates flexible line with network reference from factory', () => {
        const line = createFlexibleLineWithNetwork({
          operatorRef: 'TST:Operator:1',
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('validates using createFlexibleLineWithType factory', () => {
        const line = createFlexibleLineWithType(
          FlexibleLineType.CORRIDOR_SERVICE,
          {
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          },
        );
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns false for empty flexible line', () => {
        const line = createEmptyFlexibleLine();
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });
    });
  });

  describe('getMaxAllowedStepIndex', () => {
    it('returns 0 when line about step is invalid', () => {
      const line = createLine({
        name: '',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [createJourneyPattern()],
      });
      expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
    });

    it('returns 1 when journey pattern is invalid', () => {
      const jp = createJourneyPattern({ name: '' });
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
    });

    it('returns 2 when service journey is invalid', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(2);
    });

    it('returns 3 when all validations pass', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(3);
    });

    it('allows empty publicCode when optionalPublicCode is true', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedStepIndex(line, mockIntl, true)).toBe(3);
    });
  });

  describe('getMaxAllowedFlexibleLineStepIndex', () => {
    it('returns 0 when flexible line about step is invalid', () => {
      const line = createFlexibleLine({
        name: '',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [createFlexibleJourneyPattern(2)],
      });
      expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(0);
    });

    it('returns 1 when flexible journey pattern is invalid', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        name: '',
        pointsInSequence: stops,
      });
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(1);
    });

    it('returns 2 when service journey is invalid', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        pointsInSequence: stops,
      });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(2);
    });

    it('returns 3 when all validations pass', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        pointsInSequence: stops,
      });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(3);
    });
  });

  describe('currentStepIsValid', () => {
    it('validates step 0 using aboutLineStepIsValid', () => {
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [createJourneyPattern()],
      });
      expect(currentStepIsValid(0, line, mockIntl)).toBe(true);
    });

    it('validates step 1 using journey pattern validation', () => {
      const jp = createJourneyPattern();
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(currentStepIsValid(1, line, mockIntl)).toBe(true);
    });

    it('validates step 2 using service journey validation', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(currentStepIsValid(2, line, mockIntl)).toBe(true);
    });

    it('returns true for step 3', () => {
      const line = createEmptyLine();
      expect(currentStepIsValid(3, line, mockIntl)).toBe(true);
    });

    it('returns false for invalid step numbers', () => {
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [createJourneyPattern()],
      });
      expect(currentStepIsValid(-1, line, mockIntl)).toBe(false);
      expect(currentStepIsValid(4, line, mockIntl)).toBe(false);
    });
  });

  describe('currentFlexibleLineStepIsValid', () => {
    it('validates step 0 using aboutFlexibleLineStepIsValid', () => {
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [createFlexibleJourneyPattern(2)],
      });
      expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(true);
    });

    it('validates step 1 using flexible journey pattern validation', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        pointsInSequence: stops,
      });
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(true);
    });

    it('validates step 2 using service journey validation', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        pointsInSequence: stops,
      });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(true);
    });

    it('returns true for step 3', () => {
      const line = createEmptyFlexibleLine();
      expect(currentFlexibleLineStepIsValid(3, line, mockIntl)).toBe(true);
    });

    it('returns false for invalid step numbers', () => {
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [createFlexibleJourneyPattern(2)],
      });
      expect(currentFlexibleLineStepIsValid(-1, line, mockIntl)).toBe(false);
      expect(currentFlexibleLineStepIsValid(4, line, mockIntl)).toBe(false);
    });
  });

  describe('validLine (integration tests)', () => {
    it('returns true for fully valid line', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(validLine(line, mockIntl)).toBe(true);
    });

    it('returns false when aboutLineStepIsValid fails', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: '',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(validLine(line, mockIntl)).toBe(false);
    });

    it('returns false when journey pattern validation fails', () => {
      const jp = createJourneyPattern({ name: '' });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(validLine(line, mockIntl)).toBe(false);
    });

    it('returns false when service journey validation fails', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '42',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(validLine(line, mockIntl)).toBe(false);
    });

    it('allows empty publicCode when optionalPublicCode is true', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createLine({
        name: 'Test Line',
        publicCode: '',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        journeyPatterns: [jp],
      });
      expect(validLine(line, mockIntl, true)).toBe(true);
    });

    it('returns false for empty line', () => {
      const line = createEmptyLine();
      expect(validLine(line, mockIntl)).toBe(false);
    });
  });

  describe('validFlexibleLine (integration tests)', () => {
    it('returns true for fully valid FLEXIBLE_AREAS_ONLY line', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        pointsInSequence: stops,
      });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Flex Service',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl)).toBe(true);
    });

    it('returns true for valid CORRIDOR_SERVICE line', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Corridor Service',
        publicCode: 'CORR1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl)).toBe(true);
    });

    it('returns false when aboutFlexibleLineStepIsValid fails', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: '',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl)).toBe(false);
    });

    it('returns false when flexible journey pattern validation fails', () => {
      const stops = createFlexibleStopPointSequence(2);
      stops[0] = {
        ...stops[0],
        destinationDisplay: { frontText: 'Destination' },
      };
      const jp = createJourneyPattern({
        name: '',
        pointsInSequence: stops,
      });
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Flexible',
        publicCode: 'FLEX1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl)).toBe(false);
    });

    it('returns false when service journey validation fails', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Corridor',
        publicCode: 'CORR1',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl)).toBe(false);
    });

    it('allows empty publicCode when optionalPublicCode is true', () => {
      const jp = createJourneyPattern();
      jp.serviceJourneys = [
        createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        }),
      ];
      const line = createFlexibleLine({
        name: 'Test Corridor',
        publicCode: '',
        operatorRef: 'TST:Operator:1',
        networkRef: 'TST:Network:1',
        transportMode: VEHICLE_MODE.BUS,
        transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
        journeyPatterns: [jp],
      });
      expect(validFlexibleLine(line, mockIntl, true)).toBe(true);
    });

    it('returns false for empty flexible line', () => {
      const line = createEmptyFlexibleLine();
      expect(validFlexibleLine(line, mockIntl)).toBe(false);
    });
  });
});
