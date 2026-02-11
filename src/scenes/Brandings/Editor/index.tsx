import { TextField, Typography } from '@mui/material';
import {
  deleteBrandingById,
  loadBrandingById,
  loadBrandings,
  saveBranding,
} from 'actions/brandings';
import { EntityEditorActions } from 'components/EntityEditorActions';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { useEntityEditor } from 'hooks/useEntityEditor';
import { Branding } from 'model/Branding';
import { ChangeEvent } from 'react';
import Stack from '@mui/material/Stack';

const BrandingEditor = () => {
  const {
    entity: branding,
    onFieldChange,
    isSaving,
    isDeleting,
    saveClicked,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    handleSave,
    handleDelete,
    params,
    formatMessage,
  } = useEntityEditor<Branding>({
    entitySelector: (params) => (state) =>
      state.brandings?.find((b) => b.id === params.id),
    defaultEntity: { name: '' },
    loadById: loadBrandingById,
    save: saveBranding,
    loadAll: loadBrandings,
    deleteById: deleteBrandingById,
    navigateTo: '/brandings',
  });

  const namePristine = usePristine(branding.name, saveClicked);
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

              <EntityEditorActions
                isEditing={!!params.id}
                isDeleteDisabled={isDeleteDisabled}
                onDeleteClick={() => setDeleteDialogOpen(true)}
                onSaveClick={() => handleSave(!!branding.name)}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteDialogClose={() => setDeleteDialogOpen(false)}
                onDeleteConfirm={handleDelete}
                entityName="branding"
                deleteConfirmTitleId="editorDeleteBrandingConfirmDialogTitle"
                deleteConfirmMessageId="editorDeleteBrandingConfirmDialogMessage"
                deleteConfirmCancelId="editorDeleteBrandingConfirmDialogCancelText"
                deleteConfirmConfirmId="editorDeleteBrandingConfirmDialogConfirmText"
              />
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
      </>
    </Page>
  );
};

export default BrandingEditor;
