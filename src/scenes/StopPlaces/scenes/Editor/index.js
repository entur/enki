import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, TextField, TextArea } from '@entur/component-library';

import { FlexibleStopPlace, FlexibleArea } from '../../../../model/index';
import { VEHICLE_MODE } from '../../../../model/enums';
import OverlayLoader from '../../../../components/OverlayLoader';
import Loading from '../../../../components/Loading';
import PolygonMap from './components/PolygonMap/index';
import {
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace
} from '../../../../actions/flexibleStopPlaces';

import './styles.css';

class FlexibleStopPlaceEditor extends Component {
  state = {
    flexibleStopPlace: null,
    isSaving: false
  };

  componentDidMount() {
    const { dispatch, match, history } = this.props;
    if (match.params.id) {
      dispatch(loadFlexibleStopPlaceById(match.params.id))
        .then(flexibleStopPlace => this.setState({ flexibleStopPlace }))
        .catch(() => history.push('/stop-places'));
    } else {
      this.setState({
        flexibleStopPlace: new FlexibleStopPlace({
          transportMode: VEHICLE_MODE.BUS
        })
      });
    }
  }

  handleFieldChange(field, value) {
    this.setState(prevState => ({
      flexibleStopPlace: prevState.flexibleStopPlace.withChanges({
        [field]: value
      })
    }));
  }

  handleMapOnClick(e) {
    this.setState(
      ({ flexibleStopPlace, flexibleStopPlace: { flexibleArea } }) => ({
        flexibleStopPlace: flexibleStopPlace.withChanges({
          flexibleArea: (flexibleArea || new FlexibleArea()).addCoordinate([
            e.latlng.lat,
            e.latlng.lng
          ])
        })
      })
    );
  }

  handleOnSaveClick() {
    const { dispatch, history } = this.props;
    this.setState({ isSaving: true });
    dispatch(saveFlexibleStopPlace(this.state.flexibleStopPlace))
      .then(() => history.push('/stop-places'))
      .finally(() => this.setState({ isSaving: false }));
  }

  render() {
    const { isSaving, flexibleStopPlace } = this.state;

    const polygonCoordinates =
      flexibleStopPlace && flexibleStopPlace.flexibleArea
        ? flexibleStopPlace.flexibleArea.polygon.coordinates
        : [];

    return (
      <div className="stop-place-editor">
        <h3>Opprett stoppested</h3>

        {flexibleStopPlace ? (
          <OverlayLoader isLoading={isSaving} text="Lagrer stoppested...">
            <div className="stop-place-form-container">
              <div className="stop-place-form">
                <Label>Navn</Label>
                <TextField
                  type="text"
                  value={flexibleStopPlace.name}
                  onChange={e => this.handleFieldChange('name', e.target.value)}
                />

                <Label>Beskrivelse</Label>
                <TextArea
                  type="text"
                  value={flexibleStopPlace.description}
                  onChange={e =>
                    this.handleFieldChange('description', e.target.value)
                  }
                />

                <Label>Privat kode</Label>
                <TextField
                  type="text"
                  value={flexibleStopPlace.privateCode}
                  onChange={e =>
                    this.handleFieldChange('privateCode', e.target.value)
                  }
                />

                <div className="save-button-container">
                  <Button variant="success" onClick={::this.handleOnSaveClick}>
                    Lagre
                  </Button>
                </div>
              </div>

              <PolygonMap
                onClick={::this.handleMapOnClick}
                polygon={polygonCoordinates}
              />
            </div>
          </OverlayLoader>
        ) : (
          <Loading text="Laster inn stoppestedet..." />
        )}
      </div>
    );
  }
}

export default connect()(FlexibleStopPlaceEditor);
