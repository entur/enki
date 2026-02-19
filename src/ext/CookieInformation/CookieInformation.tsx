import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '../../store/hooks';
import { selectLocale } from '../../i18n/intlSlice';

export const CookieInformation = () => {
  const selectedLocale = useAppSelector(selectLocale);

  return (
    <Helmet>
      <script
        data-culture={selectedLocale.toUpperCase()}
        id="CookieConsent"
        src={'https://policy.app.cookieinformation.com/uc.js'}
        type="text/javascript"
      />
    </Helmet>
  );
};
