import * as R from 'ramda';
import { objectValues } from 'helpers/forms';

import messages from './validateForm.messages';
import moment from 'moment';

export function validateName(name) {
  if (R.isNil(name) || R.isEmpty(name)) {
    return [messages.errorExportNameIsEmpty];
  }
  return [];
}

function validateFromDateToDate(fromDate, toDate) {
  let errors = [];
  if (R.isNil(fromDate) || R.isEmpty(fromDate)) {
    errors.push(messages.errorExportFromDateIsEmpty);
  }
  if (R.isNil(toDate) || R.isEmpty(toDate)) {
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
  return [objectValues(errors).length === 0, errors];
}
