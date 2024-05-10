import { isBlank } from 'helpers/forms';
import { Export } from 'model/Export';

export const exportIsValid = (theExport: Export) => !isBlank(theExport.name);
