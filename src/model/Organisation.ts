import Provider from './Provider';

type MultilingualString = {
  lang: string;
  value: string;
};

type ContactDetails = {
  email: string;
  phone: string;
  url: string;
};

type KeyValue = {
  key: string;
  value: string;
};

type KeyList = {
  keyValue?: KeyValue[];
};

export type Organisation = {
  id: string;
  name: MultilingualString;
  legalName: MultilingualString;
  contactDetails: ContactDetails;
  keyList?: KeyList;
};

/**
 * Legacy behavior: Filter out organisations that do not have a netexAuthorityId with current provider's codespace
 */
export const filterAuthorities = (
  organisations: Organisation[],
  activeProvider: Provider | null,
  enableFilter?: boolean,
) =>
  enableFilter
    ? organisations?.filter((org) =>
        org.keyList?.keyValue
          ?.find((kv) => kv.key === 'LegacyId')
          ?.value?.split(',')
          .find((v) => v.indexOf('Authority') > -1)
          ?.startsWith(activeProvider?.codespace?.xmlns || 'INVALID'),
      )
    : organisations;

/**
 * Legacy behavior: Filter out organisations that do not have a netexOperatorId
 */
export const filterNetexOperators = (
  organisations: Organisation[],
  enableFilter?: boolean,
): Organisation[] =>
  enableFilter
    ? organisations.filter((org) =>
        org.keyList?.keyValue
          ?.find((kv) => kv.key === 'LegacyId')
          ?.value?.split(',')
          .find((v) => v.indexOf('Operator') > -1),
      )
    : organisations;
