import { describe, it, expect, beforeEach } from 'vitest';
import { resetIdCounters } from '../utils';
import {
  createServiceJourney,
  createServiceJourneyWithPassingTimes,
  createServiceJourneyWithDayTypes,
  createServiceJourneyWithBooking,
  createNamedServiceJourney,
  createEmptyServiceJourney,
} from '../serviceJourney';
import {
  createJourneyPattern,
  createJourneyPatternWithStops,
  createJourneyPatternWithServiceJourneys,
  createFlexibleJourneyPattern,
  createInboundJourneyPattern,
  createEmptyJourneyPattern,
  createMinimalJourneyPattern,
} from '../journeyPattern';
import {
  createLine,
  createNetwork,
  createLineWithNetwork,
  createLineWithJourneyPatterns,
  createLineWithMode,
  createRailLine,
  createTramLine,
  createFerryLine,
  createEmptyLine,
  createMinimalLine,
} from '../line';
import {
  createFlexibleLine,
  createFlexibleLineWithBooking,
  createFlexibleLineWithNetwork,
  createCorridorServiceLine,
  createMainRouteWithFlexibleEndsLine,
  createHailAndRideLine,
  createMixedFlexibleLine,
  createEmptyFlexibleLine,
} from '../flexibleLine';
import {
  createExport,
  createExportLineAssociation,
  createExportWithLines,
  createSuccessfulExport,
  createFailedExport,
  createInProgressExport,
  createDryRunExport,
  createExportWithDatedServiceJourneys,
  createErrorMessage,
  createWarningMessage,
  createInfoMessage,
  createNewExport,
} from '../export';
import {
  VEHICLE_MODE,
  DIRECTION_TYPE,
  EXPORT_STATUS,
  SEVERITY,
} from 'model/enums';
import { FlexibleLineType } from 'model/FlexibleLine';

