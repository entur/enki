import { DaytypesEditor } from './DaytypesEditor';
import { injectReducer } from '../../../app/store';
import daytypesReducer from './daytypesSlice';
export default DaytypesEditor;

injectReducer('daytypes', daytypesReducer);
