import React, { Component, createRef } from 'react';
import { Map, Polygon, TileLayer } from 'react-leaflet';

import './styles.css';

class PolygonMap extends Component {
  state = {
    center: {
      lat: 59.91,
      lng: 10.76
    },
    bounds: undefined,
    zoom: 14
  };

  map = createRef();

  setPolygonRef(element) {
    if (element) {
      const bounds = element.leafletElement.getBounds();
      if (this.isBoundsValid(bounds) && bounds !== this.state.bounds) {
        this.setState({ bounds });
      }
    }
  }

  isBoundsValid(bounds) {
    if (!bounds || !bounds.isValid()) return false;
    return !bounds.getSouthWest().equals(bounds.getNorthEast());
  }

  componentDidMount() {
    this.map.current.leafletElement.locate();
  }

  handleLocationFound(e) {
    if (!this.state.bounds) {
      this.setState({ center: e.latlng });
    }
  }

  render() {
    const { onClick, polygon } = this.props;
    const { center, bounds, zoom } = this.state;

    return (
      <div className="map-container">
        <Map
          className="map"
          center={[center.lat, center.lng]}
          zoom={zoom}
          bounds={bounds}
          onClick={onClick}
          onLocationFound={this.handleLocationFound.bind(this)}
          ref={this.map}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon ref={this.setPolygonRef.bind(this)} positions={polygon} />
        </Map>
      </div>
    );
  }
}

export default PolygonMap;
