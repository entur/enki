import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Label, TextField, TextArea } from '@entur/component-library';

import { FlexibleStopPlace, FlexibleArea } from 'model';
import { VEHICLE_MODE } from 'model/enums';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace
} from 'actions/flexibleStopPlaces';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import ConfirmDialog from 'components/ConfirmDialog';

import PolygonMap from './components/PolygonMap';
import './styles.css';
import { createSelector } from 'reselect';
import messages from './messages';
import { selectIntl } from 'i18n';
import validateForm from './validateForm';
import Errors from 'components/Errors';

const selectFlexibleStopPlace = createSelector(
  state => state.flexibleStopPlaces,
  (_, match) => match.params.id,
  (flexibleStopPlaces, id) =>
    id
      ? flexibleStopPlaces
        ? flexibleStopPlaces.find(sp => sp.id === id)
        : null
      : new FlexibleStopPlace({
          transportMode: VEHICLE_MODE.BUS
        })
);

const FlexibleStopPlaceEditor = ({ match, history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const lines = useSelector(({ flexibleLines }) => flexibleLines);
  const currentFlexibleStopPlace = useSelector(state =>
    selectFlexibleStopPlace(state, match)
  );

  const [flexibleStopPlace, setFlexibleStopPlace] = useState(
    currentFlexibleStopPlace
  );
  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({
    name: [],
    flexibleArea: []
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFlexibleLines());
  }, [dispatch]);

  useEffect(() => {
    if (match.params.id) {
      dispatch(loadFlexibleStopPlaceById(match.params.id)).catch(() =>
        history.push('/networks')
      );
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    setFlexibleStopPlace(currentFlexibleStopPlace);
  }, [currentFlexibleStopPlace]);

  const handleOnSaveClick = useCallback(() => {
    let [isValid, errors] = validateForm(flexibleStopPlace);
    if (!isValid) {
      setErrors(errors);
    } else {
      setSaving(true);
      dispatch(saveFlexibleStopPlace(flexibleStopPlace))
        .then(() => history.push('/stop-places'))
        .finally(() => setSaving(false));
    }
  }, [dispatch, history, flexibleStopPlace]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteFlexibleStopPlaceById(flexibleStopPlace.id))
      .then(() => history.push('/stop-places'))
      .finally(() => setDeleting(false));
  }, [dispatch, history, flexibleStopPlace]);

  const onFieldChange = useCallback(
    (field, value) => {
      setFlexibleStopPlace(flexibleStopPlace.withFieldChange(field, value));
    },
    [flexibleStopPlace]
  );

  const handleMapOnClick = useCallback(
    e => {
      const flexibleArea = flexibleStopPlace.flexibleArea;
      onFieldChange(
        flexibleStopPlace,
        'flexibleArea',
        (flexibleArea || new FlexibleArea()).addCoordinate([
          e.latlng.lat,
          e.latlng.lng
        ])
      );
    },
    [flexibleStopPlace, onFieldChange]
  );

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
        <h2>
          {match.params.id
            ? formatMessage(messages.editHeader)
            : formatMessage(messages.createHeader)}
        </h2>

        <div className="buttons">
          <Button variant="success" onClick={handleOnSaveClick}>
            {formatMessage(messages.saveButtonText)}
          </Button>

          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleteDisabled}
            >
              {formatMessage(messages.deleteButtonText)}
            </Button>
          )}
        </div>
      </div>

      {flexibleStopPlace ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.savingOverlayLoaderText)
              : formatMessage(messages.deletingOverlayLoaderText)
          }
        >
          <div className="stop-place-form-container">
            <div className="stop-place-form">
              <Errors errors={errors.name} />
              <Label>{formatMessage(messages.nameFormLabelText)}</Label>
              <TextField
                type="text"
                value={flexibleStopPlace.name}
                onChange={e => onFieldChange('name', e.target.value)}
              />

              <Label>{formatMessage(messages.descriptionFormLabelText)}</Label>
              <TextArea
                type="text"
                value={flexibleStopPlace.description}
                onChange={e => onFieldChange('description', e.target.value)}
              />

              <Label>{formatMessage(messages.privateCodeFormLabelText)}</Label>
              <TextField
                type="text"
                value={flexibleStopPlace.privateCode}
                onChange={e => onFieldChange('privateCode', e.target.value)}
              />
            </div>

            <div className="stop-place-flexible-area">
              <Errors errors={errors.flexibleArea} />
              <PolygonMap
                onClick={handleMapOnClick}
                polygon={polygonCoordinates}
              />
            </div>
          </div>
        </OverlayLoader>
      ) : (
        <Loading
          text={
            flexibleStopPlace
              ? formatMessage(messages.loadingStopPlaceText)
              : formatMessage(messages.loadingDependenciesText)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.deleteStopPlaceDialogTitle)}
        message={formatMessage(messages.deleteStopPlaceDialogMessage)}
        buttons={[
          <Button
            key={2}
            onClick={() => setDeleteDialogOpen(false)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteStopPlaceDialogCancelButtonText)}
          </Button>,
          <Button
            key={1}
            onClick={handleDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteStopPlaceDialogConfirmButtonText)}
          </Button>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleStopPlaceEditor);
