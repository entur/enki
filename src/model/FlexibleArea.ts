import VersionedType from 'model/VersionedType';
import GeoJSON from './GeoJSON';

type FlexibleArea = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  polygon?: GeoJSON;
};

export default FlexibleArea;
