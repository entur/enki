import { SmallAlertBox } from '@entur/alert';
import {
  NegativeButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from '@entur/button';
import { TextArea, TextField } from '@entur/form';
import { MapIcon } from '@entur/icons';
import { Paragraph } from '@entur/typography';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dropdown } from '@entur/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { loadFlexibleLines } from 'actions/flexibleLines';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace,
} from 'actions/flexibleStopPlaces';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getErrorFeedback } from 'helpers/errorHandling';
import { objectValuesAreEmpty } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { LeafletMouseEvent } from 'leaflet';
import isEqual from 'lodash.isequal';
import FlexibleLine from 'model/FlexibleLine';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import GeoJSON, {
  Coordinate,
  addCoordinate,
  removeLastCoordinate,
  stringIsValidCoordinates,
} from 'model/GeoJSON';
import {
  FLEXIBLE_STOP_AREA_TYPE,
  GEOMETRY_TYPE,
  VEHICLE_MODE,
  flexibleStopAreaTypeMessages,
} from 'model/enums';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import PolygonMap from './components/PolygonMap';
import './styles.scss';
import { validateFlexibleStopPlace } from './validateForm';

const coordinatesToText = (polygonCoordinates: Coordinate[]): string =>
  JSON.stringify(polygonCoordinates);

const transformTextToCoordinates = (text: string): Coordinate[] =>
  JSON.parse(text);

// Map expects coordinates in lat-lon order, whereas geojson has lon-lat
const transformToMapCoordinates = (geojson: Coordinate[]): Coordinate[] =>
  geojson.length === 0 ? geojson : geojson.map(([y, x]) => [x, y]);

const FlexibleStopPlaceEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch<any>();
  const lines = useSelector<GlobalState, FlexibleLine[]>(
    (state) => state.flexibleLines ?? []
  );
  const currentFlexibleStopPlace = useSelector<GlobalState, FlexibleStopPlace>(
    (state) =>
      state.flexibleStopPlaces?.find((fsp) => fsp.id === params.id) ?? {
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
    if (!isLoading && !isEqual(currentFlexibleStopPlace, flexibleStopPlace))
      setFlexibleStopPlace(currentFlexibleStopPlace);
    setCoordinateHolder(
      coordinatesToText(
        currentFlexibleStopPlace.flexibleArea?.polygon?.coordinates ?? []
      )
    );
    // eslint-disable-next-line
  }, [isLoading]);

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      dispatch(loadFlexibleLines(intl))
        .then(() => dispatch(loadFlexibleStopPlaceById(params.id!, intl)))
        .catch(() => navigate('/networks'))
        .then(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(loadFlexibleLines(intl)).then(() => setIsLoading(false));
    }
  }, [dispatch, params.id, history]);

  const handleOnSaveClick = useCallback(() => {
    if (objectValuesAreEmpty(errors)) {
      setSaving(true);
      dispatch(saveFlexibleStopPlace(flexibleStopPlace ?? {}, intl))
        .then(() => navigate('/stop-places'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  }, [dispatch, history, flexibleStopPlace, errors]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    if (flexibleStopPlace?.id) {
      setDeleting(true);
      dispatch(deleteFlexibleStopPlaceById(flexibleStopPlace.id, intl))
        .then(() => navigate('/stop-places'))
        .finally(() => setDeleting(false));
    }
  }, [dispatch, history, flexibleStopPlace]);

  const handleMapOnClick = (e: LeafletMouseEvent) => {
    // Convert coordinate from map to geojson long-lat order
    const newCoordinate: Coordinate = [e.latlng.lng, e.latlng.lat];

    const newCoordinates = addCoordinate(polygonCoordinates, newCoordinate);
    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: newCoordinates,
    });
    setCoordinateHolder(coordinatesToText(newCoordinates));
  };

  const handleDrawPolygonClick = () => {
    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: polygonCoordinates,
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
      type: GEOMETRY_TYPE.POLYGON,
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
    errors.flexibleArea ? formatMessage({ id: errors.flexibleArea }) : '',
    !errors.flexibleArea,
    areaPristine
  );

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarStopPlacesMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'editorEditHeader' })
          : formatMessage({ id: 'editorCreateHeader' })
      }
    >
      <div className="stop-place-editor">
        <Paragraph>{formatMessage({ id: 'editorDescription' })}</Paragraph>

        {flexibleStopPlace && !isLoading ? (
          <OverlayLoader
            className=""
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingOverlayLoaderText' })
                : formatMessage({ id: 'editorDeletingOverlayLoaderText' })
            }
          >
            <div className="stop-place-form-container">
              <div className="stop-place-form">
                <RequiredInputMarker />

                <TextField
                  label={formatMessage({ id: 'editorNameFormLabelText' })}
                  {...getErrorFeedback(
                    errors.name ? formatMessage({ id: errors.name }) : '',
                    !errors.name,
                    namePristine
                  )}
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      name: e.target.value,
                    })
                  }
                />

                <TextArea
                  label={formatMessage({
                    id: 'editorDescriptionFormLabelText',
                  })}
                  value={flexibleStopPlace.description ?? ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      description: e.target.value,
                    })
                  }
                />

                <TextField
                  label={formatMessage({
                    id: 'editorPrivateCodeFormLabelText',
                  })}
                  value={flexibleStopPlace.privateCode ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      privateCode: e.target.value,
                    })
                  }
                />

                <Dropdown
                  label={formatMessage({ id: 'flexibleStopAreaType' })}
                  items={Object.values(FLEXIBLE_STOP_AREA_TYPE).map((v) => ({
                    value: v,
                    label: formatMessage({
                      id: flexibleStopAreaTypeMessages[v],
                    }),
                  }))}
                  value={
                    flexibleStopPlace.keyValues?.find(
                      (v) => v.key === 'FlexibleStopAreaType'
                    )?.values[0] ?? null
                  }
                  onChange={(selectedItem: NormalizedDropdownItemType | null) =>
                    selectedItem &&
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      keyValues: [
                        {
                          key: 'FlexibleStopAreaType',
                          values: [selectedItem.value],
                        },
                      ],
                    })
                  }
                />

                <TextArea
                  label={formatMessage({
                    id: 'editorCoordinatesFormLabelText',
                  })}
                  variant={
                    coordinateHolder === '' ||
                    stringIsValidCoordinates(coordinateHolder)
                      ? undefined
                      : 'error'
                  }
                  feedback={formatMessage({ id: 'errorCoordinates' })}
                  rows={12}
                  value={coordinateHolder}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setCoordinateHolder(e.target.value)
                  }
                  onBlur={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    stringIsValidCoordinates(coordinateHolder)
                      ? changeCoordinates(
                          transformTextToCoordinates(e.target.value)
                        )
                      : undefined
                  }
                  placeholder={coordinatesPlaceholder}
                />

                <PrimaryButton
                  className="draw-polygon-button"
                  onClick={handleDrawPolygonClick}
                  disabled={!stringIsValidCoordinates(coordinateHolder)}
                >
                  {formatMessage({ id: 'editorDrawPolygonButtonText' })}
                  <MapIcon />
                </PrimaryButton>

                <div className="buttons">
                  {params.id && (
                    <NegativeButton
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isDeleteDisabled}
                    >
                      {formatMessage({ id: 'editorDeleteButtonText' })}
                    </NegativeButton>
                  )}

                  <SuccessButton onClick={handleOnSaveClick}>
                    {params.id
                      ? formatMessage({ id: 'editorSaveButtonText' })
                      : formatMessage(
                          {
                            id: 'editorDetailedCreate',
                          },
                          { details: formatMessage({ id: 'stopPlaceText' }) }
                        )}
                  </SuccessButton>
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
                  polygon={transformToMapCoordinates(polygonCoordinates)}
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
                ? formatMessage({ id: 'editorLoadingStopPlaceText' })
                : formatMessage({ id: 'editorLoadingDependenciesText' })
            }
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({ id: 'editorDeleteStopPlaceDialogTitle' })}
          message={formatMessage({ id: 'editorDeleteStopPlaceDialogMessage' })}
          buttons={[
            <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
              {formatMessage({
                id: 'editorDeleteStopPlaceDialogCancelButtonText',
              })}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={handleDelete}>
              {formatMessage({
                id: 'editorDeleteStopPlaceDialogConfirmButtonText',
              })}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>
    </Page>
  );
};

export default FlexibleStopPlaceEditor;
