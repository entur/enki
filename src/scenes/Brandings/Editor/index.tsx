import { Button, TextField, Typography } from '@mui/material';
import {
  deleteBrandingById,
  loadBrandingById,
  loadBrandings,
  saveBranding,
} from 'actions/brandings';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Branding } from 'model/Branding';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Stack from '@mui/material/Stack';

const getCurrentBrandingSelector = (params: Params) => (state: GlobalState) =>
  state.brandings?.find((branding) => branding.id === params.id);

const BrandingEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  let currentBranding = useAppSelector(getCurrentBrandingSelector(params));

  if (!currentBranding) {
    currentBranding = {
      name: '',
    };
  }

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [branding, setBranding] = useState<Branding>(currentBranding);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(branding.name, saveClicked);

  const dispatch = useAppDispatch();

  const onFieldChange = (field: keyof Branding, value: string) => {
    setBranding({ ...branding, [field]: value });
  };

  const dispatchLoadBranding = useCallback(() => {
    if (params.id) {
      dispatch(loadBrandingById(params.id, intl)).catch(() =>
        navigate('/brandings'),
      );
    }
  }, [dispatch, params.id, intl, navigate]);

  useEffect(() => {
    dispatchLoadBranding();
  }, [dispatchLoadBranding]);

  useEffect(() => {
    if (params.id) {
      setBranding(currentBranding);
    }
  }, [currentBranding, params.id]);

  const handleOnSaveClick = () => {
    if (branding.name) {
      setSaving(true);
      dispatch(saveBranding(branding, intl))
        .then(() => dispatch(loadBrandings(intl)))
        .then(() => navigate('/brandings'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteBrandingById(branding?.id, intl)).then(() =>
      navigate('/brandings'),
    );
  };

  const isDeleteDisabled = !branding || isDeleting;

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarBrandingsMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'editorEditBrandingHeaderText' })
          : formatMessage({ id: 'editorCreateBrandingHeaderText' })
      }
    >
      <>
        <Typography variant="body1">
          {formatMessage({ id: 'editorBrandingDescription' })}
        </Typography>

        {branding ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingBrandingLoadingText' })
                : formatMessage({ id: 'editorDeletingBrandingLoadingText' })
            }
          >
            <Stack spacing={3} sx={{ maxWidth: 450 }}>
              <RequiredInputMarker />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({ id: 'editorBrandingNameLabelText' })}
                {...getMuiErrorProps(
                  formatMessage({ id: 'editorBrandingValidationName' }),
                  !isBlank(branding.name),
                  namePristine,
                )}
                value={branding.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                label={formatMessage({
                  id: 'editorBrandingDescriptionLabelText',
                })}
                value={branding.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange('description', e.target.value)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorBrandingShortNameLabelText',
                })}
                value={branding.shortName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('shortName', e.target.value)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorBrandingUrlLabelText',
                })}
                value={branding.url}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('url', e.target.value)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorBrandingImageUrlLabelText',
                })}
                value={branding.imageUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('imageUrl', e.target.value)
                }
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
                >
                  {params.id
                    ? formatMessage({ id: 'editorSaveButtonText' })
                    : formatMessage(
                        { id: 'editorDetailedCreate' },
                        { details: formatMessage({ id: 'branding' }) },
                      )}
                </Button>
              </Stack>
            </Stack>
          </OverlayLoader>
        ) : (
          <Loading
            isLoading={!branding}
            isFullScreen
            children={null}
            text={
              !branding
                ? formatMessage({ id: 'editorLoadingBrandingText' })
                : formatMessage({ id: 'editorLoadingDependenciesText' })
            }
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({
            id: 'editorDeleteBrandingConfirmDialogTitle',
          })}
          message={formatMessage({
            id: 'editorDeleteBrandingConfirmDialogMessage',
          })}
          buttons={[
            <Button
              variant="outlined"
              key={2}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({
                id: 'editorDeleteBrandingConfirmDialogCancelText',
              })}
            </Button>,
            <Button
              variant="contained"
              color="error"
              key={1}
              onClick={handleDelete}
            >
              {formatMessage({
                id: 'editorDeleteBrandingConfirmDialogConfirmText',
              })}
            </Button>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </>
    </Page>
  );
};

export default BrandingEditor;
