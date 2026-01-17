import JourneyPattern from 'model/JourneyPattern';

/**
 * Validation error for journey pattern name
 */
export type JourneyPatternNameValidationError = {
  duplicateName?: string;
  emptyName?: string;
};

/**
 * Validate journey pattern name is not empty and not duplicate
 *
 * @param name - The name to validate
 * @param existingNames - Array of existing journey pattern names
 * @param emptyNameMessage - Message to use for empty name error
 * @param duplicateNameMessage - Message to use for duplicate name error
 * @returns Validation error object (empty if valid)
 */
export const validateJourneyPatternName = (
  name: string | null | undefined,
  existingNames: string[],
  emptyNameMessage: string = 'Name is required',
  duplicateNameMessage: string = 'Name already exists',
): JourneyPatternNameValidationError => {
  const validationError: JourneyPatternNameValidationError = {};

  if (!name || name.trim() === '') {
    validationError.emptyName = emptyNameMessage;
    return validationError;
  }

  const normalizedName = name.trim();
  const normalizedExisting = existingNames.map((n) => n?.trim() || '');

  if (normalizedExisting.includes(normalizedName)) {
    validationError.duplicateName = duplicateNameMessage;
  }

  return validationError;
};

/**
 * Extract journey pattern names from an array of journey patterns
 */
export const getJourneyPatternNames = (
  journeyPatterns: JourneyPattern[] | undefined,
): string[] => {
  return journeyPatterns?.map((jp) => jp?.name?.trim() || '') ?? [];
};
