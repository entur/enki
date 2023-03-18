import React, { useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import { FloatingButton } from '@entur/button';
import { DownArrowIcon, CheckIcon, UpArrowIcon } from '@entur/icons';
import { NorwayIcon, UKIcon, SwedenIcon } from '@entur/icons';
import { getMessages, SUPPORTED_LOCALES, LOCALE_KEY, selectIntl } from 'i18n';
import './styles.scss';
import { GlobalState } from 'reducers';
import { MessagesKey } from 'i18n/translations/translationKeys';

const getFlagIcon = (locale: string) => {
  switch (locale) {
    case 'nb':
      return <NorwayIcon inline />;
    case 'sv':
      return <SwedenIcon inline />;
    case 'en':
      return <UKIcon inline />;
    default: {
      return <NorwayIcon inline />;
    }
  }
};

const getLocaleString = (locale: string): keyof MessagesKey => {
  switch (locale) {
    case 'en':
      return 'userMenuMenuItemTextEnglish';
    case 'sv':
      return 'userMenuMenuItemTextSwedish';
    case 'nb':
      return 'userMenuMenuItemTextNorwegian';
    default:
      return 'userMenuMenuItemTextNorwegian';
  }
};

const LanguagePicker = () => {
  const [toggled, setToggle] = useState<boolean>(false);
  const selectedLocale = useSelector<GlobalState, string>(
    (state) => state.intl.locale
  );
  const dispatch = useDispatch();
  const { formatMessage } = useSelector(selectIntl);

  const handleChangeLocale = useCallback(
    async (locale: 'nb' | 'en' | 'sv') => {
      const { messages } = await getMessages(locale);
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
          {SUPPORTED_LOCALES.map((locale: 'nb' | 'en' | 'sv') => (
            <FloatingButton
              key={locale}
              className="language-picker__item"
              onClick={() => handleChangeLocale(locale)}
              aria-label={locale}
              size="small"
            >
              {flagIcon(locale)}
              <span>{formatMessage(getLocaleString(locale))}</span>
              {checkIcon(locale)}
            </FloatingButton>
          ))}
        </div>
      )}
      <FloatingButton
        onClick={() => setToggle(!toggled)}
        aria-label={formatMessage('languagePickerAriaLabel')}
        className="language-picker"
        size="small"
      >
        {flagIcon(selectedLocale)}
        {formatMessage(getLocaleString(selectedLocale))}
        {arrowIcon}
      </FloatingButton>
    </div>
  );
};

export default LanguagePicker;
