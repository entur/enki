import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';

import { getOrganisations } from 'actions/organisations';
import Loading from 'components/Loading';
import Notifications from 'components/Notification';
import ScrollToTop from 'components/ScrollToTop';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Routes from './Routes';
import Header from './Header';

import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './styles.scss';

import MarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fetchUserContext } from '../../auth/userContextSlice';
import { useConfig } from '../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';

import { OPEN_STREET_MAP } from '../../components/FormMap/mapDefaults';
import { setActiveMapBaseLayer } from '../../auth/userContextSlice';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerIcon2x,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow,
});

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { uttuApiUrl, mapConfig } = useConfig();

  const userContext = useAppSelector((state) => state.userContext);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(
        fetchUserContext({ uttuApiUrl, getAccessToken: auth.getAccessToken }),
      );
    }
  }, [dispatch, auth.isAuthenticated]);

  useEffect(() => {
    dispatch(getOrganisations());
  }, [dispatch, userContext.activeProviderCode]);

  /**
   * Sets the active base map layer on load or when mapConfig changes.
   * Priority:
   * 1. Saved layer from localStorage/Redux
   * 2. Default or first tile from mapConfig
   * 3. DEFAULT_OSM_TILE fallback
   */
  useEffect(() => {
    //fallback to DEFAULT_OSM_TILE when MapConfig has no tiles.
    const layerBasedOnMapConfig = mapConfig?.tileLayers?.length
      ? mapConfig?.defaultTileLayer || mapConfig?.tileLayers[0]?.name
      : OPEN_STREET_MAP;

    const activeLayer =
      userContext.activeMapBaseLayer ||
      layerBasedOnMapConfig ||
      OPEN_STREET_MAP;
    dispatch(setActiveMapBaseLayer(activeLayer));
  }, [mapConfig]);

  const { formatMessage } = useIntl();

  const basename = import.meta.env.BASE_URL;

  if (!userContext.loaded) {
    return null;
  }

  return (
    <div>
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <ComponentToggle feature="MatomoTracker" />
      <ComponentToggle feature="CookieInformation" />
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <>
            <Header />
            <Toolbar sx={{ minHeight: '64px' }} />
            <Box className="app-root">
              <Box className="app-content">
                <Loading
                  text={formatMessage({ id: 'appLoadingMessage' })}
                  isLoading={
                    !userContext.providers ||
                    auth.isLoading ||
                    !auth.isAuthenticated
                  }
                >
                  <Routes />
                </Loading>
              </Box>
            </Box>
            <Notifications />
          </>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default App;
