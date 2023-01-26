import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TextField } from '@entur/form';
import { SuccessButton } from '@entur/button';
import { RouteComponentProps } from 'react-router';
import { isBlank } from 'helpers/forms';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import Page from 'components/Page';
import { AppIntlState, selectIntl } from 'i18n';
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import RequiredInputMarker from 'components/RequiredInputMarker';
import Provider from 'model/Provider';
import './styles.scss';
import { getProviders, saveProvider } from 'actions/providers';
import { useConfig } from 'config/ConfigContext';

const getCurrentProvider = (
  state: GlobalState,
  match: { params: MatchParams },
  xmlnsUrlPrefix?: string
): Provider =>
  state.providers?.providers?.find(
    (provider) => provider.code === match.params.id
  ) ?? {
    name: '',
    code: '',
    codespace: {
      xmlns: ' ',
      xmlnsUrl: xmlnsUrlPrefix || '',
    },
  };

const ProviderEditor = ({
  match,
  history,
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const { xmlnsUrlPrefix } = useConfig();
  const currentProvider = useSelector<GlobalState, Provider>((state) =>
    getCurrentProvider(state, match, xmlnsUrlPrefix)
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
      dispatch(saveProvider(provider))
        .then(() => dispatch(getProviders()))
        .then(() => history.push('/providers'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  return (
    <Page
      backButtonTitle={formatMessage('navBarProvidersMenuItemLabel')}
      title={
        match.params.id
          ? formatMessage('editorEditProviderHeaderText')
          : formatMessage('editorCreateProviderHeaderText')
      }
    >
      <div className="provider-editor">
        {(provider && (
          <OverlayLoader
            className=""
            isLoading={isSaving}
            text={formatMessage('editorSavingProviderLoadingText')}
          >
            <div className="provider-form">
              <RequiredInputMarker />

              <TextField
                className="form-section"
                label={formatMessage('editorProviderNameLabelText')}
                {...getErrorFeedback(
                  formatMessage('editorProviderValidationField'),
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
                label={formatMessage('editorProviderCodeLabelText')}
                value={provider.code ?? ''}
                disabled={!!match.params.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setProvider({
                    ...provider,
                    code: e.target.value.toLowerCase(),
                    codespace: {
                      xmlns: e.target.value.toUpperCase(),
                      xmlnsUrl: `${xmlnsUrlPrefix}${e.target.value.toLowerCase()}`,
                    },
                  });
                }}
                {...getErrorFeedback(
                  formatMessage('editorProviderValidationField'),
                  !isBlank(provider.code),
                  namePristine
                )}
              />

              <TextField
                className="form-section"
                label={formatMessage('editorProviderCodespaceXmlnsLabelText')}
                disabled
                value={provider.codespace?.xmlns ?? ''}
              />

              <TextField
                className="form-section"
                label={formatMessage(
                  'editorProviderCodespaceXmlnsUrlLabelText'
                )}
                disabled
                value={provider.codespace?.xmlnsUrl ?? ''}
              />

              <div className="buttons">
                <SuccessButton
                  disabled={!validProvider}
                  onClick={handleOnSaveClick}
                >
                  {match.params.id
                    ? formatMessage('editorSaveButtonText')
                    : formatMessage(
                        'editorDetailedCreate',
                        formatMessage('provider')
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
            text={formatMessage('editorLoadingProviderText')}
          />
        )}
      </div>
    </Page>
  );
};

export default withRouter(ProviderEditor);