describe('Composite Entity Factories', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('ServiceJourney Factories', () => {
    describe('createServiceJourney', () => {
      it('creates a service journey with defaults', () => {
        const sj = createServiceJourney();

        expect(sj.id).toBe('TST:ServiceJourney:1');
        expect(sj.name).toBe('Test Service Journey');
        expect(sj.passingTimes).toHaveLength(1);
        expect(sj.dayTypes).toEqual([]);
        expect(sj.bookingArrangement).toBeNull();
      });

      it('accepts overrides', () => {
        const sj = createServiceJourney({
          name: 'Custom Journey',
          publicCode: 'SJ1',
        });

        expect(sj.name).toBe('Custom Journey');
        expect(sj.publicCode).toBe('SJ1');
      });
    });

    describe('createServiceJourneyWithPassingTimes', () => {
      it('creates service journey with matching passing times for stop count', () => {
        const sj = createServiceJourneyWithPassingTimes(4);

        expect(sj.passingTimes).toHaveLength(4);
        // First stop: departure only
        expect(sj.passingTimes[0].departureTime).toBeDefined();
        expect(sj.passingTimes[0].arrivalTime).toBeNull();
        // Last stop: arrival only
        expect(sj.passingTimes[3].arrivalTime).toBeDefined();
        expect(sj.passingTimes[3].departureTime).toBeNull();
      });

      it('uses custom start hour and interval', () => {
        const sj = createServiceJourneyWithPassingTimes(3, 14, 20);

        expect(sj.passingTimes[0].departureTime).toBe('14:00:00');
        expect(sj.passingTimes[1].arrivalTime).toBe('14:20:00');
        expect(sj.passingTimes[2].arrivalTime).toBe('14:40:00');
      });
    });

    describe('createServiceJourneyWithDayTypes', () => {
      it('creates service journey with day types', () => {
        const sj = createServiceJourneyWithDayTypes();

        expect(sj.dayTypes).toHaveLength(1);
        expect(sj.dayTypes![0].daysOfWeek).toHaveLength(5); // Weekdays
      });
    });

    describe('createServiceJourneyWithBooking', () => {
      it('creates service journey with booking arrangement', () => {
        const sj = createServiceJourneyWithBooking();

        expect(sj.bookingArrangement).toBeDefined();
        expect(sj.bookingArrangement!.bookingContact).toBeDefined();
      });
    });

    describe('createNamedServiceJourney', () => {
      it('creates service journey with specific name', () => {
        const sj = createNamedServiceJourney('Morning Express');

        expect(sj.name).toBe('Morning Express');
      });
    });

    describe('createEmptyServiceJourney', () => {
      it('creates empty service journey for form initialization', () => {
        const sj = createEmptyServiceJourney();

        expect(sj.id).toMatch(/^new_TST:ServiceJourney:/);
        expect(sj.passingTimes).toEqual([]);
      });
    });
  });

  describe('JourneyPattern Factories', () => {
    describe('createJourneyPattern', () => {
      it('creates a journey pattern with defaults', () => {
        const jp = createJourneyPattern();

        expect(jp.id).toBe('TST:JourneyPattern:1');
        expect(jp.name).toBe('Test Journey Pattern');
        expect(jp.directionType).toBe(DIRECTION_TYPE.OUTBOUND);
        expect(jp.pointsInSequence).toHaveLength(3);
        expect(jp.serviceJourneys).toHaveLength(1);
      });

      it('has matching stop points and passing times count', () => {
        const jp = createJourneyPattern();

        expect(jp.pointsInSequence.length).toBe(
          jp.serviceJourneys[0].passingTimes.length,
        );
      });

      it('accepts overrides', () => {
        const jp = createJourneyPattern({
          name: 'Custom Route',
          directionType: DIRECTION_TYPE.INBOUND,
        });

        expect(jp.name).toBe('Custom Route');
        expect(jp.directionType).toBe(DIRECTION_TYPE.INBOUND);
      });
    });

    describe('createJourneyPatternWithStops', () => {
      it('creates journey pattern with specified stop count', () => {
        const jp = createJourneyPatternWithStops(5);

        expect(jp.pointsInSequence).toHaveLength(5);
        expect(jp.serviceJourneys[0].passingTimes).toHaveLength(5);
      });

      it('creates journey pattern with multiple service journeys', () => {
        const jp = createJourneyPatternWithStops(3, 4);

        expect(jp.pointsInSequence).toHaveLength(3);
        expect(jp.serviceJourneys).toHaveLength(4);
        jp.serviceJourneys.forEach((sj) => {
          expect(sj.passingTimes).toHaveLength(3);
        });
      });
    });

    describe('createJourneyPatternWithServiceJourneys', () => {
      it('creates journey pattern with specified service journey count', () => {
        const jp = createJourneyPatternWithServiceJourneys(3);

        expect(jp.serviceJourneys).toHaveLength(3);
      });
    });

    describe('createFlexibleJourneyPattern', () => {
      it('creates journey pattern with flexible stop points', () => {
        const jp = createFlexibleJourneyPattern();

        expect(jp.pointsInSequence).toHaveLength(3);
        jp.pointsInSequence.forEach((sp) => {
          expect(sp.flexibleStopPlace).toBeDefined();
          expect(sp.quayRef).toBeNull();
        });
      });
    });

    describe('createInboundJourneyPattern', () => {
      it('creates inbound journey pattern', () => {
        const jp = createInboundJourneyPattern();

        expect(jp.directionType).toBe(DIRECTION_TYPE.INBOUND);
        expect(jp.name).toBe('Inbound Route');
      });
    });

    describe('createEmptyJourneyPattern', () => {
      it('creates empty journey pattern for form initialization', () => {
        const jp = createEmptyJourneyPattern();

        expect(jp.pointsInSequence).toEqual([]);
        expect(jp.serviceJourneys).toEqual([]);
      });
    });

    describe('createMinimalJourneyPattern', () => {
      it('creates minimal journey pattern with 2 stops', () => {
        const jp = createMinimalJourneyPattern();

        expect(jp.pointsInSequence).toHaveLength(2);
        expect(jp.serviceJourneys).toHaveLength(1);
      });
    });
  });

  describe('Line Factories', () => {
    describe('createLine', () => {
      it('creates a line with defaults', () => {
        const line = createLine();

        expect(line.id).toBe('TST:Line:1');
        expect(line.name).toBe('Test Line');
        expect(line.publicCode).toBe('42');
        expect(line.transportMode).toBe(VEHICLE_MODE.BUS);
        expect(line.journeyPatterns).toHaveLength(1);
      });

      it('has fully populated journey pattern hierarchy', () => {
        const line = createLine();
        const jp = line.journeyPatterns![0];
        const sj = jp.serviceJourneys[0];

        expect(jp.pointsInSequence).toHaveLength(3);
        expect(sj.passingTimes).toHaveLength(3);
      });

      it('accepts overrides', () => {
        const line = createLine({
          name: 'Express Line',
          publicCode: 'E1',
        });

        expect(line.name).toBe('Express Line');
        expect(line.publicCode).toBe('E1');
      });
    });

    describe('createNetwork', () => {
      it('creates a network with defaults', () => {
        const network = createNetwork();

        expect(network.id).toBe('TST:Network:1');
        expect(network.name).toBe('Test Network');
        expect(network.authorityRef).toBe('TST:Authority:1');
      });
    });

    describe('createLineWithNetwork', () => {
      it('creates a line with network attached', () => {
        const line = createLineWithNetwork();

        expect(line.network).toBeDefined();
        expect(line.networkRef).toBe(line.network!.id);
      });
    });

    describe('createLineWithJourneyPatterns', () => {
      it('creates a line with multiple journey patterns', () => {
        const line = createLineWithJourneyPatterns(3);

        expect(line.journeyPatterns).toHaveLength(3);
      });

      it('creates a line with specified stops per pattern', () => {
        const line = createLineWithJourneyPatterns(2, 5);

        expect(line.journeyPatterns).toHaveLength(2);
        line.journeyPatterns!.forEach((jp) => {
          expect(jp.pointsInSequence).toHaveLength(5);
        });
      });
    });

    describe('createLineWithMode', () => {
      it('creates a line with specified transport mode', () => {
        const line = createLineWithMode(VEHICLE_MODE.METRO);

        expect(line.transportMode).toBe(VEHICLE_MODE.METRO);
      });
    });

    describe('createRailLine', () => {
      it('creates a rail line', () => {
        const line = createRailLine();

        expect(line.transportMode).toBe(VEHICLE_MODE.RAIL);
        expect(line.publicCode).toBe('R1');
      });
    });

    describe('createTramLine', () => {
      it('creates a tram line', () => {
        const line = createTramLine();

        expect(line.transportMode).toBe(VEHICLE_MODE.TRAM);
        expect(line.publicCode).toBe('T1');
      });
    });

    describe('createFerryLine', () => {
      it('creates a ferry line', () => {
        const line = createFerryLine();

        expect(line.transportMode).toBe(VEHICLE_MODE.WATER);
        expect(line.publicCode).toBe('F1');
      });
    });

    describe('createEmptyLine', () => {
      it('creates empty line for form initialization', () => {
        const line = createEmptyLine();

        expect(line.journeyPatterns).toEqual([]);
      });
    });

    describe('createMinimalLine', () => {
      it('creates minimal line with 2 stops', () => {
        const line = createMinimalLine();

        expect(line.journeyPatterns).toHaveLength(1);
        expect(line.journeyPatterns![0].pointsInSequence).toHaveLength(2);
      });
    });
  });

  describe('FlexibleLine Factories', () => {
    describe('createFlexibleLine', () => {
      it('creates a flexible line with defaults', () => {
        const line = createFlexibleLine();

        expect(line.id).toBe('TST:FlexibleLine:1');
        expect(line.name).toBe('Test Flexible Line');
        expect(line.flexibleLineType).toBe(
          FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        );
        expect(line.transportMode).toBe(VEHICLE_MODE.BUS);
        expect(line.journeyPatterns).toHaveLength(1);
      });

      it('has flexible stop points in journey patterns', () => {
        const line = createFlexibleLine();
        const jp = line.journeyPatterns![0];

        jp.pointsInSequence.forEach((sp) => {
          expect(sp.flexibleStopPlace).toBeDefined();
          expect(sp.quayRef).toBeNull();
        });
      });

      it('accepts overrides', () => {
        const line = createFlexibleLine({
          name: 'Custom Flex Line',
          publicCode: 'CF1',
        });

        expect(line.name).toBe('Custom Flex Line');
        expect(line.publicCode).toBe('CF1');
      });
    });

    describe('createFlexibleLineWithBooking', () => {
      it('creates a flexible line with booking arrangement', () => {
        const line = createFlexibleLineWithBooking();

        expect(line.bookingArrangement).toBeDefined();
        expect(line.bookingArrangement!.bookingContact).toBeDefined();
      });
    });

    describe('createFlexibleLineWithNetwork', () => {
      it('creates a flexible line with network', () => {
        const line = createFlexibleLineWithNetwork();

        expect(line.network).toBeDefined();
        expect(line.networkRef).toBe(line.network!.id);
      });
    });

    describe('createCorridorServiceLine', () => {
      it('creates a corridor service line', () => {
        const line = createCorridorServiceLine();

        expect(line.flexibleLineType).toBe(FlexibleLineType.CORRIDOR_SERVICE);
      });
    });

    describe('createMainRouteWithFlexibleEndsLine', () => {
      it('creates a main route with flexible ends line', () => {
        const line = createMainRouteWithFlexibleEndsLine();

        expect(line.flexibleLineType).toBe(
          FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
        );
      });
    });

    describe('createHailAndRideLine', () => {
      it('creates a hail and ride line', () => {
        const line = createHailAndRideLine();

        expect(line.flexibleLineType).toBe(
          FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
        );
      });
    });

    describe('createMixedFlexibleLine', () => {
      it('creates a mixed flexible line', () => {
        const line = createMixedFlexibleLine();

        expect(line.flexibleLineType).toBe(FlexibleLineType.MIXED_FLEXIBLE);
      });
    });

    describe('createEmptyFlexibleLine', () => {
      it('creates empty flexible line for form initialization', () => {
        const line = createEmptyFlexibleLine();

        expect(line.flexibleLineType).toBe(
          FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        );
        expect(line.journeyPatterns).toEqual([]);
      });
    });
  });

  describe('Export Factories', () => {
    describe('createExport', () => {
      it('creates an export with defaults', () => {
        const exp = createExport();

        expect(exp.id).toBe('TST:Export:1');
        expect(exp.name).toBe('Test Export');
        expect(exp.dryRun).toBe(false);
        expect(exp.generateServiceLinks).toBe(true);
        expect(exp.includeDatedServiceJourneys).toBe(false);
        expect(exp.messages).toEqual([]);
        expect(exp.lineAssociations).toEqual([]);
      });

      it('accepts overrides', () => {
        const exp = createExport({
          name: 'Custom Export',
          dryRun: true,
        });

        expect(exp.name).toBe('Custom Export');
        expect(exp.dryRun).toBe(true);
      });
    });

    describe('createExportLineAssociation', () => {
      it('creates a line association with generated ref', () => {
        const assoc = createExportLineAssociation();

        expect(assoc.lineRef).toBe('TST:Line:1');
      });

      it('creates a line association with provided ref', () => {
        const assoc = createExportLineAssociation('ENT:Line:123');

        expect(assoc.lineRef).toBe('ENT:Line:123');
      });
    });

    describe('createExportWithLines', () => {
      it('creates export with line associations', () => {
        const lineRefs = ['ENT:Line:1', 'ENT:Line:2', 'ENT:Line:3'];
        const exp = createExportWithLines(lineRefs);

        expect(exp.lineAssociations).toHaveLength(3);
        expect(exp.lineAssociations![0].lineRef).toBe('ENT:Line:1');
        expect(exp.lineAssociations![2].lineRef).toBe('ENT:Line:3');
      });
    });

    describe('createSuccessfulExport', () => {
      it('creates a successful export', () => {
        const exp = createSuccessfulExport();

        expect(exp.exportStatus).toBe(EXPORT_STATUS.SUCCESS);
        expect(exp.downloadUrl).toBeDefined();
      });
    });

    describe('createFailedExport', () => {
      it('creates a failed export with error message', () => {
        const exp = createFailedExport('Validation error');

        expect(exp.exportStatus).toBe(EXPORT_STATUS.FAILED);
        expect(exp.messages).toHaveLength(1);
        expect(exp.messages![0].severity).toBe(SEVERITY.ERROR);
        expect(exp.messages![0].message).toBe('Validation error');
      });
    });

    describe('createInProgressExport', () => {
      it('creates an in-progress export', () => {
        const exp = createInProgressExport();

        expect(exp.exportStatus).toBe(EXPORT_STATUS.IN_PROGRESS);
      });
    });

    describe('createDryRunExport', () => {
      it('creates a dry run export', () => {
        const exp = createDryRunExport();

        expect(exp.dryRun).toBe(true);
      });
    });

    describe('createExportWithDatedServiceJourneys', () => {
      it('creates export with dated service journeys enabled', () => {
        const exp = createExportWithDatedServiceJourneys();

        expect(exp.includeDatedServiceJourneys).toBe(true);
      });
    });

    describe('Message factories', () => {
      it('createErrorMessage creates error message', () => {
        const msg = createErrorMessage('Something went wrong');

        expect(msg.severity).toBe(SEVERITY.ERROR);
        expect(msg.message).toBe('Something went wrong');
      });

      it('createWarningMessage creates warning message', () => {
        const msg = createWarningMessage('Be careful');

        expect(msg.severity).toBe(SEVERITY.WARN);
        expect(msg.message).toBe('Be careful');
      });

      it('createInfoMessage creates info message', () => {
        const msg = createInfoMessage('FYI');

        expect(msg.severity).toBe(SEVERITY.INFO);
        expect(msg.message).toBe('FYI');
      });
    });

    describe('createNewExport', () => {
      it('creates new export for form initialization', () => {
        const exp = createNewExport();

        expect(exp.name).toBe('');
        expect(exp.dryRun).toBe(false);
        expect(exp.generateServiceLinks).toBe(true);
        expect(exp.includeDatedServiceJourneys).toBe(false);
      });

      it('accepts custom options', () => {
        const exp = createNewExport(false, true);

        expect(exp.generateServiceLinks).toBe(false);
        expect(exp.includeDatedServiceJourneys).toBe(true);
      });
    });
  });

  describe('ID Generation', () => {
    it('generates sequential IDs within a session', () => {
      const line1 = createLine();
      const line2 = createLine();

      expect(line1.id).toBe('TST:Line:1');
      expect(line2.id).toBe('TST:Line:2');
    });

    it('resets IDs between tests', () => {
      resetIdCounters();
      const line = createLine();

      expect(line.id).toBe('TST:Line:1');
    });

    it('generates IDs independently for different types', () => {
      const line = createLine();
      const flexLine = createFlexibleLine();
      const exp = createExport();

      expect(line.id).toBe('TST:Line:1');
      expect(flexLine.id).toBe('TST:FlexibleLine:1');
      expect(exp.id).toBe('TST:Export:1');
    });
  });

  describe('Deep Hierarchy Consistency', () => {
    it('creates consistent Line → JourneyPattern → ServiceJourney → PassingTime hierarchy', () => {
      const line = createLine();

      expect(line.journeyPatterns).toHaveLength(1);

      const jp = line.journeyPatterns![0];
      expect(jp.pointsInSequence).toHaveLength(3);
      expect(jp.serviceJourneys).toHaveLength(1);

      const sj = jp.serviceJourneys[0];
      expect(sj.passingTimes).toHaveLength(3);

      // Verify stop count matches passing time count
      expect(jp.pointsInSequence.length).toBe(sj.passingTimes.length);
    });

    it('creates consistent FlexibleLine hierarchy', () => {
      const line = createFlexibleLine();

      expect(line.journeyPatterns).toHaveLength(1);

      const jp = line.journeyPatterns![0];
      expect(jp.pointsInSequence).toHaveLength(3);

      // All stop points should be flexible
      jp.pointsInSequence.forEach((sp) => {
        expect(sp.flexibleStopPlace).toBeDefined();
      });

      const sj = jp.serviceJourneys[0];
      expect(sj.passingTimes).toHaveLength(3);
    });
  });
});
