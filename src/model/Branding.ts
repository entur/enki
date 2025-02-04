import { VersionedType } from 'model/VersionedType';

export type Branding = VersionedType & {
  id?: string;
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
};
