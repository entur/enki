import messages from './uttu.messages';

export const getUttuError = e => {
  return e.response?.errors &&
    e.response.errors?.length &&
    e.response.errors[0].message
    ? e.response.errors[0].message
    : null;
};

const validErrorCodes = [
  'UNKNOWN',
  'ORGANISATION_NOT_VALID_OPERATOR',
  'MISSING_OPERATOR',
  'FROM_DATE_AFTER_TO_DATE',
  'ENTITY_IS_REFERENCED',
  'MINIMUM_POINTS_IN_SEQUENCE',
  'CONSTRAINT_VIOLATION'
];

export const getInternationalizedUttuError = (intl, e) => {
  const error = e.response?.errors?.length && e.response.errors[0];

  if (error && validErrorCodes.includes(error?.extensions?.code)) {
    const { code, subCode, metaData = {} } = error.extensions;
    const messageCode = subCode ? `${code}_${subCode}` : code;

    return intl.formatMessage(messages[messageCode], metaData);
  }

  return error.message || intl.formatMessage(messages['UNKNOWN']);
};
