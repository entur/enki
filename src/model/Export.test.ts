import { describe, it, expect } from 'vitest';
import { newExport, toPayload, Export } from './Export';
import { EXPORT_STATUS, SEVERITY } from './enums';

describe('newExport', () => {
  describe('default values', () => {
    it('returns object with empty name', () => {
      const result = newExport();
      expect(result.name).toBe('');
    });

    it('returns object with dryRun set to false', () => {
      const result = newExport();
      expect(result.dryRun).toBe(false);
    });

    it('returns object with generateServiceLinks defaulting to true', () => {
      const result = newExport();
      expect(result.generateServiceLinks).toBe(true);
    });

    it('returns object with includeDatedServiceJourneys defaulting to false', () => {
      const result = newExport();
      expect(result.includeDatedServiceJourneys).toBe(false);
    });
  });

  describe('custom values', () => {
    it('respects generateServiceLinks=false', () => {
      const result = newExport(false);
      expect(result.generateServiceLinks).toBe(false);
    });

    it('respects generateServiceLinks=true explicitly', () => {
      const result = newExport(true);
      expect(result.generateServiceLinks).toBe(true);
    });

    it('respects includeDatedServiceJourneys=true', () => {
      const result = newExport(true, true);
      expect(result.includeDatedServiceJourneys).toBe(true);
    });

    it('respects includeDatedServiceJourneys=false explicitly', () => {
      const result = newExport(false, false);
      expect(result.includeDatedServiceJourneys).toBe(false);
    });

    it('allows combining generateServiceLinks=false with includeDatedServiceJourneys=true', () => {
      const result = newExport(false, true);
      expect(result.generateServiceLinks).toBe(false);
      expect(result.includeDatedServiceJourneys).toBe(true);
    });
  });

  describe('object creation', () => {
    it('does not include id property', () => {
      const result = newExport();
      expect(result).not.toHaveProperty('id');
    });

    it('does not include exportStatus property', () => {
      const result = newExport();
      expect(result).not.toHaveProperty('exportStatus');
    });

    it('does not include downloadUrl property', () => {
      const result = newExport();
      expect(result).not.toHaveProperty('downloadUrl');
    });

    it('does not include messages property', () => {
      const result = newExport();
      expect(result).not.toHaveProperty('messages');
    });

    it('returns a new object on each call', () => {
      const result1 = newExport();
      const result2 = newExport();
      expect(result1).not.toBe(result2);
    });
  });
});

describe('toPayload', () => {
  describe('property removal', () => {
    it('removes exportStatus property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        exportStatus: EXPORT_STATUS.SUCCESS,
      };

      const result = toPayload(exportObj);

      expect(result).not.toHaveProperty('exportStatus');
    });

    it('removes downloadUrl property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        downloadUrl: 'https://example.com/download.zip',
      };

      const result = toPayload(exportObj);

      expect(result).not.toHaveProperty('downloadUrl');
    });

    it('removes messages property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        messages: [{ severity: SEVERITY.INFO, message: 'Test message' }],
      };

      const result = toPayload(exportObj);

      expect(result).not.toHaveProperty('messages');
    });

    it('removes all server-generated properties at once', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        exportStatus: EXPORT_STATUS.FAILED,
        downloadUrl: 'https://example.com/download.zip',
        messages: [{ severity: SEVERITY.ERROR, message: 'Error' }],
      };

      const result = toPayload(exportObj);

      expect(result).not.toHaveProperty('exportStatus');
      expect(result).not.toHaveProperty('downloadUrl');
      expect(result).not.toHaveProperty('messages');
    });
  });

  describe('property preservation', () => {
    it('preserves name property', () => {
      const exportObj: Export = {
        name: 'My Export',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };

      const result = toPayload(exportObj);

      expect(result.name).toBe('My Export');
    });

    it('preserves dryRun property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: true,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };

      const result = toPayload(exportObj);

      expect(result.dryRun).toBe(true);
    });

    it('preserves generateServiceLinks property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: false,
        includeDatedServiceJourneys: false,
      };

      const result = toPayload(exportObj);

      expect(result.generateServiceLinks).toBe(false);
    });

    it('preserves includeDatedServiceJourneys property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: true,
      };

      const result = toPayload(exportObj);

      expect(result.includeDatedServiceJourneys).toBe(true);
    });

    it('preserves id property when present', () => {
      const exportObj: Export = {
        id: 'TST:Export:1',
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };

      const result = toPayload(exportObj);

      expect(result.id).toBe('TST:Export:1');
    });

    it('preserves lineAssociations property', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        lineAssociations: [{ lineRef: 'TST:Line:1' }],
      };

      const result = toPayload(exportObj);

      expect(result.lineAssociations).toEqual([{ lineRef: 'TST:Line:1' }]);
    });
  });

  describe('immutability', () => {
    it('does not mutate the original object', () => {
      const exportObj: Export = {
        name: 'Test',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
        exportStatus: EXPORT_STATUS.SUCCESS,
        downloadUrl: 'https://example.com/download.zip',
        messages: [{ severity: SEVERITY.INFO, message: 'Info' }],
      };

      toPayload(exportObj);

      expect(exportObj.exportStatus).toBe(EXPORT_STATUS.SUCCESS);
      expect(exportObj.downloadUrl).toBe('https://example.com/download.zip');
      expect(exportObj.messages).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('handles export with minimal properties', () => {
      const exportObj: Export = {
        name: '',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };

      const result = toPayload(exportObj);

      expect(result.name).toBe('');
      expect(result.dryRun).toBe(false);
    });
  });
});
