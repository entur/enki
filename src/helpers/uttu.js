import messages from './uttu.messages';
export const getUttuError = e => {
  return e.response &&
    e.response.errors &&
    e.response.errors.length > 0 &&
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
  const DEFAULT_ERROR_CODE = 'UNKNOWN';
  let errorCode = DEFAULT_ERROR_CODE;
  let subCode = null;
  let metadata = {};
  if (
    e.response &&
    e.response.errors &&
    e.response.errors.length > 0 &&
    e.response.errors[0].extensions
  ) {
    if (validErrorCodes.includes(e.response.errors[0].extensions.code)) {
      errorCode = e.response.errors[0].extensions.code;
      subCode = e.response.errors[0].extensions.subCode;
      metadata = e.response.errors[0].extensions.metadata || {};
    }
  }

  const messageCode = subCode ? `${errorCode}_${subCode}` : errorCode;

  return intl.formatMessage(messages[messageCode], metadata);
};
