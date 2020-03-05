import { isNil, isEmpty } from 'ramda';
import { objectValuesAreEmpty } from 'helpers/forms';

import messages from './validateForm.messages';
import moment from 'moment';
import { Export } from 'model/Export';

export type ExportError = { name: any[]; fromDateToDate: any[] };
export type ExportValidation = [boolean, ExportError];

export const validateName = (name: string | undefined) => {
  if (isNil(name) || isEmpty(name)) {
    return [messages.errorExportNameIsEmpty];
  }
  return [];
};

export const validateFromDateToDate = (
  fromDate: string | null,
  toDate: string | null
) => {
  const errors = [];
  if (isNil(fromDate) || isEmpty(fromDate)) {
    errors.push(messages.errorExportFromDateIsEmpty);
  }
  if (isNil(toDate) || isEmpty(toDate)) {
    errors.push(messages.errorExportToDateIsEmpty);
  }
  if (fromDate && toDate && toDateIsBeforeFromDate(fromDate, toDate)) {
    errors.push(messages.errorExportFromDateIsAfterToDate);
  }
  return errors;
};

export const toDateIsBeforeFromDate = (fromDate: string, toDate: string) =>
  moment(fromDate).isAfter(moment(toDate));

export default function(theExport: Export) {
  const errors = {
    name: validateName(theExport.name),
    fromDateToDate: validateFromDateToDate(theExport.fromDate, theExport.toDate)
  };
  return [objectValuesAreEmpty(errors), errors];
}
