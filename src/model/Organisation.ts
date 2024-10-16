type MultilingualString = {
  lang: string;
  value: string;
};

export type Organisation = {
  id: string;
  name: MultilingualString;
  type: 'authority' | 'operator';
};

export const filterAuthorities = (organisations: Organisation[]) =>
  organisations?.filter((org) => org.type === 'authority');

export const filterNetexOperators = (
  organisations: Organisation[],
): Organisation[] => organisations.filter((org) => org.type === 'operator');
