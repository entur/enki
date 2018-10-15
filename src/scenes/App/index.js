import React, { Component } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import NetworkEditor from '../NetworkEditor';
import FlexibleStopPlaceEditor from '../FlexibleStopPlaceEditor/index';
import FlexibleLineEditor from '../FlexibleLineEditor';
import Tabs from '../../components/Tabs';
import Tab from '../../components/Tabs/Tab';
import Header from './components/Header/index';
import Loading from '../../components/Loading';
import { getProviders } from '../../actions/providers';

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
  }

  render() {
    return (
      <div className="app">
        <Header />

        <Loading
          className="app-loader"
          text="Laster inn tilbydere..."
          isLoading={!this.props.providers}
        >
          <Tabs>
            <Tab label="Nettverk">
              <NetworkEditor />
            </Tab>
            <Tab label="Linje">
              <FlexibleLineEditor />
            </Tab>
            <Tab label="Stoppested">
              <FlexibleStopPlaceEditor />
            </Tab>
          </Tabs>
        </Loading>
      </div>
    );
  }
}

const mapStateToProps = ({ providers }) => ({
  providers: providers.providers
});

export default connect(mapStateToProps)(App);
