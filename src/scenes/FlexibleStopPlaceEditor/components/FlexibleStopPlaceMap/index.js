import React, { Component, createRef } from 'react';
import { Map, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

import './styles.css';

class FlexibleStopPlaceMap extends Component {
  state = {
    center: {
      lat: 59.91,
      lng: -10.76
    },
    zoom: 12,
    showMarker: false
  };

  map = createRef();

  componentDidMount() {
    this.map.current.leafletElement.locate({ setView: true });
  }

  handleLocationFound = e => {
    this.setState({
      center: e.latlng,
      showMarker: true
    });
  };

  render() {
    const { onClick, polygon } = this.props;
    const { center, zoom, showMarker } = this.state;

    const marker = showMarker ? (
      <Marker position={center}>
        <Popup>
          <span>
            You are here: {center.lat} - {center.lng}
          </span>
        </Popup>
      </Marker>
    ) : null;

    return (
      <div className="map-container">
        <Map
          style={{ height: '100%' }}
          center={[center.lat, center.lng]}
          zoom={zoom}
          onClick={onClick}
          onLocationFound={this.handleLocationFound}
          ref={this.map}
        >
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marker}
          <Polygon positions={polygon} />
        </Map>
      </div>
    );
  }
}

export default FlexibleStopPlaceMap;
