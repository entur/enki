import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@entur/form';
import { SuccessButton } from '@entur/button';
import { isBlank } from 'helpers/forms';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import Page from 'components/Page';
import { useIntl } from 'react-intl';
import { GlobalState } from 'reducers';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import RequiredInputMarker from 'components/RequiredInputMarker';
import Provider from 'model/Provider';
import './styles.scss';
import { getProviders, saveProvider } from 'actions/providers';
import { useConfig } from 'config/ConfigContext';
import { Params, useNavigate, useParams } from 'react-router-dom';

const getCurrentProvider = (
  state: GlobalState,
  params: Params,
  xmlnsUrlPrefix?: string
): Provider =>
  state.providers?.providers?.find(
    (provider) => provider.code === params.id
  ) ?? {
    name: '',
    code: '',
    codespace: {
      xmlns: ' ',
      xmlnsUrl: xmlnsUrlPrefix || '',
    },
  };

const ProviderEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { xmlnsUrlPrefix } = useConfig();
  const currentProvider = useSelector<GlobalState, Provider>((state) =>
    getCurrentProvider(state, params, xmlnsUrlPrefix)
  );

  const [isSaving, setSaving] = useState<boolean>(false);
  const [provider, setProvider] = useState<Provider>(currentProvider);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(provider.name, saveClicked);

  const dispatch = useDispatch<any>();

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
        .then(() => dispatch(getProviders()))
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
      <div className="provider-editor">
        {(provider && (
          <OverlayLoader
            className=""
            isLoading={isSaving}
            text={formatMessage({ id: 'editorSavingProviderLoadingText' })}
          >
            <div className="provider-form">
              <RequiredInputMarker />

              <TextField
                className="form-section"
                label={formatMessage({ id: 'editorProviderNameLabelText' })}
                {...getErrorFeedback(
                  formatMessage({ id: 'editorProviderValidationField' }),
                  !isBlank(provider.name),
                  namePristine
                )}
                value={provider.name ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)
                }
              />

              <TextField
                className="form-section"
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
                {...getErrorFeedback(
                  formatMessage({ id: 'editorProviderValidationField' }),
                  !isBlank(provider.code),
                  namePristine
                )}
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorProviderCodespaceXmlnsLabelText',
                })}
                disabled
                value={provider.codespace?.xmlns ?? ''}
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorProviderCodespaceXmlnsUrlLabelText',
                })}
                disabled
                value={provider.codespace?.xmlnsUrl ?? ''}
              />

              <div className="buttons">
                <SuccessButton
                  disabled={!validProvider}
                  onClick={handleOnSaveClick}
                >
                  {params.id
                    ? formatMessage({ id: 'editorSaveButtonText' })
                    : formatMessage(
                        { id: 'editorDetailedCreate' },
                        { details: formatMessage({ id: 'provider' }) }
                      )}
                </SuccessButton>
              </div>
            </div>
          </OverlayLoader>
        )) || (
          <Loading
            className=""
            isLoading={!provider}
            isFullScreen
            children={null}
            text={formatMessage({ id: 'editorLoadingProviderText' })}
          />
        )}
      </div>
    </Page>
  );
};

export default ProviderEditor;
