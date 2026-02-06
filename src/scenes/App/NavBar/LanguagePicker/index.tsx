import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import { updateLocale } from 'i18n/intlSlice';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useConfig } from 'config/ConfigContext';
import { useAppDispatch } from 'store/hooks';
import FlagIcon from 'components/FlagIcon';
import { getLanguagePickerLocaleMessageKey, Locale } from 'i18n';

const LanguagePicker = () => {
  const [toggled, setToggle] = useState<boolean>(false);
  const dispatch = useAppDispatch();
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
        {toggled ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </div>
    ),
    [toggled],
  );

  const checkIcon = useCallback(
    (locale: Locale) => {
      if (locale === selectedLocale)
        return (
          <div className="language-picker__icon-container language-picker__icon-container__check">
            <Check />
          </div>
        );
    },
    [selectedLocale],
  );

  const flagIcon = useCallback(
    (locale: Locale) => (
      <div className="language-picker__icon-container language-picker__icon-container__flag">
        <FlagIcon locale={locale} />
      </div>
    ),
    [],
  );

  return (
    <div className="language-picker-wrapper">
      {toggled && (
        <div className="language-picker__dropdown">
          {(supportedLocales || Locale).map((locale: Locale) => (
            <Button
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
            </Button>
          ))}
        </div>
      )}
      <Button
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
      </Button>
    </div>
  );
};

export default LanguagePicker;
