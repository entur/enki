import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import {
  SuccessButton,
  NegativeButton,
  SecondaryButton,
  TertiaryButton
} from '@entur/button';
import { MapIcon } from '@entur/icons';

import { FlexibleStopPlace, FlexibleArea, GeoJSON } from 'model';
import { VEHICLE_MODE, GEOMETRY_TYPE } from 'model/enums';
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
import './styles.scss';
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

  const polygonCoordinates =
    flexibleStopPlace && flexibleStopPlace.flexibleArea
      ? flexibleStopPlace.flexibleArea.polygon.coordinates
      : [];

  const [coordinates, setCoordinates] = useState(() =>
    polygonCoordinates.length === 0 ? '' : coordinatesToText()
  );

  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({
    name: [],
    flexibleArea: []
  });

  const dispatch = useDispatch();

  function coordinatesToText() {
    // Show coordinates in GeoJson order [Long, Lat]
    return JSON.stringify(polygonCoordinates.map(([x, y]) => [y, x]));
  }

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
        'flexibleArea',
        (flexibleArea || new FlexibleArea()).addCoordinate([
          e.latlng.lat,
          e.latlng.lng
        ])
      );
    },
    [flexibleStopPlace, onFieldChange]
  );

  const handleDrawPolygonClick = useCallback(() => {
    // Transform input coordinates from GeoJson order [Long, Lat] to [Lat, Long]
    let coords = JSON.parse(coordinates).map(([x, y]) => [y, x]);

    const polygon = new GeoJSON({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: coords
    });

    const flexibleArea = flexibleStopPlace.flexibleArea || new FlexibleArea();
    flexibleArea.polygon = polygon;

    setFlexibleStopPlace(
      flexibleStopPlace.withFieldChange('flexibleArea', flexibleArea)
    );
  }, [flexibleStopPlace, coordinates]);

  const handleUndoClick = useCallback(
    e => {
      const flexibleArea = flexibleStopPlace.flexibleArea;
      onFieldChange('flexibleArea', flexibleArea.removeLastCoordinate());
    },
    [flexibleStopPlace, onFieldChange]
  );

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

  const coordinatesPlaceholder = `[
    [
      12.345,
      67.890
    ], [
      12.345,
      67.890
    ], [
      12.345,
      67.890
    ], [
      12.345,
      67.890
    ]
  ]`;

  return (
    <div className="stop-place-editor">
      <div className="header">
        <h2>
          {match.params.id
            ? formatMessage(messages.editHeader)
            : formatMessage(messages.createHeader)}
        </h2>

        <div className="buttons">
          <SuccessButton onClick={handleOnSaveClick}>
            {formatMessage(messages.saveButtonText)}
          </SuccessButton>

          {match.params.id && (
            <NegativeButton
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleteDisabled}
            >
              {formatMessage(messages.deleteButtonText)}
            </NegativeButton>
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
              <InputGroup label={formatMessage(messages.nameFormLabelText)}>
                <TextField
                  defaultValue={flexibleStopPlace.name}
                  onChange={e => onFieldChange('name', e.target.value)}
                />
              </InputGroup>
              <InputGroup
                label={formatMessage(messages.descriptionFormLabelText)}
              >
                <TextArea
                  type="text"
                  value={flexibleStopPlace.description}
                  onChange={e => onFieldChange('description', e.target.value)}
                />
              </InputGroup>

              <InputGroup
                label={formatMessage(messages.privateCodeFormLabelText)}
              >
                <TextField
                  value={flexibleStopPlace.privateCode}
                  onChange={e => onFieldChange('privateCode', e.target.value)}
                />
              </InputGroup>

              <InputGroup
                label={formatMessage(messages.coordinatesFormLabelText)}
              >
                <TextArea
                  rows="12"
                  value={coordinates}
                  onChange={e => setCoordinates(e.target.value)}
                  placeholder={coordinatesPlaceholder}
                />
              </InputGroup>
              <TertiaryButton
                className="draw-polygon-button"
                onClick={handleDrawPolygonClick}
              >
                <MapIcon />
                {formatMessage(messages.drawPolygonButtonText)}
              </TertiaryButton>
            </div>

            <div className="stop-place-flexible-area">
              <Errors errors={errors.flexibleArea} />
              <PolygonMap
                addCoordinate={handleMapOnClick}
                polygon={polygonCoordinates}
                undo={handleUndoClick}
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
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.deleteStopPlaceDialogCancelButtonText)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage(messages.deleteStopPlaceDialogConfirmButtonText)}
          </SuccessButton>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleStopPlaceEditor);
