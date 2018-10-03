import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import FlexibleStopPlaceEditor from '../FlexibleStopPlaceEditor/index';

import '../../components/FlexibleStopPlaceMap/styles.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends Component {
  render() {
    return (
      <FlexibleStopPlaceEditor/>
    );
  }
}

export default App;
