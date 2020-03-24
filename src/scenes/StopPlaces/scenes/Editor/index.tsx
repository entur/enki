import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import {
  PrimaryButton,
  NegativeButton,
  SecondaryButton,
  SuccessButton
} from '@entur/button';
import { MapIcon } from '@entur/icons';
import { SmallAlertBox } from '@entur/alert';
import { Paragraph } from '@entur/typography';

import ConfirmDialog from 'components/ConfirmDialog';
import { GEOMETRY_TYPE, VEHICLE_MODE } from 'model/enums';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace
} from 'actions/flexibleStopPlaces';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import PolygonMap from './components/PolygonMap';
import './styles.scss';
import messages from './messages';
import { selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import FlexibleLine from 'model/FlexibleLine';
import { MatchParams } from 'http/http';
import {
  FlexibleStopPlaceErrors,
  validateFlexibleStopPlace
} from 'scenes/StopPlaces/scenes/Editor/validateForm';
import { objectValuesAreEmpty } from 'helpers/forms';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import GeoJSON, {
  removeLastCoordinate,
  addCoordinate,
  Coordinate,
  stringIsValidCoordinates
} from 'model/GeoJSON';
import { equals } from 'ramda';

// Show coordinates in GeoJson order [Long, Lat]
const coordinatesToText = (polygonCoordinates: Coordinate[]): string =>
  polygonCoordinates.length === 0
    ? ''
    : JSON.stringify(polygonCoordinates.map(([x, y]) => [y, x]));

// Transform input coordinates from GeoJson order [Long, Lat] to [Lat, Long]
const transformTextToCoordinates = (text: string): Coordinate[] =>
  JSON.parse(text).map(([x, y]: Coordinate) => [y, x]);

const FlexibleStopPlaceEditor = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch<any>();
  const lines = useSelector<GlobalState, FlexibleLine[]>(
    state => state.flexibleLines ?? []
  );
  const currentFlexibleStopPlace = useSelector<GlobalState, FlexibleStopPlace>(
    state =>
      state.flexibleStopPlaces?.find(fsp => fsp.id === match.params.id) ?? {
        transportMode: VEHICLE_MODE.BUS
      }
  );

  const [flexibleStopPlace, setFlexibleStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);

  const polygonCoordinates =
    flexibleStopPlace?.flexibleArea?.polygon?.coordinates ?? [];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [coordinateHolder, setCoordinateHolder] = useState<string>(
    coordinatesToText(polygonCoordinates)
  );
  const [errors, setErrors] = useState<FlexibleStopPlaceErrors>({
    name: undefined,
    flexibleArea: undefined
  });

  useEffect(() => {
    if (!isLoading && !equals(currentFlexibleStopPlace, flexibleStopPlace))
      setFlexibleStopPlace(currentFlexibleStopPlace);
    setCoordinateHolder(
      coordinatesToText(
        currentFlexibleStopPlace.flexibleArea?.polygon?.coordinates ?? []
      )
    );
    // eslint-disable-next-line
  }, [isLoading]);

  useEffect(() => {
    if (match.params.id) {
      setIsLoading(true);
      dispatch(loadFlexibleLines())
        .then(() => dispatch(loadFlexibleStopPlaceById(match.params.id)))
        .catch(() => history.push('/networks'))
        .then(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(loadFlexibleLines()).then(() => setIsLoading(false));
    }
  }, [dispatch, match.params.id, history]);

  const handleOnSaveClick = useCallback(() => {
    const errors = validateFlexibleStopPlace(flexibleStopPlace ?? {});
    if (!objectValuesAreEmpty(errors)) {
      setErrors(errors);
    } else {
      setSaving(true);
      dispatch(saveFlexibleStopPlace(flexibleStopPlace ?? {}))
        .then(() => history.push('/stop-places'))
        .finally(() => setSaving(false));
    }
  }, [dispatch, history, flexibleStopPlace]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    if (flexibleStopPlace?.id) {
      setDeleting(true);
      dispatch(deleteFlexibleStopPlaceById(flexibleStopPlace.id))
        .then(() => history.push('/stop-places'))
        .finally(() => setDeleting(false));
    }
  }, [dispatch, history, flexibleStopPlace]);

  const handleMapOnClick = (e: any) => {
    const newCoordinates = addCoordinate(polygonCoordinates, [
      e.latlng.lat,
      e.latlng.lng
    ]);
    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: newCoordinates
    });
    setCoordinateHolder(coordinatesToText(newCoordinates));
  };

  const handleDrawPolygonClick = () => {
    // Transform input coordinates from GeoJson order [Long, Lat] to [Lat, Long]
    const coords = JSON.parse(
      coordinatesToText(polygonCoordinates)
    ).map(([x, y]: Coordinate) => [y, x]);

    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: coords
    });
  };

  const changePolygon = (polygon: GeoJSON) =>
    setFlexibleStopPlace({
      ...flexibleStopPlace,
      flexibleArea: {
        ...flexibleStopPlace?.flexibleArea,
        polygon: polygon
      }
    });

  const changeCoordinates = (coordinates: Coordinate[]) =>
    changePolygon({
      ...flexibleStopPlace?.flexibleArea?.polygon,
      coordinates
    });

  const handleUndoClick = () => {
    const newCoordinates = removeLastCoordinate(polygonCoordinates);
    changeCoordinates(newCoordinates);
    setCoordinateHolder(coordinatesToText(newCoordinates));
  };

  const isDeleteDisabled: boolean =
    isDeleting ||
    !!lines
      .filter(l => l.journeyPatterns?.length ?? false)
      .find(
        l =>
          l.journeyPatterns?.[0].pointsInSequence[0].flexibleStopPlaceRef ===
          flexibleStopPlace?.id
      );

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
        <PageHeader
          withBackButton
          title={
            match.params.id
              ? formatMessage(messages.editHeader)
              : formatMessage(messages.createHeader)
          }
        />
      </div>

      <Paragraph>{formatMessage(messages.description)}</Paragraph>

      {flexibleStopPlace && !isLoading ? (
        <OverlayLoader
          className=""
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.savingOverlayLoaderText)
              : formatMessage(messages.deletingOverlayLoaderText)
          }
        >
          <div className="stop-place-form-container">
            <div className="stop-place-form">
              <div>
                <InputGroup
                  label={formatMessage(messages.nameFormLabelText)}
                  variant={errors.name ? 'error' : undefined}
                  feedback={
                    errors.name ? formatMessage(errors.name) : undefined
                  }
                >
                  <TextField
                    defaultValue={flexibleStopPlace.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        name: e.target.value
                      })
                    }
                  />
                </InputGroup>
                <InputGroup
                  label={formatMessage(messages.descriptionFormLabelText)}
                >
                  <TextArea
                    type="text"
                    value={flexibleStopPlace.description ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        description: e.target.value
                      })
                    }
                  />
                </InputGroup>

                <InputGroup
                  label={formatMessage(messages.privateCodeFormLabelText)}
                >
                  <TextField
                    value={flexibleStopPlace.privateCode ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        privateCode: e.target.value
                      })
                    }
                  />
                </InputGroup>

                <InputGroup
                  label={formatMessage(messages.coordinatesFormLabelText)}
                  variant={
                    coordinateHolder === '' ||
                    stringIsValidCoordinates(coordinateHolder)
                      ? undefined
                      : 'error'
                  }
                  feedback={formatMessage(messages.invalidCoordinates)}
                >
                  <TextArea
                    rows="12"
                    value={coordinateHolder}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCoordinateHolder(e.target.value)
                    }
                    onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                      stringIsValidCoordinates(coordinateHolder)
                        ? changeCoordinates(
                            transformTextToCoordinates(e.target.value)
                          )
                        : undefined
                    }
                    placeholder={coordinatesPlaceholder}
                  />
                </InputGroup>
                <PrimaryButton
                  className="draw-polygon-button"
                  onClick={handleDrawPolygonClick}
                  disabled={!stringIsValidCoordinates(coordinateHolder)}
                >
                  {formatMessage(messages.drawPolygonButtonText)}
                  <MapIcon />
                </PrimaryButton>
              </div>

              <div>
                <div className="buttons">
                  {match.params.id && (
                    <NegativeButton
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isDeleteDisabled}
                    >
                      {formatMessage(messages.deleteButtonText)}
                    </NegativeButton>
                  )}

                  <SuccessButton onClick={handleOnSaveClick}>
                    {formatMessage(messages.saveButtonText)}
                  </SuccessButton>
                </div>
              </div>
            </div>

            <div className="stop-place-flexible-area">
              {errors.flexibleArea && (
                <SmallAlertBox variant="error">
                  {formatMessage(errors.flexibleArea)}
                </SmallAlertBox>
              )}
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
          children={null}
          className=""
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
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleStopPlaceEditor);
