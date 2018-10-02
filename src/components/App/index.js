import React, { Component, createRef } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import './styles.css';

class App extends Component {
  state = {
    mapCenter: {
      lat: 59.91,
      lng: -10.76
    },
    zoom: 13,
    showMarker: false
  };

  mapRef = createRef();

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.mapRef.current.leafletElement.locate({ setView: true, maxZoom: 16 });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ height: window.innerHeight });
  }

  handleClick = () => {
    this.mapRef.current.leafletElement.locate();
  };

  handleLocationFound = e => {
    this.setState({
      mapCenter: e.latlng,
      showMarker: true
    });
  };

  render() {
    const { height, mapCenter, zoom, showMarker } = this.state;

    const marker = showMarker ? (
      <Marker position={mapCenter}>
        <Popup>
          <span>
            You are here: {mapCenter.lat} - {mapCenter.lng}
          </span>
        </Popup>
      </Marker>
    ) : null;

    return (
      <div className="map-view">
        <div className="map-container">
          <Map
            className="map"
            style={{ height }}
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={zoom}
            onClick={this.handleClick}
            onLocationFound={this.handleLocationFound}
            ref={this.mapRef}
          >
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {marker}
          </Map>
        </div>
      </div>
    );
  }
}

export default App;
