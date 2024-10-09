type MultilingualString = {
  lang: string;
  value: string;
};

export type Organisation = {
  id: string;
  name: MultilingualString;
  type: 'authority' | 'operator';
};

/**
 * Legacy behavior: Filter out organisations that do not have a netexAuthorityId with current provider's codespace
 */
export const filterAuthorities = (
  organisations: Organisation[],
  activeProvider?: string | null,
  enableFilter?: boolean,
) =>
  enableFilter
    ? organisations?.filter((org) => org.type === 'authority')
    : organisations;

/**
 * Legacy behavior: Filter out organisations that do not have a netexOperatorId
 */
export const filterNetexOperators = (
  organisations: Organisation[],
  enableFilter?: boolean,
): Organisation[] =>
  enableFilter
    ? organisations.filter((org) => org.type === 'operator')
    : organisations;
