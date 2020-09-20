import moment from 'moment';
import { isBlank } from 'helpers/forms';
import { Export } from 'model/Export';

export const toDateIsBeforeFromDate = (fromDate: string, toDate: string) =>
  moment(toDate).isBefore(moment(fromDate));

export const exportIsValid = (theExport: Export) =>
  !isBlank(theExport.name) &&
  !toDateIsBeforeFromDate(theExport.fromDate, theExport.toDate);
