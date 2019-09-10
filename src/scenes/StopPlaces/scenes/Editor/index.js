import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Label, TextField, TextArea } from '@entur/component-library';

import { FlexibleStopPlace, FlexibleArea } from '../../../../model';
import { VEHICLE_MODE } from '../../../../model/enums';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace
} from '../../../../actions/flexibleStopPlaces';
import { loadFlexibleLines } from '../../../../actions/flexibleLines';
import OverlayLoader from '../../../../components/OverlayLoader';
import Loading from '../../../../components/Loading';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import PolygonMap from './components/PolygonMap';

import './styles.css';

class FlexibleStopPlaceEditor extends Component {
  state = {
    flexibleStopPlace: null,

    isSaving: false,
    isDeleteDialogOpen: false,
    isDeleting: false
  };

  componentDidMount() {
    const { dispatch, match, history } = this.props;
    if (match.params.id) {
      dispatch(loadFlexibleLines());
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

  setDeleteDialogOpen(open) {
    this.setState({ isDeleteDialogOpen: open });
  }

  handleDelete() {
    const { dispatch, history } = this.props;
    this.setState({
      isDeleteDialogOpen: false,
      isDeleting: true
    });
    dispatch(deleteFlexibleStopPlaceById(this.state.flexibleStopPlace.id))
      .then(() => history.push('/stop-places'))
      .finally(() => this.setState({ isDeleting: false }));
  }

  render() {
    const { match, lines } = this.props;
    const {
      flexibleStopPlace,
      isSaving,
      isDeleteDialogOpen,
      isDeleting
    } = this.state;

    const polygonCoordinates =
      flexibleStopPlace && flexibleStopPlace.flexibleArea
        ? flexibleStopPlace.flexibleArea.polygon.coordinates
        : [];

    const isDeleteDisabled =
      !flexibleStopPlace ||
      !lines ||
      !!lines
        .filter(l => l.journeyPatterns.length > 0)
        .find(
          l =>
            l.journeyPatterns[0].pointsInSequence[0].flexibleStopPlaceRef ===
            flexibleStopPlace.id
        ) ||
      isDeleting;

    return (
      <div className="stop-place-editor">
        <div className="header">
          <h2>{match.params.id ? 'Rediger' : 'Opprett'} stoppested</h2>

          <div className="buttons">
            <Button variant="success" onClick={this.handleOnSaveClick.bind(this)}>
              Lagre
            </Button>

            {match.params.id && (
              <Button
                variant="negative"
                onClick={() => this.setDeleteDialogOpen(true)}
                disabled={isDeleteDisabled}
              >
                Slett
              </Button>
            )}
          </div>
        </div>

        {flexibleStopPlace ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={(isSaving ? 'Lagrer' : 'Sletter') + ' stoppestedet...'}
          >
            <div className="stop-place-form-container">
              <div className="stop-place-form">
                <Label>* Navn</Label>
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
              </div>

              <PolygonMap
                onClick={this.handleMapOnClick.bind(this)}
                polygon={polygonCoordinates}
              />
            </div>
          </OverlayLoader>
        ) : (
          <Loading
            text={`Laster inn ${
              !flexibleStopPlace ? 'stoppestedet' : 'avhengigheter'
            }...`}
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Slette stoppested"
          message="Er du sikker på at du ønsker å slette dette stoppestedet?"
          buttons={[
            <Button
              key={2}
              onClick={() => this.setDeleteDialogOpen(false)}
              variant="secondary"
              width="md"
              className="action-button"
            >
              Nei
            </Button>,
            <Button
              key={1}
              onClick={this.handleDelete.bind(this)}
              variant="success"
              width="md"
              className="action-button"
            >
              Ja
            </Button>
          ]}
          onClose={() => this.setDeleteDialogOpen(false)}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ flexibleLines }) => ({ lines: flexibleLines });

export default compose(withRouter, connect(mapStateToProps))(
  FlexibleStopPlaceEditor
);
