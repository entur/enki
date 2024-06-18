import { NormalizedDropdownItemType } from '@entur/dropdown';
import { FlexibleLineType } from 'model/FlexibleLine';
import { MessagesKey } from '../i18n/translationKeys';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  vehicleSubmodeMessages,
} from '../model/enums';
import { FormatMessage } from 'i18n';

type GenericDropdownItem<E> = {
  id?: string;
  name?: string;
};

export const getInit = <E>(
  items: GenericDropdownItem<E>[],
  init: string | undefined | null,
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
  items: GenericDropdownItem<E>[],
): NormalizedDropdownItemType[] =>
  items.map(({ id, name }) => ({
    value: id ?? '',
    label: name ?? '',
  }));

export const getEnumInit = <E>(init?: E): NormalizedDropdownItemType | null =>
  init
    ? {
        value: `${init}`,
        label: `${init}`,
      }
    : null;

export const mapEnumToItems = <E extends Object>(
  e: E,
): NormalizedDropdownItemType[] => [
  ...Object.values(e).map((type) => ({
    value: `${type}`,
    label: `${type}`,
  })),
];

export const mapVehicleModeAndLabelToItems = (
  e: Record<VEHICLE_MODE, keyof MessagesKey>,
  formatMessage: FormatMessage,
): NormalizedDropdownItemType[] => [
  ...Object.entries(e).map(([key, label]) => ({
    value: key,
    label: formatMessage({ id: label }),
  })),
];

export const mapVehicleSubmodeAndLabelToItems = (
  e: VEHICLE_SUBMODE[],
  formatMessage: FormatMessage,
): NormalizedDropdownItemType[] => [
  ...Object.values(e).map((type: VEHICLE_SUBMODE) => ({
    value: type,
    label: formatMessage({ id: vehicleSubmodeMessages[type] }),
  })),
];

export const mapFlexibleLineTypeAndLabelToItems = (
  e: FlexibleLineType[],
  formatMessage: FormatMessage,
): NormalizedDropdownItemType[] => [
  ...Object.values(e).map((type: FlexibleLineType) => ({
    value: type,
    label: formatMessage({
      id: `flexibleLineType_${type}` as keyof MessagesKey,
    }),
  })),
];
