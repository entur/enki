import { VersionedType } from 'model/VersionedType';

export type Network = VersionedType & {
  id?: string;
  name?: string;
  description?: string;
  privateCode?: string;
  authorityRef?: string;
};
