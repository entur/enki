import { isNil, isEmpty } from 'ramda';
import { objectValuesAreEmpty } from 'helpers/forms';

import messages from './validateForm.messages';
import moment from 'moment';

export function validateName(name) {
  if (isNil(name) || isEmpty(name)) {
    return [messages.errorExportNameIsEmpty];
  }
  return [];
}

function validateFromDateToDate(fromDate, toDate) {
  let errors = [];
  if (isNil(fromDate) || isEmpty(fromDate)) {
    errors.push(messages.errorExportFromDateIsEmpty);
  }
  if (isNil(toDate) || isEmpty(toDate)) {
    errors.push(messages.errorExportToDateIsEmpty);
  }
  if (toDateIsBeforeFromDate(fromDate, toDate)) {
    errors.push(messages.errorExportFromDateIsAfterToDate);
  }
  return errors;
}

export function toDateIsBeforeFromDate(fromDate, toDate) {
  return moment(fromDate).isAfter(moment(toDate));
}

export default function(theExport) {
  let errors = {
    name: validateName(theExport.name),
    fromDateToDate: validateFromDateToDate(theExport.fromDate, theExport.toDate)
  };
  return [objectValuesAreEmpty(errors), errors];
}
