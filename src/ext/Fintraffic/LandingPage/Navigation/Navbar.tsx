import React, { useCallback, useEffect, useState } from 'react';
import {
  FdsNavigationItem,
  FdsNavigationVariant,
} from '../../Fds/fds-navigation';
import { FdsNavigationComponent } from '../../Fds/FdsNavigationComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import { Locale } from '../../../../i18n';
import { updateLocale } from '../../../../i18n/intlSlice';
import { useDispatch } from 'react-redux';

interface NavbarProps {
  items: FdsNavigationItem[];
  barIndex: number;
  variant: FdsNavigationVariant;
  selectedItem?: FdsNavigationItem | undefined;
  children?: React.ReactNode;
  isSelectedItemStatic?: boolean;
}

const Navbar = ({
  items,
  barIndex,
  variant,
  selectedItem: initialSelectedItem,
  children,
  isSelectedItemStatic,
}: NavbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<
    FdsNavigationItem | undefined
  >(initialSelectedItem);

  const handleLanguageSelection = useCallback(
    async (localeValue: string) => {
      const newLocaleCode = localeValue.split('/')[2] as Locale;
      dispatch(updateLocale(newLocaleCode));
    },
    [dispatch],
  );

  const useSelectListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsNavigationItem;
      if (typeof detail.value !== 'string') {
        try {
          // @ts-ignore
          detail.value();
        } catch (error) {
          console.error(
            'Login or register from navigation menu could not be invoked',
            error,
          );
        }
        return;
      }

      if (detail.value.startsWith('/locales')) {
        handleLanguageSelection(detail.value as Locale).catch((err) => {
          console.error('Selected language could not be fetched', err);
        });
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
    [handleLanguageSelection, navigate],
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
