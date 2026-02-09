import { Autocomplete, TextField, Typography } from '@mui/material';
import { loadFlexibleLines } from 'actions/flexibleLines';
import {
  deleteNetworkById,
  loadNetworkById,
  loadNetworks,
  saveNetwork,
} from 'actions/networks';
import { EntityEditorActions } from 'components/EntityEditorActions';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { mapToItems } from 'helpers/dropdown';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { useEntityEditor } from 'hooks/useEntityEditor';
import { Network } from 'model/Network';
import { filterAuthorities } from 'model/Organisation';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import Stack from '@mui/material/Stack';

const NetworkEditor = () => {
  const {
    entity: network,
    setEntity: setNetwork,
    onFieldChange,
    isSaving,
    isDeleting,
    saveClicked,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    handleSave,
    handleDelete,
    params,
    dispatch,
    intl,
    formatMessage,
  } = useEntityEditor<Network>({
    entitySelector: (params) => (state) =>
      state.networks?.find((n) => n.id === params.id),
    defaultEntity: { name: '', authorityRef: '' },
    loadById: loadNetworkById,
    save: saveNetwork,
    loadAll: loadNetworks,
    deleteById: deleteNetworkById,
    navigateTo: '/networks',
  });

  const organisations = useAppSelector(({ organisations }) => organisations);
  const lines = useAppSelector(({ flexibleLines }) => flexibleLines);

  const namePristine = usePristine(network.name, saveClicked);
  const authorityPristine = usePristine(network.authorityRef, saveClicked);

  const dispatchLoadFlexibleLines = useCallback(
    () => dispatch(loadFlexibleLines(intl)),
    [dispatch, intl],
  );

  useEffect(() => {
    dispatchLoadFlexibleLines();
  }, [dispatchLoadFlexibleLines]);

  const handleAuthoritySelectionChange = (authoritySelection: string) => {
    setNetwork({
      ...network,
      authorityRef: authoritySelection,
    });
  };

  const authorities = filterAuthorities(organisations ?? []);

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find((l) => l.networkRef === network.id) ||
    isDeleting;

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarNetworksMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'editorEditNetworkHeaderText' })
          : formatMessage({ id: 'editorCreateNetworkHeaderText' })
      }
    >
      <>
        <Typography variant="body1">
          {formatMessage({ id: 'editorNetworkDescription' })}
        </Typography>

        {network && lines ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingNetworkLoadingText' })
                : formatMessage({ id: 'editorDeletingNetworkLoadingText' })
            }
          >
            <Stack spacing={3} sx={{ maxWidth: 450 }}>
              <RequiredInputMarker />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({ id: 'editorNetworkNameLabelText' })}
                {...getMuiErrorProps(
                  formatMessage({ id: 'editorNetworkValidationName' }),
                  !isBlank(network.name),
                  namePristine,
                )}
                value={network.name}
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
                  id: 'editorNetworkDescriptionLabelText',
                })}
                value={network.description}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => onFieldChange('description', e.target.value)}
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorNetworkPrivateCodeLabelText',
                })}
                value={network.privateCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('privateCode', e.target.value)
                }
              />

              <Autocomplete
                value={
                  authorities.find((v) => v.id === network.authorityRef)
                    ? {
                        value:
                          authorities.find((v) => v.id === network.authorityRef)
                            ?.id ?? '',
                        label:
                          authorities.find((v) => v.id === network.authorityRef)
                            ?.name.value ?? '',
                      }
                    : null
                }
                onChange={(_event, newValue) =>
                  handleAuthoritySelectionChange(newValue?.value ?? '')
                }
                options={mapToItems(
                  authorities.map((v) => ({ ...v, name: v.name.value })),
                )}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                noOptionsText={formatMessage({ id: 'dropdownNoMatchesText' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={formatMessage({
                      id: 'editorNetworkAuthorityLabelText',
                    })}
                    placeholder={formatMessage({ id: 'defaultOption' })}
                    {...getMuiErrorProps(
                      formatMessage({
                        id: 'editorNetworkValidationAuthority',
                      }),
                      !isBlank(network.authorityRef),
                      authorityPristine,
                    )}
                  />
                )}
              />

              <EntityEditorActions
                isEditing={!!params.id}
                isDeleteDisabled={isDeleteDisabled}
                onDeleteClick={() => setDeleteDialogOpen(true)}
                onSaveClick={() =>
                  handleSave(!!network.name && !!network.authorityRef)
                }
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteDialogClose={() => setDeleteDialogOpen(false)}
                onDeleteConfirm={handleDelete}
                entityName="network"
                deleteConfirmTitleId="editorDeleteNetworkConfirmDialogTitle"
                deleteConfirmMessageId="editorDeleteNetworkConfirmDialogMessage"
                deleteConfirmCancelId="editorDeleteNetworkConfirmDialogCancelText"
                deleteConfirmConfirmId="editorDeleteNetworkConfirmDialogConfirmText"
              />
            </Stack>
          </OverlayLoader>
        ) : (
          <Loading
            isLoading={!network}
            isFullScreen
            children={null}
            text={
              !network
                ? formatMessage({ id: 'editorLoadingNetworkText' })
                : formatMessage({ id: 'editorLoadingDependenciesText' })
            }
          />
        )}
      </>
    </Page>
  );
};

export default NetworkEditor;
