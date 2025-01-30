import { Helmet } from 'react-helmet';
import { useConfig } from '../../config/ConfigContext';
import { MatomoConfig } from './types';
import { useAppSelector } from '../../store/hooks';
import { selectLocale } from '../../i18n/intlSlice';

export const MatomoTracker = () => {
  const selectedLocale = useAppSelector(selectLocale);
  const { matomo } = useConfig() as MatomoConfig;
  const isMatomoCorrectlyConfigured =
    matomo?.trackerUrl && matomo?.cookieConsentUrl;
  if (!isMatomoCorrectlyConfigured) {
    console.error(
      'Matomo tracker has something missing in its required config parameters',
    );
  }

  const matomoInitScript = `     
    var _mtm = window._mtm = window._mtm || [];  
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='${matomo?.trackerUrl}'; s.parentNode.insertBefore(g,s);
    })();
  `;
  return isMatomoCorrectlyConfigured ? (
    <Helmet>
      <script>{matomoInitScript}</script>
      <script
        data-culture={selectedLocale.toUpperCase()}
        id="CookieConsent"
        src={matomo.cookieConsentUrl}
        type="text/javascript"
      />
    </Helmet>
  ) : (
    <></>
  );
};
