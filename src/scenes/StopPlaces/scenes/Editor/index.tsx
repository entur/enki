import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import {
  PrimaryButton,
  NegativeButton,
  SecondaryButton,
  SuccessButton,
} from '@entur/button';
import { MapIcon } from '@entur/icons';
import { SmallAlertBox } from '@entur/alert';
import { Paragraph, Label } from '@entur/typography';

import ConfirmDialog from 'components/ConfirmDialog';
import { GEOMETRY_TYPE, VEHICLE_MODE } from 'model/enums';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace,
} from 'actions/flexibleStopPlaces';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import PolygonMap from './components/PolygonMap';
import './styles.scss';
import { selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import FlexibleLine from 'model/FlexibleLine';
import { MatchParams } from 'http/http';
import { validateFlexibleStopPlace } from './validateForm';
import { objectValuesAreEmpty } from 'helpers/forms';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import GeoJSON, {
  removeLastCoordinate,
  addCoordinate,
  Coordinate,
  stringIsValidCoordinates,
} from 'model/GeoJSON';
import { equals } from 'ramda';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import RequiredInputMarker from 'components/RequiredInputMarker';

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
  history,
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch<any>();
  const lines = useSelector<GlobalState, FlexibleLine[]>(
    (state) => state.flexibleLines ?? []
  );
  const currentFlexibleStopPlace = useSelector<GlobalState, FlexibleStopPlace>(
    (state) =>
      state.flexibleStopPlaces?.find((fsp) => fsp.id === match.params.id) ?? {
        transportMode: VEHICLE_MODE.BUS,
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
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [coordinateHolder, setCoordinateHolder] = useState<string>(
    coordinatesToText(polygonCoordinates)
  );

  const { name, flexibleArea } = flexibleStopPlace ?? {};

  const namePristine = usePristine(name, saveClicked);
  const areaPristine = usePristine(flexibleArea, saveClicked);

  const errors = validateFlexibleStopPlace(flexibleStopPlace ?? {});

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
    if (objectValuesAreEmpty(errors)) {
      setSaving(true);
      dispatch(saveFlexibleStopPlace(flexibleStopPlace ?? {}))
        .then(() => history.push('/stop-places'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  }, [dispatch, history, flexibleStopPlace, errors]);

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
      e.latlng.lng,
    ]);
    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: newCoordinates,
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
      coordinates: coords,
    });
  };

  const changePolygon = (polygon: GeoJSON) =>
    setFlexibleStopPlace({
      ...flexibleStopPlace,
      flexibleArea: {
        ...flexibleStopPlace?.flexibleArea,
        polygon: polygon,
      },
    });

  const changeCoordinates = (coordinates: Coordinate[]) =>
    changePolygon({
      ...flexibleStopPlace?.flexibleArea?.polygon,
      coordinates,
    });

  const handleUndoClick = () => {
    const newCoordinates = removeLastCoordinate(polygonCoordinates);
    changeCoordinates(newCoordinates);
    setCoordinateHolder(coordinatesToText(newCoordinates));
  };

  const isDeleteDisabled: boolean =
    isDeleting ||
    !!lines
      .filter((l) => l.journeyPatterns?.length ?? false)
      .find(
        (l) =>
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

  const areaError = getErrorFeedback(
    errors.flexibleArea ? formatMessage(errors.flexibleArea) : '',
    !errors.flexibleArea,
    areaPristine
  );

  return (
    <div className="stop-place-editor">
      <div className="header">
        <PageHeader
          withBackButton
          title={
            match.params.id
              ? formatMessage('editorEditHeader')
              : formatMessage('editorCreateHeader')
          }
        />
      </div>

      <Paragraph>{formatMessage('editorDescription')}</Paragraph>

      {flexibleStopPlace && !isLoading ? (
        <OverlayLoader
          className=""
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage('editorSavingOverlayLoaderText')
              : formatMessage('editorDeletingOverlayLoaderText')
          }
        >
          <div className="stop-place-form-container">
            <div className="stop-place-form">
              <RequiredInputMarker />
              <div>
                <InputGroup
                  label={formatMessage('editorNameFormLabelText')}
                  {...getErrorFeedback(
                    errors.name ? formatMessage(errors.name) : '',
                    !errors.name,
                    namePristine
                  )}
                >
                  <TextField
                    defaultValue={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        name: e.target.value,
                      })
                    }
                  />
                </InputGroup>
                <InputGroup
                  label={formatMessage('editorDescriptionFormLabelText')}
                >
                  <TextArea
                    type="text"
                    value={flexibleStopPlace.description ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        description: e.target.value,
                      })
                    }
                  />
                </InputGroup>

                <InputGroup
                  label={formatMessage('editorPrivateCodeFormLabelText')}
                >
                  <TextField
                    value={flexibleStopPlace.privateCode ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFlexibleStopPlace({
                        ...flexibleStopPlace,
                        privateCode: e.target.value,
                      })
                    }
                  />
                </InputGroup>

                <InputGroup
                  label={formatMessage('editorCoordinatesFormLabelText')}
                  variant={
                    coordinateHolder === '' ||
                    stringIsValidCoordinates(coordinateHolder)
                      ? undefined
                      : 'error'
                  }
                  feedback={formatMessage('errorCoordinates')}
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
                  {formatMessage('editorDrawPolygonButtonText')}
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
                      {formatMessage('editorDeleteButtonText')}
                    </NegativeButton>
                  )}

                  <SuccessButton onClick={handleOnSaveClick}>
                    {formatMessage('editorSaveButtonText')}
                  </SuccessButton>
                </div>
              </div>
            </div>

            <div className="stop-place-flexible-area">
              {areaError.feedback && (
                <SmallAlertBox variant="error">
                  {areaError.feedback}
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
              ? formatMessage('editorLoadingStopPlaceText')
              : formatMessage('editorLoadingDependenciesText')
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage('editorDeleteStopPlaceDialogTitle')}
        message={formatMessage('editorDeleteStopPlaceDialogMessage')}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage('editorDeleteStopPlaceDialogCancelButtonText')}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage('editorDeleteStopPlaceDialogConfirmButtonText')}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleStopPlaceEditor);
