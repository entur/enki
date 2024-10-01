import {
  FdsNavigationItem,
  FdsNavigationItemPosition,
} from '../../Fds/fds-navigation';
import React from 'react';
import { MessageDescriptor, PrimitiveType } from 'react-intl';

export const raeItem = (): FdsNavigationItem => {
  return {
    label: 'RAE',
    value: '/',
    bold: true,
  };
};

class FormatXMLElementFn<T, U> {}

export const aboutItem = (formatMessage: any): FdsNavigationItem => {
  return {
    label: formatMessage({ id: 'about' }),
    value: '/about',
    dropDownItems: [
      {
        label: formatMessage({ id: 'instructions' }),
        value:
          'https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae',
        icon: 'external-link',
      },
      {
        label: formatMessage({ id: 'terms' }),
        value:
          'https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae',
        icon: 'external-link',
      },
      {
        label: formatMessage({ id: 'privacy' }),
        value:
          'https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae',
        icon: 'external-link',
      },
    ],
  };
};

export const supportItem = (formatMessage: any): FdsNavigationItem => {
  return {
    label: formatMessage({ id: 'support' }) as string,
    value: '',
    dropDownItems: [
      {
        label: formatMessage({ id: 'channels' }) as string,
        value:
          'https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae',
        icon: 'external-link',
      },
    ],
  };
};

export const loginItem = (
  formatMessage: any,
  login: any,
): FdsNavigationItem => {
  return {
    label: formatMessage({ id: 'login' }),
    value: () => login(window.location.href),
    position: FdsNavigationItemPosition.right,
  };
};

export const registerItem = (formatMessage: any): FdsNavigationItem => {
  return {
    label: formatMessage({ id: 'register' }),
    value: 'createAccount',
    position: FdsNavigationItemPosition.right,
  };
};

export const localeItem = (): FdsNavigationItem => {
  return {
    label: '',
    value: '/locale',
    position: FdsNavigationItemPosition.right,
    icon: 'globe',
    dropDownItems: [
      {
        label: 'Suomeksi',
        value: '/locales/fi',
        isCheckable: true,
      },
      {
        label: 'På Svenska',
        value: '/locales/sv',
        isCheckable: true,
      },
      {
        label: 'In English',
        value: '/locales/en',
        isCheckable: true,
      },
    ],
  };
};

export const getSelectedLocaleItem = (
  localeCode: string,
  formatMessage: any,
): FdsNavigationItem => {
  const selectedLocale: FdsNavigationItem = localeItem();
  selectedLocale.label = formatMessage({ id: 'locale' + localeCode });
  selectedLocale.dropDownItems = localeItem().dropDownItems?.map(
    (i: FdsNavigationItem) => {
      if ((i.value as string).includes(localeCode)) {
        i.icon = 'check';
      } else {
        i.icon = undefined;
      }
      return i;
    },
  ) as FdsNavigationItem[];

  return selectedLocale;
};
