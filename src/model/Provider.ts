import Codespace from './Codespace';
import VersionedType from './VersionedType';

type Provider = VersionedType & {
  name?: string;
  code?: string;
  codespace?: Codespace;
};

export default Provider;
