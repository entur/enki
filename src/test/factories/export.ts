import { Export, ExportLineAssociation } from 'model/Export';
import { EXPORT_STATUS, SEVERITY } from 'model/enums';
import Message from 'model/Message';
import { DeepPartial } from './types';
import { createTestId, deepMerge } from './utils';

/**
 * Create an Export with sensible defaults
 * Default: Unnamed export, not dry run, generate service links
 */
export const createExport = (overrides?: DeepPartial<Export>): Export => {
  const defaults: Export = {
    id: createTestId('Export'),
    name: 'Test Export',
    exportStatus: undefined,
    dryRun: false,
    generateServiceLinks: true,
    includeDatedServiceJourneys: false,
    downloadUrl: undefined,
    messages: [],
    lineAssociations: [],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create an ExportLineAssociation
 */
export const createExportLineAssociation = (
  lineRef?: string,
  overrides?: DeepPartial<ExportLineAssociation>,
): ExportLineAssociation => {
  const defaults: ExportLineAssociation = {
    lineRef: lineRef ?? createTestId('Line'),
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create an Export with line associations
 * @param lineRefs - Array of line references to associate
 */
export const createExportWithLines = (
  lineRefs: string[],
  overrides?: DeepPartial<Export>,
): Export => {
  return createExport({
    lineAssociations: lineRefs.map((lineRef) =>
      createExportLineAssociation(lineRef),
    ),
    ...overrides,
  });
};

/**
 * Create a successful Export
 */
export const createSuccessfulExport = (
  overrides?: DeepPartial<Export>,
): Export => {
  return createExport({
    name: 'Successful Export',
    exportStatus: EXPORT_STATUS.SUCCESS,
    downloadUrl: 'exports/test-export.zip',
    ...overrides,
  });
};

/**
 * Create a failed Export with error messages
 */
export const createFailedExport = (
  errorMessage: string = 'Export validation failed',
  overrides?: DeepPartial<Export>,
): Export => {
  return createExport({
    name: 'Failed Export',
    exportStatus: EXPORT_STATUS.FAILED,
    messages: [createErrorMessage(errorMessage)],
    ...overrides,
  });
};

/**
 * Create an in-progress Export
 */
export const createInProgressExport = (
  overrides?: DeepPartial<Export>,
): Export => {
  return createExport({
    name: 'In Progress Export',
    exportStatus: EXPORT_STATUS.IN_PROGRESS,
    ...overrides,
  });
};

/**
 * Create a dry run Export
 */
export const createDryRunExport = (overrides?: DeepPartial<Export>): Export => {
  return createExport({
    name: 'Dry Run Export',
    dryRun: true,
    ...overrides,
  });
};

/**
 * Create an Export with dated service journeys enabled
 */
export const createExportWithDatedServiceJourneys = (
  overrides?: DeepPartial<Export>,
): Export => {
  return createExport({
    includeDatedServiceJourneys: true,
    ...overrides,
  });
};

/**
 * Create an error Message
 */
export const createErrorMessage = (
  message: string = 'An error occurred',
  overrides?: DeepPartial<Message>,
): Message => {
  const defaults: Message = {
    severity: SEVERITY.ERROR,
    message,
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a warning Message
 */
export const createWarningMessage = (
  message: string = 'Warning: potential issue detected',
  overrides?: DeepPartial<Message>,
): Message => {
  const defaults: Message = {
    severity: SEVERITY.WARN,
    message,
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create an info Message
 */
export const createInfoMessage = (
  message: string = 'Information message',
  overrides?: DeepPartial<Message>,
): Message => {
  const defaults: Message = {
    severity: SEVERITY.INFO,
    message,
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a new/empty Export (for form initialization)
 */
export const createNewExport = (
  generateServiceLinks: boolean = true,
  includeDatedServiceJourneys: boolean = false,
): Export => {
  return {
    name: '',
    dryRun: false,
    generateServiceLinks,
    includeDatedServiceJourneys,
  };
};
