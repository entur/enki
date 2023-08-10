import VersionedType from 'model/VersionedType';
import GeoJSON from './GeoJSON';
import { KeyValues } from './KeyValues';

type FlexibleArea = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  polygon?: GeoJSON;
  keyValues?: KeyValues[];
};

export default FlexibleArea;
