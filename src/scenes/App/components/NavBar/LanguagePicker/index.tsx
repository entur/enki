import React, { useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import { FloatingButton } from '@entur/button';
import { DownArrowIcon, CheckIcon, UpArrowIcon } from '@entur/icons';
import { NorwayIcon, UKIcon } from '@entur/icons';
import { getMessages, SUPPORTED_LOCALES, LOCALE_KEY } from 'i18n';
import './styles.scss';
import { GlobalState } from 'reducers';

const getFlagIcon = (locale: string) => {
  switch (locale) {
    case 'nb':
      return <NorwayIcon inline />;
    case 'en':
      return <UKIcon inline />;
    default: {
      return <NorwayIcon inline />;
    }
  }
};

const getLocaleString = (locale: string): string => {
  switch (locale) {
    case 'en':
      return 'English';
    case 'nb':
      return 'Bokmål';
    default:
      return 'Bokmål';
  }
};

const LanguagePicker = () => {
  const [toggled, setToggle] = useState<boolean>(false);
  const selectedLocale = useSelector<GlobalState, string>(
    (state) => state.intl.locale
  );
  const dispatch = useDispatch();

  const handleChangeLocale = useCallback(
    (locale) => {
      const { messages } = getMessages(locale);
      dispatch(updateIntl({ locale, messages }));
      localStorage.setItem(LOCALE_KEY, locale);
    },
    [dispatch]
  );

  const arrowIcon = useMemo(
    () => (
      <div className="language-picker__icon-container__arrow">
        {toggled ? <UpArrowIcon /> : <DownArrowIcon />}
      </div>
    ),
    [toggled]
  );

  const checkIcon = useCallback(
    (locale: string) => {
      if (locale === selectedLocale)
        return (
          <div className="language-picker__icon-container language-picker__icon-container__check">
            <CheckIcon />
          </div>
        );
    },
    [selectedLocale]
  );

  const flagIcon = useCallback((locale: string) => {
    return (
      <div className="language-picker__icon-container language-picker__icon-container__flag">
        {getFlagIcon(locale)}
      </div>
    );
  }, []);
  return (
    <div className="language-picker-wrapper">
      {toggled && (
        <div className="language-picker__dropdown">
          {SUPPORTED_LOCALES.map((locale: string) => (
            <FloatingButton
              className="language-picker__item"
              onClick={() => handleChangeLocale(locale)}
              aria-label="pick locale"
              size="medium"
            >
              {flagIcon(locale)}
              <span>{getLocaleString(locale)}</span>
              {checkIcon(locale)}
            </FloatingButton>
          ))}
        </div>
      )}
      <FloatingButton
        onClick={() => setToggle(!toggled)}
        aria-label="velg språk"
        className="language-picker"
      >
        {flagIcon(selectedLocale)}
        {getLocaleString(selectedLocale)}
        {arrowIcon}
      </FloatingButton>
    </div>
  );
};

export default LanguagePicker;
