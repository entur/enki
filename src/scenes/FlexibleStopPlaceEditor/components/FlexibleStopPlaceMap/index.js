import React, { Component, createRef } from 'react';
import { Map, Polygon, TileLayer } from 'react-leaflet';

import './styles.css';

class FlexibleStopPlaceMap extends Component {
  state = {
    center: {
      lat: 59.91,
      lng: -10.76
    },
    zoom: 12
  };

  map = createRef();

  componentDidMount() {
    this.map.current.leafletElement.locate({ setView: true });
  }

  handleLocationFound = e => {
    this.setState({ center: e.latlng });
  };

  render() {
    const { onClick, polygon } = this.props;
    const { center, zoom } = this.state;

    return (
      <div className="map-container">
          <Map
            style={{ flex: '1' }}
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
            <Polygon positions={polygon} />
          </Map>
      </div>
    );
  }
}

export default FlexibleStopPlaceMap;
