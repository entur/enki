import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { getOrganisations } from 'actions/organisations';
import { getProviders } from 'actions/providers';
import Loading from 'components/Loading';
import Notifications from 'components/Notification';
import ScrollToTop from 'components/ScrollToTop';
import Routes from './Routes';
import NavBar from './components/NavBar';

import { useIntl } from 'react-intl';
import { useAuth } from '../../app/auth';
import { useAppSelector } from '../../app/hooks';
import './styles.scss';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const App = () => {
  const dispatch = useDispatch<any>();

  const providers = useAppSelector((state) => state.providers);

  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getProviders());
    }
  }, [dispatch, auth.isAuthenticated]);

  useEffect(() => {
    dispatch(getOrganisations());
  }, [dispatch, providers.active]);

  const { formatMessage } = useIntl();

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
                <Loading
                  className="app-loader"
                  text={formatMessage({ id: 'app.loading.message' })}
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
