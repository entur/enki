import GeoJSON from './GeoJSON';
import VersionedType from 'model/VersionedType';

type FlexibleArea = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  polygon?: GeoJSON;
};

export default FlexibleArea;
