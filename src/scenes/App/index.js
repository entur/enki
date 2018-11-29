import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Notifications from '../../components/Notification';
import ScrollToTop from '../../components/ScrollToTop';
import Loading from '../../components/Loading';
import NavBar from './components/NavBar';
import Routes from './Routes';
import { getProviders } from '../../actions/providers';
import { getOrganisations } from '../../actions/organisations';

import './styles.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends Component {
  componentDidMount() {
    this.props.dispatch(getProviders());
    this.props.dispatch(getOrganisations());
  }

  render() {
    const { providers, organisations } = this.props;

    return (
      <div className="app">
        <Helmet defaultTitle="Bestillingstransport" />

        <BrowserRouter basename="/admin/flexible-transport">
          <ScrollToTop>
            <div>
              <div className="navbar-and-routes">
                <NavBar />
                <div className="header-and-routes">
                  <Loading
                    className="app-loader"
                    text="Laster inn dataleverandører og organisasjoner..."
                    isLoading={!providers || !organisations}
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
  }
}

const mapStateToProps = ({ providers, organisations }) => ({
  providers: providers.providers,
  organisations
});

export default connect(mapStateToProps)(App);
