import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { createSelector } from 'reselect';

const selectFlexibleStopPlace = createSelector(
  state => state.flexibleStopPlaces,
  (_, match) => match.params.id,
  (flexibleStopPlaces, id) => id ? flexibleStopPlaces ? flexibleStopPlaces.find(sp => sp.id === id) : null : new FlexibleStopPlace({
    transportMode: VEHICLE_MODE.BUS
  })
)

const FlexibleStopPlaceEditor = ({ match, history }) => {

  const lines = useSelector(({ flexibleLines }) => flexibleLines);
  const currentFlexibleStopPlace = useSelector(state =>
    selectFlexibleStopPlace(state, match));

  const [flexibleStopPlace, setFlexibleStopPlace] = useState(currentFlexibleStopPlace);
  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFlexibleLines())
  }, [dispatch]);

  useEffect(() => {
    if (match.params.id) {
      dispatch(loadFlexibleStopPlaceById(match.params.id))
        .catch(() => history.push('/networks'));
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    setFlexibleStopPlace(currentFlexibleStopPlace);
  }, [currentFlexibleStopPlace])

  const handleOnSaveClick = useCallback(() => {
    setSaving(true);
    dispatch(saveFlexibleStopPlace(flexibleStopPlace))
      .then(() => history.push('/stop-places'))
      .finally(() => setSaving(false));
  }, [dispatch, history, flexibleStopPlace]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteFlexibleStopPlaceById(flexibleStopPlace.id))
      .then(() => history.push('/stop-places'))
      .finally(() => setDeleting(false));
  }, [dispatch, history, flexibleStopPlace]);

  const handleFieldChange = useCallback((field, value) => {
    setFlexibleStopPlace(flexibleStopPlace.withChanges({
      [field]: value
    }))
  }, [flexibleStopPlace]);

  const handleMapOnClick = useCallback((e) => {
    const flexibleArea = flexibleStopPlace.flexibleArea;
    setFlexibleStopPlace(
      flexibleStopPlace.withChanges({
        flexibleArea: (flexibleArea || new FlexibleArea()).addCoordinate([
          e.latlng.lat,
          e.latlng.lng
        ])
      })
    );
  }, [flexibleStopPlace]);

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
          <Button variant="success" onClick={handleOnSaveClick}>
            Lagre
          </Button>

          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => setDeleteDialogOpen(true)}
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
                onChange={e => handleFieldChange('name', e.target.value)}
              />

              <Label>Beskrivelse</Label>
              <TextArea
                type="text"
                value={flexibleStopPlace.description}
                onChange={e =>
                  handleFieldChange('description', e.target.value)
                }
              />

              <Label>Privat kode</Label>
              <TextField
                type="text"
                value={flexibleStopPlace.privateCode}
                onChange={e =>
                  handleFieldChange('privateCode', e.target.value)
                }
              />
            </div>

            <PolygonMap
              onClick={handleMapOnClick}
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
            onClick={() => setDeleteDialogOpen(false)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            Nei
          </Button>,
          <Button
            key={1}
            onClick={handleDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            Ja
          </Button>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}

export default withRouter(FlexibleStopPlaceEditor);
