import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { getOrganisations } from 'actions/organisations';
import Loading from 'components/Loading';
import Notifications from 'components/Notification';
import ScrollToTop from 'components/ScrollToTop';
import Routes from './Routes';
import NavBar from './NavBar';

import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import { useAppSelector } from '../../store/hooks';
import './styles.scss';

import MarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fetchUserContext } from '../../auth/userContextSlice';
import { useConfig } from '../../config/ConfigContext';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerIcon2x,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow,
});

const App = () => {
  const dispatch = useDispatch<any>();
  const auth = useAuth();
  const { uttuApiUrl, sandboxFeatures } = useConfig();

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

  const { formatMessage } = useIntl();

  const basename = import.meta.env.BASE_URL;

  if (!userContext.loaded) {
    return null;
  }

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
                  text={formatMessage({ id: 'appLoadingMessage' })}
                  isLoading={
                    !userContext.providers ||
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
