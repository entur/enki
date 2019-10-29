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
  'FROM_DATE_AFTER_TO_DATE',
  'ENTITY_IS_REFERENCED'
];

export const getInternationalizedUttuError = (intl, e) => {
  const DEFAULT_ERROR_CODE = 'UNKNOWN';
  let errorCode = DEFAULT_ERROR_CODE;
  let metadata = {};
  if (e.response && e.response.errors && e.response.errors.length > 0 && e.response.errors[0].extensions) {
    if (validErrorCodes.includes(e.response.errors[0].extensions.code)) {
      errorCode = e.response.errors[0].extensions.code;
      metadata = e.response.errors[0].extensions.metadata || {};
    }
  }

  return intl.formatMessage(
    messages[errorCode],
    metadata
  );
}
