import { FloatingButton } from '@entur/button';
import { CheckIcon, DownArrowIcon, UpArrowIcon } from '@entur/icons';
import { updateLocale } from 'i18n/intlSlice';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useConfig } from 'config/ConfigContext';
import {
  getLanguagePickerFlagIcon,
  getLanguagePickerLocaleMessageKey,
  Locale,
} from 'i18n';

const LanguagePicker = () => {
  const [toggled, setToggle] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { formatMessage, locale: selectedLocale } = useIntl();
  const { supportedLocales } = useConfig();

  const handleChangeLocale = useCallback(
    async (locale: Locale) => {
      dispatch(updateLocale(locale));
    },
    [dispatch],
  );

  const arrowIcon = useMemo(
    () => (
      <div className="language-picker__icon-container__arrow">
        {toggled ? <UpArrowIcon /> : <DownArrowIcon />}
      </div>
    ),
    [toggled],
  );

  const checkIcon = useCallback(
    (locale: Locale) => {
      if (locale === selectedLocale)
        return (
          <div className="language-picker__icon-container language-picker__icon-container__check">
            <CheckIcon />
          </div>
        );
    },
    [selectedLocale],
  );

  const flagIcon = useCallback((locale: Locale) => {
    return (
      <div className="language-picker__icon-container language-picker__icon-container__flag">
        {getLanguagePickerFlagIcon(locale)}
      </div>
    );
  }, []);

  return (
    <div className="language-picker-wrapper">
      {toggled && (
        <div className="language-picker__dropdown">
          {(supportedLocales || Locale).map((locale: any) => (
            <FloatingButton
              key={locale}
              className="language-picker__item"
              onClick={() => handleChangeLocale(locale)}
              aria-label={locale}
              size="small"
            >
              {flagIcon(locale)}
              <span>
                {formatMessage({
                  id: getLanguagePickerLocaleMessageKey(locale),
                })}
              </span>
              {checkIcon(locale)}
            </FloatingButton>
          ))}
        </div>
      )}
      <FloatingButton
        onClick={() => setToggle(!toggled)}
        aria-label={formatMessage({ id: 'languagePickerAriaLabel' })}
        className="language-picker"
        size="small"
      >
        {flagIcon(selectedLocale as Locale)}
        {formatMessage({
          id: getLanguagePickerLocaleMessageKey(selectedLocale as Locale),
        })}
        {arrowIcon}
      </FloatingButton>
    </div>
  );
};

export default LanguagePicker;
