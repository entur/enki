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
import { ChangeEvent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ExpandablePanel } from '@entur/expand';
import {
  deleteFlexibleStopPlaceById,
  saveFlexibleStopPlace,
} from 'actions/flexibleStopPlaces';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getErrorFeedback } from 'helpers/errorHandling';
import { objectValuesAreEmpty } from 'helpers/forms';
import { createUuid } from 'helpers/generators';
import usePristine from 'hooks/usePristine';
import { LeafletMouseEvent } from 'leaflet';
import GeoJSON, {
  Coordinate,
  addCoordinate,
  removeLastCoordinate,
} from 'model/GeoJSON';
import { KeyValues } from 'model/KeyValues';
import { GEOMETRY_TYPE } from 'model/enums';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { CoordinatesInputField } from './components/CoordinatesInputField';
import PolygonMap from './components/PolygonMap';
import { StopPlaceTypeDropdown } from './components/StopPlaceTypeDropdown';
import { useFlexibleStopPlace } from './hooks/useFlexibleStopPlace';
import './styles.scss';
import { transformToMapCoordinates } from './utils/transformToMapCoordinates';
import { validateFlexibleStopPlace } from './utils/validateForm';

const FlexibleStopPlaceEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch<any>();

  const { flexibleStopPlace, setFlexibleStopPlace, lines, isLoading } =
    useFlexibleStopPlace();

  const polygonCoordinates =
    flexibleStopPlace?.flexibleAreas?.map(
      (area) => area.polygon?.coordinates ?? []
    ) ?? [];

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const [currentAreaIndex, setCurrentAreaIndex] = useState<number>(0);

  const { name, flexibleAreas } = flexibleStopPlace ?? {};

  const namePristine = usePristine(name, saveClicked);
  const areasPristine = usePristine(flexibleAreas, saveClicked);

  const errors = validateFlexibleStopPlace(flexibleStopPlace ?? {});

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

    const newCoordinates = addCoordinate(
      polygonCoordinates[currentAreaIndex],
      newCoordinate
    );

    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: newCoordinates,
    });
  };

  const handleDrawPolygonClick = () => {
    changePolygon({
      type: GEOMETRY_TYPE.POLYGON,
      coordinates: polygonCoordinates[currentAreaIndex],
    });
  };

  const changePolygon = (polygon: GeoJSON) => {
    const newFlexibleAreas = flexibleStopPlace?.flexibleAreas?.slice() ?? [];
    newFlexibleAreas[currentAreaIndex] = {
      ...newFlexibleAreas[currentAreaIndex],
      polygon,
    };
    setFlexibleStopPlace({
      ...flexibleStopPlace,
      flexibleAreas: newFlexibleAreas,
    });
  };

  const changeCoordinates = (coordinates: Coordinate[]) =>
    changePolygon({
      ...flexibleStopPlace?.flexibleArea?.polygon,
      type: GEOMETRY_TYPE.POLYGON,
      coordinates,
    });

  const handleUndoClick = () => {
    const newCoordinates = removeLastCoordinate(
      polygonCoordinates[currentAreaIndex]
    );
    changeCoordinates(newCoordinates);
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

  const areaError = getErrorFeedback(
    errors.flexibleArea ? formatMessage({ id: errors.flexibleArea }) : '',
    !errors.flexibleArea,
    areasPristine
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

                <StopPlaceTypeDropdown
                  label={formatMessage({ id: 'flexibleStopAreaType' })}
                  keyValues={flexibleStopPlace.keyValues ?? []}
                  keyValuesUpdate={(keyValues: KeyValues[]) => {
                    console.log(keyValues);
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      keyValues,
                    });
                  }}
                />

                {flexibleStopPlace.flexibleAreas?.map((area, index) => (
                  <ExpandablePanel
                    key={createUuid()}
                    title={'Flexible area ' + (index + 1)}
                    open={currentAreaIndex === index}
                    onToggle={
                      currentAreaIndex === index
                        ? () =>
                            setCurrentAreaIndex(
                              currentAreaIndex > 0 ? currentAreaIndex - 1 : 0
                            )
                        : () => setCurrentAreaIndex(index)
                    }
                  >
                    <div className="stop-place-form">
                      <StopPlaceTypeDropdown
                        label="Override stop place type"
                        keyValues={area.keyValues}
                        keyValuesUpdate={(keyValues) => {
                          setFlexibleStopPlace({
                            ...flexibleStopPlace,
                            flexibleAreas: flexibleStopPlace.flexibleAreas?.map(
                              (localArea, localIndex) => {
                                if (localIndex === index) {
                                  return {
                                    ...localArea,
                                    keyValues,
                                  };
                                } else {
                                  return localArea;
                                }
                              }
                            ),
                          });
                        }}
                      />

                      <CoordinatesInputField
                        coordinates={area.polygon?.coordinates || []}
                        changeCoordinates={changeCoordinates}
                      />

                      <PrimaryButton
                        className="draw-polygon-button"
                        onClick={handleDrawPolygonClick}
                        // disabled={
                        //   !stringIsValidCoordinates(
                        //     coordinateHolder[index]
                        //   )
                        // }
                      >
                        {formatMessage({ id: 'editorDrawPolygonButtonText' })}
                        <MapIcon />
                      </PrimaryButton>

                      <SecondaryButton
                        disabled={
                          (flexibleStopPlace.flexibleAreas?.length ?? 0) < 2
                        }
                        onClick={() => {
                          setFlexibleStopPlace((current) => ({
                            ...current,
                            flexibleAreas: (
                              current?.flexibleAreas ?? []
                            ).filter((_, i) => i !== index),
                          }));
                          setCurrentAreaIndex(
                            currentAreaIndex > 0 ? currentAreaIndex - 1 : 0
                          );
                        }}
                      >
                        Remove area
                      </SecondaryButton>
                    </div>
                  </ExpandablePanel>
                ))}

                <SecondaryButton
                  onClick={() => {
                    setFlexibleStopPlace((current) => ({
                      ...current,
                      flexibleAreas: [...(current?.flexibleAreas ?? []), {}],
                    }));
                    setCurrentAreaIndex(
                      flexibleStopPlace.flexibleAreas?.length ?? -1
                    );
                  }}
                >
                  Add area
                </SecondaryButton>

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
                  polygon={transformToMapCoordinates(
                    flexibleStopPlace.flexibleAreas?.[currentAreaIndex].polygon
                      ?.coordinates ?? []
                  )}
                  otherPolygons={
                    flexibleStopPlace.flexibleAreas
                      ?.filter((_, index) => index !== currentAreaIndex)
                      .map((area) =>
                        transformToMapCoordinates(
                          area.polygon?.coordinates ?? []
                        )
                      ) ?? []
                  }
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
