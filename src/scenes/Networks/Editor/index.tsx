import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { loadFlexibleLines } from 'actions/flexibleLines';
import {
  deleteNetworkById,
  loadNetworkById,
  loadNetworks,
  saveNetwork,
} from 'actions/networks';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { mapToItems } from 'helpers/dropdown';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Network } from 'model/Network';
import { filterAuthorities } from 'model/Organisation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Stack from '@mui/material/Stack';

const getCurrentNetworkSelector = (params: Params) => (state: GlobalState) =>
  state.networks?.find((network) => network.id === params.id);

const NetworkEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const organisations = useAppSelector(({ organisations }) => organisations);
  const lines = useAppSelector(({ flexibleLines }) => flexibleLines);
  let currentNetwork = useAppSelector(getCurrentNetworkSelector(params));

  if (!currentNetwork) {
    currentNetwork = {
      name: '',
      authorityRef: '',
    };
  }

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [network, setNetwork] = useState<Network>(currentNetwork);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(network.name, saveClicked);
  const authorityPristine = usePristine(network.authorityRef, saveClicked);

  const dispatch = useAppDispatch();

  const dispatchLoadFlexibleLines = useCallback(
    () => dispatch(loadFlexibleLines(intl)),
    [dispatch],
  );

  const onFieldChange = (field: keyof Network, value: string) => {
    setNetwork({ ...network, [field]: value });
  };

  const dispatchLoadNetwork = useCallback(() => {
    if (params.id) {
      dispatch(loadNetworkById(params.id, intl)).catch(() =>
        navigate('/networks'),
      );
    }
  }, [dispatch, params.id, intl, navigate]);

  useEffect(() => {
    dispatchLoadFlexibleLines();
    dispatchLoadNetwork();
  }, [dispatchLoadFlexibleLines, dispatchLoadNetwork]);

  useEffect(() => {
    if (params.id) {
      setNetwork(currentNetwork);
    }
  }, [currentNetwork, params.id]);

  const handleOnSaveClick = () => {
    if (network.name && network.authorityRef) {
      setSaving(true);
      dispatch(saveNetwork(network, intl))
        .then(() => dispatch(loadNetworks(intl)))
        .then(() => navigate('/networks'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const handleAuthoritySelectionChange = (authoritySelection: string) => {
    setNetwork({
      ...network,
      authorityRef: authoritySelection,
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteNetworkById(network?.id, intl)).then(() =>
      navigate('/networks'),
    );
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
                        { details: formatMessage({ id: 'network' }) },
                      )}
                </Button>
              </Stack>
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

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({ id: 'editorDeleteNetworkConfirmDialogTitle' })}
          message={formatMessage({
            id: 'editorDeleteNetworkConfirmDialogMessage',
          })}
          buttons={[
            <Button
              variant="outlined"
              key={2}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({
                id: 'editorDeleteNetworkConfirmDialogCancelText',
              })}
            </Button>,
            <Button
              variant="contained"
              color="error"
              key={1}
              onClick={handleDelete}
            >
              {formatMessage({
                id: 'editorDeleteNetworkConfirmDialogConfirmText',
              })}
            </Button>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </>
    </Page>
  );
};

export default NetworkEditor;
