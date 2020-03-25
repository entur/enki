import moment from 'moment';
import { isBlank } from 'helpers/forms';
import { Export } from 'model/Export';

export const toDateIsAfterFromDate = (fromDate: string, toDate: string) =>
  moment(toDate).isAfter(moment(fromDate));

export const exportIsValid = (theExport: Export) =>
  !isBlank(theExport.name) &&
  toDateIsAfterFromDate(theExport.fromDate, theExport.toDate);
