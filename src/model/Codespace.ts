import VersionedType from 'model/VersionedType';

type Codespace = VersionedType & {
  xmlns?: string;
  xmlnsUrl?: string;
};

export default Codespace;
