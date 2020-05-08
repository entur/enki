import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { FormatMessage } from '../i18n';
import { MessagesKey } from '../i18n/translations/translationKeys';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  vehicleSubmodeMessages,
} from '../model/enums';

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

export const vehicleModeInit = (
  e: Record<VEHICLE_MODE, keyof MessagesKey>,
  formatMessage: FormatMessage,
  init: VEHICLE_MODE | undefined
): NormalizedDropdownItemType | null => {
  const mapped = [
    ...Object.entries(e).map(([key, label]) => ({
      id: key,
      name: formatMessage(label),
    })),
  ];
  return getInit(mapped, init);
};

export const vehicleSubmodeInit = (
  e: VEHICLE_SUBMODE[],
  formatMessage: FormatMessage,
  init: VEHICLE_SUBMODE | undefined
): NormalizedDropdownItemType | null => {
  const mapped = [
    ...Object.values(e).map((type) => ({
      id: type,
      name: formatMessage(vehicleSubmodeMessages[type]),
    })),
  ];
  return getInit(mapped, init);
};

export const mapVehicleModeAndLabelToItems = (
  e: Record<VEHICLE_MODE, keyof MessagesKey>,
  formatMessage: FormatMessage
): NormalizedDropdownItemType[] => [
  ...Object.entries(e).map(([key, label]) => ({
    value: key,
    label: formatMessage(label),
  })),
];

export const mapVehicleSubmodeAndLabelToItems = (
  e: VEHICLE_SUBMODE[],
  formatMessage: FormatMessage
): NormalizedDropdownItemType[] => [
  ...Object.values(e).map((type: VEHICLE_SUBMODE) => ({
    value: type,
    label: formatMessage(vehicleSubmodeMessages[type]),
  })),
];
