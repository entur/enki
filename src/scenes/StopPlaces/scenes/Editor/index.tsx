import { Alert, Button, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { replaceElement, removeElementByIndex } from 'helpers/arrays';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import usePristine from 'hooks/usePristine';
import { LeafletMouseEvent } from 'leaflet';
import GeoJSON, {
  Coordinate,
  addCoordinate,
  removeLastCoordinate,
} from 'model/GeoJSON';
import { KeyValues } from 'model/KeyValues';
import { GEOMETRY_TYPE } from 'model/enums';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import FlexibleAreaPanel from './components/FlexibleAreaPanel';
import PolygonMap from './components/PolygonMap';
import { StopPlaceTypeDropdown } from './components/StopPlaceTypeDropdown';
import { useFlexibleStopPlace } from './hooks/useFlexibleStopPlace';
import { useHandleDelete } from './hooks/useHandleDelete';
import { useHandleOnSaveClick } from './hooks/useHandleOnSaveClick';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { transformToMapCoordinates } from './utils/transformToMapCoordinates';
import { validateFlexibleStopPlace } from './utils/validateForm';
import FormMap from '../../../../components/FormMap';

const FlexibleStopPlaceEditor = () => {
  const params = useParams();
  const intl = useIntl();
  const { formatMessage } = intl;

  const { flexibleStopPlace, setFlexibleStopPlace, lines, isLoading } =
    useFlexibleStopPlace();

  const polygonCoordinates =
    flexibleStopPlace?.flexibleAreas?.map(
      (area) => area.polygon?.coordinates ?? [],
    ) ?? [];

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const [currentAreaIndex, setCurrentAreaIndex] = useState<number>(0);

  const { name, flexibleAreas } = flexibleStopPlace ?? {
    flexibleAreas: [{}],
    keyValues: [],
  };

  const namePristine = usePristine(name, saveClicked);
  const areasPristine = usePristine(flexibleAreas, saveClicked);
  const stopPlaceTypePristine = usePristine(
    flexibleStopPlace?.keyValues,
    saveClicked,
  );

  const errors = validateFlexibleStopPlace(flexibleStopPlace ?? {});

  const handleOnSaveClick = useHandleOnSaveClick(
    flexibleStopPlace,
    () => setSaveClicked(true),
    () => setSaving(true),
    () => setSaving(false),
    errors,
  );

  const handleDelete = useHandleDelete(
    flexibleStopPlace,
    () => setDeleteDialogOpen(false),
    () => setDeleting(true),
    () => setDeleting(false),
  );

  const handleMapOnClick = (e: LeafletMouseEvent) => {
    const newCoordinate: Coordinate = [e.latlng.lng, e.latlng.lat];
    const newCoordinates = addCoordinate(
      polygonCoordinates[currentAreaIndex],
      newCoordinate,
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
      polygonCoordinates[currentAreaIndex],
    );
    changeCoordinates(newCoordinates);
  };

  const createAreaKeyValuesHandler = (index: number) => {
    return (keyValues: KeyValues[]) => {
      const updatedArea = {
        ...flexibleStopPlace?.flexibleAreas?.[index],
        keyValues,
      };
      setFlexibleStopPlace({
        ...flexibleStopPlace,
        flexibleAreas: replaceElement(
          flexibleStopPlace?.flexibleAreas ?? [],
          index,
          updatedArea,
        ),
      });
    };
  };

  const createAreaToggleHandler = (index: number) => {
    return () => {
      if (currentAreaIndex === index) {
        setCurrentAreaIndex(currentAreaIndex > 0 ? currentAreaIndex - 1 : 0);
      } else {
        setCurrentAreaIndex(index);
      }
    };
  };

  const createAreaRemoveHandler = (index: number) => {
    return () => {
      setFlexibleStopPlace((current) => ({
        ...current,
        flexibleAreas: removeElementByIndex(
          current?.flexibleAreas ?? [],
          index,
        ),
      }));
      setCurrentAreaIndex(currentAreaIndex > 0 ? currentAreaIndex - 1 : 0);
    };
  };

  const isDeleteDisabled: boolean =
    isDeleting ||
    !!lines
      .filter((l) => l.journeyPatterns?.length ?? false)
      .find(
        (l) =>
          l.journeyPatterns?.[0].pointsInSequence[0].flexibleStopPlaceRef ===
          flexibleStopPlace?.id,
      );

  const nameError = getMuiErrorProps(
    errors.name ? formatMessage({ id: errors.name }) : '',
    !errors.name,
    namePristine,
  );

  const stopPlaceTypeError = getMuiErrorProps(
    errors.flexibleStopPlaceType
      ? formatMessage({ id: errors.flexibleStopPlaceType })
      : '',
    !errors.flexibleStopPlaceType,
    stopPlaceTypePristine,
  );

  const areaError = getMuiErrorProps(
    errors.flexibleArea ? formatMessage({ id: errors.flexibleArea }) : '',
    !errors.flexibleArea,
    areasPristine,
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
      <>
        <Typography variant="body1">
          {formatMessage({ id: 'editorDescription' })}
        </Typography>

        <Grid container spacing={2}>
          {nameError.helperText && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{nameError.helperText}</Alert>
            </Grid>
          )}

          {stopPlaceTypeError.helperText && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{stopPlaceTypeError.helperText}</Alert>
            </Grid>
          )}

          {areaError.helperText && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{areaError.helperText}</Alert>
            </Grid>
          )}
        </Grid>
        {flexibleStopPlace && !isLoading ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingOverlayLoaderText' })
                : formatMessage({ id: 'editorDeletingOverlayLoaderText' })
            }
          >
            <Stack direction="row" spacing={2}>
              <Stack spacing={2} sx={{ maxWidth: 450 }}>
                <RequiredInputMarker />

                <TextField
                  variant="outlined"
                  fullWidth
                  label={formatMessage({ id: 'editorNameFormLabelText' })}
                  {...getMuiErrorProps(
                    errors.name ? formatMessage({ id: errors.name }) : '',
                    !errors.name,
                    namePristine,
                  )}
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      name: e.target.value,
                    })
                  }
                />

                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
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
                  variant="outlined"
                  fullWidth
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
                    setFlexibleStopPlace({
                      ...flexibleStopPlace,
                      keyValues,
                    });
                  }}
                />

                {flexibleStopPlace.flexibleAreas?.map((area, index) => (
                  <FlexibleAreaPanel
                    key={area.id ?? `area-${index}`}
                    area={area}
                    index={index}
                    isOpen={currentAreaIndex === index}
                    canDelete={
                      (flexibleStopPlace.flexibleAreas?.length ?? 0) >= 2
                    }
                    onToggle={createAreaToggleHandler(index)}
                    onKeyValuesUpdate={createAreaKeyValuesHandler(index)}
                    onRemove={createAreaRemoveHandler(index)}
                    onDrawPolygonClick={handleDrawPolygonClick}
                    coordinates={area.polygon?.coordinates ?? []}
                    onCoordinatesChange={changeCoordinates}
                  />
                ))}

                <Button
                  variant="outlined"
                  onClick={() => {
                    setFlexibleStopPlace((current) => ({
                      ...current,
                      flexibleAreas: [...(current?.flexibleAreas ?? []), {}],
                    }));
                    setCurrentAreaIndex(
                      flexibleStopPlace.flexibleAreas?.length ?? -1,
                    );
                  }}
                >
                  {formatMessage({ id: 'stopPlaceAddAreaButtonLabel' })}
                </Button>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  sx={{ mt: 4 }}
                >
                  {params.id && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isDeleteDisabled}
                    >
                      {formatMessage({ id: 'editorDeleteButtonText' })}
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOnSaveClick}
                  >
                    {params.id
                      ? formatMessage({ id: 'editorSaveButtonText' })
                      : formatMessage(
                          {
                            id: 'editorDetailedCreate',
                          },
                          { details: formatMessage({ id: 'stopPlaceText' }) },
                        )}
                  </Button>
                </Stack>
              </Stack>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 0,
                }}
              >
                <FormMap undo={handleUndoClick}>
                  <PolygonMap
                    addCoordinate={handleMapOnClick}
                    polygon={transformToMapCoordinates(
                      flexibleStopPlace.flexibleAreas?.[currentAreaIndex]
                        .polygon?.coordinates ?? [],
                    )}
                    otherPolygons={
                      flexibleStopPlace.flexibleAreas
                        ?.filter((_, index) => index !== currentAreaIndex)
                        .map((area) =>
                          transformToMapCoordinates(
                            area.polygon?.coordinates ?? [],
                          ),
                        ) ?? []
                    }
                  />
                </FormMap>
              </Box>
            </Stack>
          </OverlayLoader>
        ) : (
          <Loading
            children={null}
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
            <Button
              variant="outlined"
              key={2}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({
                id: 'editorDeleteStopPlaceDialogCancelButtonText',
              })}
            </Button>,
            <Button
              variant="contained"
              color="error"
              key={1}
              onClick={handleDelete}
            >
              {formatMessage({
                id: 'editorDeleteStopPlaceDialogConfirmButtonText',
              })}
            </Button>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </>
    </Page>
  );
};

export default FlexibleStopPlaceEditor;
