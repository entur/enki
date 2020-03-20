import GeoJSON from './GeoJSON';
import VersionedType from 'model/base/VersionedType';

type FlexibleArea = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  polygon?: GeoJSON;
};

export default FlexibleArea;
