import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
import { AppIntlState, selectIntl } from 'i18n';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const App = () => {
  const dispatch = useDispatch<any>();

  const { providers, organisations, auth } = useSelector<
    GlobalState,
    GlobalState
  >((state) => state);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getProviders());
      dispatch(getOrganisations());
    }
  }, [dispatch, auth.isAuthenticated]);

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

  const basename = '';

  return (
    <div className="app">
      <Helmet defaultTitle={formatMessage('appTitle')} />

      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <div>
            <div className="navbar-and-routes">
              <NavBar />
              <div className="header-and-routes">
                <Loading
                  className="app-loader"
                  text="Laster inn dataleverandører og organisasjoner..."
                  isLoading={
                    !providers.providers ||
                    !organisations ||
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
