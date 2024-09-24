import React, { useCallback, useEffect, useState } from 'react';
import {
  FdsNavigationItem,
  FdsNavigationVariant,
} from '../../Fds/fds-navigation';
import { FdsNavigationComponent } from '../../Fds/FdsNavigationComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

interface NavbarProps {
  items: FdsNavigationItem[];
  barIndex: number;
  variant: FdsNavigationVariant;
  selectedItem: FdsNavigationItem;
  children?: React.ReactNode;
  isSelectedItemStatic?: boolean;
  languageSelectionCallback?: (newLocaleCode: string) => void;
}

const Navbar = ({
  items,
  barIndex,
  variant,
  selectedItem: initialSelectedItem,
  children,
  isSelectedItemStatic,
  languageSelectionCallback,
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] =
    useState<FdsNavigationItem>(initialSelectedItem);
  const intl = useIntl();
  const { formatMessage } = intl;
  const selectedLocaleCode: string = intl.locale;

  /*const handleLanguageSelection = useCallback(
    async (value: string) => {
      const newLocaleCode = value.split('/')[2]
      await i18n.changeLanguage(newLocaleCode)
      if (languageSelectionCallback) {
        languageSelectionCallback(newLocaleCode)
      }
      localStorage.setItem(localStorageKey, newLocaleCode)
    },
    [languageSelectionCallback, i18n]
  )*/

  const useSelectListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsNavigationItem;

      if (typeof detail.value !== 'string') {
        // e.g. login or register
        //const msalMethod = detail.value as MsalMethod
        //msalMethod(instance)
        return;
      }

      if (detail.value.startsWith('/locales')) {
        /*handleLanguageSelection(detail.value).catch((err) => {
          console.error('Selected language could not be fetched', err)
        })*/
        return;
      }

      setSelectedItem(detail);
      const route = detail.value;
      if (!route) {
        return;
      } else if (route.startsWith('https')) {
        // Redirecting to a new window
        window.open(route, '_newtab');
      } else {
        navigate(route);
      }
    },
    [/*handleLanguageSelection, instance,*/ navigate],
  );

  useEffect(() => {
    const element = document.getElementsByTagName('fds-navigation')[barIndex];
    if (element && element.getAttribute('listener') !== 'true') {
      element.addEventListener('select', useSelectListener);
    }

    return () => {
      element?.removeEventListener('select', useSelectListener);
    };
  }, [barIndex, useSelectListener]);

  useEffect(() => {
    if (isSelectedItemStatic) {
      return;
    }
    setSelectedItem(
      items.filter((item) => item.value === location.pathname)[0],
    );
  }, [items, location, isSelectedItemStatic]);

  return (
    <>
      <FdsNavigationComponent
        variant={variant}
        items={items}
        selected={isSelectedItemStatic ? initialSelectedItem : selectedItem}
      >
        {children}
      </FdsNavigationComponent>
    </>
  );
};

export default Navbar;
