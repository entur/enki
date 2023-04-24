import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate } from 'react-router-dom';

import { getOrganisations } from 'actions/organisations';
import { getProviders } from 'actions/providers';
import Loading from 'components/Loading';
import Notifications from 'components/Notification';
import ScrollToTop from 'components/ScrollToTop';
import Routes from './Routes';
import NavBar from './components/NavBar';

import { useConfig } from 'config/ConfigContext';
import { useIntl } from 'react-intl';
import { GlobalState } from 'reducers';
import './styles.scss';

import MarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerIcon2x,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow,
});

const App = () => {
  const dispatch = useDispatch<any>();

  const { providers, auth } = useSelector<GlobalState, GlobalState>(
    (state) => state
  );

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getProviders());
    }
  }, [dispatch, auth.isAuthenticated]);

  useEffect(() => {
    dispatch(getOrganisations());
  }, [dispatch, providers.active]);

  const { formatMessage } = useIntl();

  const { adminRole } = useConfig();

  const basename = '';

  return (
    <div className="app">
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />

      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <div>
            <div className="navbar-and-routes">
              <NavBar />
              <div className="header-and-routes">
                {providers.providers &&
                  providers.providers.length === 0 &&
                  auth.roleAssignments?.includes(adminRole!) && (
                    <Navigate to="/providers" replace />
                  )}
                <Loading
                  className="app-loader"
                  text={formatMessage({ id: 'appLoadingMessage' })}
                  isLoading={
                    !providers.providers ||
                    auth.isLoading ||
                    !auth.isAuthenticated
                  }
                >
                  <Routes />
                </Loading>
              </div>
            </div>
            <Notifications />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default App;
