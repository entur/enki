import React, { Component } from 'react';
import FlexibleStopPlaceMap from './components/FlexibleStopPlaceMap';

import './styles.css';

class FlexibleStopPlaceEditor extends Component {
  state = { polygon: [] };

  handleMapOnClick(e) {
    this.setState(prevState => ({
      polygon: prevState.polygon.concat([[e.latlng.lat, e.latlng.lng]])
    }));
  }

  render() {
    const { polygon } = this.state;

    return (
      <div className="flexible-stop-place-editor">
        <FlexibleStopPlaceMap
          onClick={::this.handleMapOnClick}
          polygon={polygon}
        />
      </div>
    );
  }
}

export default FlexibleStopPlaceEditor;
