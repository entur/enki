import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import IconButton from '@mui/material/IconButton';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import Language from '@mui/icons-material/Language';
import { updateLocale } from 'i18n/intlSlice';
import { useConfig } from 'config/ConfigContext';
import { useAppDispatch } from 'store/hooks';
import FlagIcon from 'components/FlagIcon';
import { getLanguagePickerLocaleMessageKey, Locale } from 'i18n';

const LanguagePickerMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const { formatMessage, locale: selectedLocale } = useIntl();
  const { supportedLocales } = useConfig();

  const handleChangeLocale = useCallback(
    (locale: Locale) => {
      dispatch(updateLocale(locale));
      setAnchorEl(null);
    },
    [dispatch],
  );

  const locales = supportedLocales || Locale;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={formatMessage({ id: 'languagePickerAriaLabel' })}
      >
        <Language />
      </IconButton>
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {(locales as Locale[]).map((locale) => (
          <MenuItem
            key={locale}
            onClick={() => handleChangeLocale(locale)}
            selected={locale === selectedLocale}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FlagIcon locale={locale} />
            </ListItemIcon>
            <ListItemText>
              {formatMessage({
                id: getLanguagePickerLocaleMessageKey(locale),
              })}
            </ListItemText>
            {locale === selectedLocale && (
              <Check fontSize="small" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </MuiMenu>
    </>
  );
};

export default LanguagePickerMenu;
