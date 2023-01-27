import Codespace from './Codespace';
import VersionedType from './VersionedType';

type Provider = VersionedType & {
  name?: string;
  code?: string;
  codespace?: Codespace;
};

export const sortProviders = (a: Provider, b: Provider) => {
  if (!a.name) {
    return -1;
  }
  if (!b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export default Provider;
