import { Helmet } from 'react-helmet';
import { useConfig } from '../../config/ConfigContext';
import { MatomoConfig } from './types';

export const MatomoTracker = () => {
  const { matomo } = useConfig() as MatomoConfig;

  const matomoInitScript = `     
    var _mtm = window._mtm = window._mtm || [];  
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='${matomo?.src}'; s.parentNode.insertBefore(g,s);
    })();
  `;

  return matomo?.src ? (
    <Helmet>
      <script>{matomoInitScript}</script>
    </Helmet>
  ) : (
    <></>
  );
};
