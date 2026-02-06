import { Button, Typography } from '@mui/material';
import {
  deleteDayTypeById,
  loadDayTypeById,
  loadDayTypes,
  saveDayType,
} from 'actions/dayTypes';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import DayType, { createNewDayType } from 'model/DayType';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { DayTypeForm } from './DayTypeForm';
import Stack from '@mui/material/Stack';

const getCurrentDayTypeSelector = (params: Params) => (state: GlobalState) =>
  state.dayTypes?.find((dt) => dt.id === params.id);

const DayTypeEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;

  let currentDayType = useAppSelector(getCurrentDayTypeSelector(params));

  if (!currentDayType) {
    currentDayType = createNewDayType() as DayType;
  }

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [dayType, setDayType] = useState<DayType>(currentDayType);
  const [isValid, setIsValid] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const dispatchLoadDayType = useCallback(() => {
    if (params.id) {
      dispatch(loadDayTypeById(params.id, intl)).catch(() =>
        navigate('/day-types'),
      );
    }
  }, [dispatch, params.id, intl, navigate]);

  useEffect(() => {
    dispatchLoadDayType();
  }, [dispatchLoadDayType]);

  useEffect(() => {
    if (params.id && currentDayType) {
      setDayType(currentDayType);
    }
  }, [currentDayType, params.id]);

  const handleOnSaveClick = () => {
    if (isValid) {
      setSaving(true);
      dispatch(saveDayType(dayType, intl))
        .then(() => dispatch(loadDayTypes(intl)))
        .then(() => navigate('/day-types'))
        .finally(() => setSaving(false));
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteDayTypeById(dayType?.id, intl)).then(() =>
      navigate('/day-types'),
    );
  };

  const isDeleteDisabled =
    !dayType ||
    !dayType.id ||
    (dayType.numberOfServiceJourneys ?? 0) > 0 ||
    isDeleting;

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarDayTypesMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'dayTypesEditDayTypeHeader' })
          : formatMessage({ id: 'dayTypesCreateDayTypeHeader' })
      }
    >
      <>
        <Typography variant="body1">
          {formatMessage({ id: 'dayTypesEditorDescription' })}
        </Typography>

        {dayType ? (
          <OverlayLoader
            className=""
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'dayTypesSavingDayTypeText' })
                : formatMessage({ id: 'dayTypesDeletingDayTypeText' })
            }
          >
            <Stack spacing={3} sx={{ maxWidth: 800 }}>
              <DayTypeForm
                dayType={dayType}
                onChange={setDayType}
                onValidationChange={setIsValid}
              />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
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
                  disabled={!isValid}
                >
                  {params.id
                    ? formatMessage({ id: 'editorSaveButtonText' })
                    : formatMessage(
                        { id: 'editorDetailedCreate' },
                        { details: formatMessage({ id: 'dayType' }) },
                      )}
                </Button>
              </Stack>
            </Stack>
          </OverlayLoader>
        ) : (
          <Loading
            className=""
            isLoading={!dayType}
            isFullScreen
            children={null}
            text={formatMessage({ id: 'dayTypesLoadingDayTypeText' })}
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({ id: 'dayTypesDeleteConfirmDialogTitle' })}
          message={formatMessage({
            id: 'dayTypesDeleteConfirmDialogMessage',
          })}
          buttons={[
            <Button
              variant="outlined"
              key={2}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({ id: 'no' })}
            </Button>,
            <Button
              variant="contained"
              color="success"
              key={1}
              onClick={handleDelete}
            >
              {formatMessage({ id: 'yes' })}
            </Button>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </>
    </Page>
  );
};

export default DayTypeEditor;
