import { VersionedType } from './base/VersionedType';

export type Network = VersionedType & {
  id?: string;
  name?: string;
  description?: string;
  privateCode?: string;
  authorityRef?: string;
};
