import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';

type GenericDropdownItem<E> = {
  id?: string;
  name?: string;
};

export const getInit = <E>(
  items: GenericDropdownItem<E>[],
  init: string | undefined
): NormalizedDropdownItemType | null => {
  const op = items.find((o) => o.id === init);
  return op
    ? {
        value: op.id ?? '',
        label: op.name ?? '',
      }
    : null;
};

export const mapToItems = <E>(
  items: GenericDropdownItem<E>[]
): NormalizedDropdownItemType[] =>
  items.map(({ id, name }) => ({
    value: id ?? '',
    label: name ?? '',
  }));

export const getEnumInit = (
  init: string | undefined
): NormalizedDropdownItemType | null =>
  init
    ? {
        value: init,
        label: init,
      }
    : null;

export const mapEnumToItems = <E>(e: E): NormalizedDropdownItemType[] => [
  ...Object.values(e).map((type) => ({
    value: type,
    label: type,
  })),
];
