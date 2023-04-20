import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Notifications from 'components/Notification';
import ScrollToTop from 'components/ScrollToTop';
import Loading from 'components/Loading';
import NavBar from './components/NavBar';
import Routes from './Routes';
import { getProviders } from 'actions/providers';
import { getOrganisations } from 'actions/organisations';

import './styles.scss';
import { GlobalState } from 'reducers';
import { useIntl } from 'react-intl';
import { useConfig } from 'config/ConfigContext';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
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
                  text="Laster inn dataleverandører og organisasjoner..."
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
