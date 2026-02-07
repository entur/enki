import { Button, TextField } from '@mui/material';
import { saveProvider } from 'actions/providers';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useConfig } from 'config/ConfigContext';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import Provider from 'model/Provider';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { Params, useNavigate, useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Stack from '@mui/material/Stack';
import { RootState } from '../../../store/store';
import { fetchUserContext } from '../../../auth/userContextSlice';
import { useAuth } from '../../../auth/auth';

const getCurrentProviderSelector = (params: Params) => (state: RootState) =>
  state.providers.providers?.find((provider) => provider.code === params.id);

const ProviderEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { xmlnsUrlPrefix, uttuApiUrl } = useConfig();
  const { getAccessToken } = useAuth();
  let currentProvider = useAppSelector(getCurrentProviderSelector(params));

  if (!currentProvider) {
    currentProvider = {
      name: '',
      code: '',
      codespace: {
        xmlns: ' ',
        xmlnsUrl: xmlnsUrlPrefix || '',
      },
    };
  }

  const [isSaving, setSaving] = useState<boolean>(false);
  const [provider, setProvider] = useState<Provider>(currentProvider);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(provider.name, saveClicked);

  const dispatch = useAppDispatch();

  const onFieldChange = (field: keyof Provider, value: string) => {
    setProvider({ ...provider, [field]: value });
  };

  const validProvider =
    provider.name &&
    provider.code &&
    provider.codespace?.xmlns &&
    provider.codespace?.xmlnsUrl;

  const handleOnSaveClick = () => {
    if (validProvider) {
      setSaving(true);
      dispatch(saveProvider(provider, intl))
        .then(() =>
          dispatch(
            fetchUserContext({
              uttuApiUrl,
              getAccessToken,
            }),
          ),
        )
        .then(() => navigate('/providers'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'editorEditProviderHeaderText' })
          : formatMessage({ id: 'editorCreateProviderHeaderText' })
      }
    >
      <>
        {(provider && (
          <OverlayLoader
            isLoading={isSaving}
            text={formatMessage({ id: 'editorSavingProviderLoadingText' })}
          >
            <Stack spacing={3} sx={{ maxWidth: 450 }}>
              <RequiredInputMarker />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({ id: 'editorProviderNameLabelText' })}
                {...getMuiErrorProps(
                  formatMessage({ id: 'editorProviderValidationField' }),
                  !isBlank(provider.name),
                  namePristine,
                )}
                value={provider.name ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({ id: 'editorProviderCodeLabelText' })}
                value={provider.code ?? ''}
                disabled={!!params.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  setProvider({
                    ...provider,
                    code: sanitized.toLowerCase(),
                    codespace: {
                      xmlns: sanitized.toUpperCase(),
                      xmlnsUrl: `${xmlnsUrlPrefix}${sanitized.toLowerCase()}`,
                    },
                  });
                }}
                {...getMuiErrorProps(
                  formatMessage({ id: 'editorProviderValidationField' }),
                  !isBlank(provider.code),
                  namePristine,
                )}
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorProviderCodespaceXmlnsLabelText',
                })}
                disabled
                value={provider.codespace?.xmlns ?? ''}
              />

              <TextField
                variant="outlined"
                fullWidth
                label={formatMessage({
                  id: 'editorProviderCodespaceXmlnsUrlLabelText',
                })}
                disabled
                value={provider.codespace?.xmlnsUrl ?? ''}
              />

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!validProvider}
                  onClick={handleOnSaveClick}
                >
                  {params.id
                    ? formatMessage({ id: 'editorSaveButtonText' })
                    : formatMessage(
                        { id: 'editorDetailedCreate' },
                        { details: formatMessage({ id: 'provider' }) },
                      )}
                </Button>

                {params.id && (
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/providers/${params.id}/migrate-line`}
                  >
                    Migrate Lines
                  </Button>
                )}
              </Stack>
            </Stack>
          </OverlayLoader>
        )) || (
          <Loading
            isLoading={!provider}
            isFullScreen
            children={null}
            text={formatMessage({ id: 'editorLoadingProviderText' })}
          />
        )}
      </>
    </Page>
  );
};

export default ProviderEditor;
