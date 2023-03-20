import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextArea, TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { NegativeButton, SecondaryButton, SuccessButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
import { isBlank } from 'helpers/forms';
import {
  deleteNetworkById,
  loadNetworkById,
  saveNetwork,
} from 'actions/networks';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import ConfirmDialog from 'components/ConfirmDialog';
import Page from 'components/Page';
import { AppIntlState, selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { Network } from 'model/Network';
import { OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import RequiredInputMarker from 'components/RequiredInputMarker';
import Provider from 'model/Provider';
import { mapToItems } from 'helpers/dropdown';
import './styles.scss';
import { filterAuthorities } from 'model/Organisation';
import { useConfig } from 'config/ConfigContext';
import { Params, useNavigate, useParams } from 'react-router-dom';

const getCurrentNetwork = (state: GlobalState, params: Params): Network =>
  state.networks?.find((network) => network.id === params.id) ?? {
    name: '',
    authorityRef: '',
  };

const NetworkEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const activeProvider = useSelector<GlobalState, Provider | null>(
    (state) => state.providers.active
  );
  const organisations = useSelector<GlobalState, OrganisationState>(
    ({ organisations }) => organisations
  );
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    ({ flexibleLines }) => flexibleLines
  );
  const currentNetwork = useSelector<GlobalState, Network>((state) =>
    getCurrentNetwork(state, params)
  );

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [network, setNetwork] = useState<Network>(currentNetwork);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(network.name, saveClicked);
  const authorityPristine = usePristine(network.authorityRef, saveClicked);

  const dispatch = useDispatch<any>();

  const dispatchLoadFlexibleLines = useCallback(
    () => dispatch(loadFlexibleLines()),
    [dispatch]
  );

  const onFieldChange = (field: keyof Network, value: string) => {
    setNetwork({ ...network, [field]: value });
  };

  const dispatchLoadNetwork = useCallback(() => {
    if (params.id) {
      dispatch(loadNetworkById(params.id)).catch(() => navigate('/networks'));
    }
  }, [dispatch, params.id, history]);

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
      dispatch(saveNetwork(network))
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
    dispatch(deleteNetworkById(network?.id)).then(() => navigate('/networks'));
  };

  const config = useConfig();

  const authorities = filterAuthorities(
    organisations ?? [],
    activeProvider,
    config.enableLegacyOrganisationsFilter
  );

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find((l) => l.networkRef === network.id) ||
    isDeleting;

  return (
    <Page
      backButtonTitle={formatMessage('navBarNetworksMenuItemLabel')}
      title={
        params.id
          ? formatMessage('editorEditNetworkHeaderText')
          : formatMessage('editorCreateNetworkHeaderText')
      }
    >
      <div className="network-editor">
        <Paragraph>{formatMessage('editorNetworkDescription')}</Paragraph>

        {network && lines ? (
          <OverlayLoader
            className=""
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage('editorSavingNetworkLoadingText')
                : formatMessage('editorDeletingNetworkLoadingText')
            }
          >
            <div className="network-form">
              <RequiredInputMarker />

              <TextField
                className="form-section"
                label={formatMessage('editorNetworkNameLabelText')}
                {...getErrorFeedback(
                  formatMessage('editorNetworkValidationName'),
                  !isBlank(network.name),
                  namePristine
                )}
                value={network.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)
                }
              />

              <TextArea
                className="form-section"
                label={formatMessage('editorNetworkDescriptionLabelText')}
                value={network.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange('description', e.target.value)
                }
              />

              <TextField
                className="form-section"
                label={formatMessage('editorNetworkPrivateCodeLabelText')}
                value={network.privateCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('privateCode', e.target.value)
                }
              />

              {}
              <Dropdown
                className="form-section"
                value={network.authorityRef}
                items={() =>
                  mapToItems(
                    authorities.map((v) => ({ ...v, name: v.name.value }))
                  )
                }
                placeholder={formatMessage('defaultOption')}
                clearable
                label={formatMessage('editorNetworkAuthorityLabelText')}
                onChange={(organisation) =>
                  handleAuthoritySelectionChange(organisation?.value ?? '')
                }
                {...getErrorFeedback(
                  formatMessage('editorNetworkValidationAuthority'),
                  !isBlank(network.authorityRef),
                  authorityPristine
                )}
              />
              <div className="buttons">
                {params.id && (
                  <NegativeButton
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isDeleteDisabled}
                  >
                    {formatMessage('editorDeleteButtonText')}
                  </NegativeButton>
                )}

                <SuccessButton onClick={handleOnSaveClick}>
                  {params.id
                    ? formatMessage('editorSaveButtonText')
                    : formatMessage(
                        'editorDetailedCreate',
                        formatMessage('network')
                      )}
                </SuccessButton>
              </div>
            </div>
          </OverlayLoader>
        ) : (
          <Loading
            className=""
            isLoading={!network}
            isFullScreen
            children={null}
            text={
              !network
                ? formatMessage('editorLoadingNetworkText')
                : formatMessage('editorLoadingDependenciesText')
            }
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage('editorDeleteNetworkConfirmDialogTitle')}
          message={formatMessage('editorDeleteNetworkConfirmDialogMessage')}
          buttons={[
            <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
              {formatMessage('editorDeleteNetworkConfirmDialogCancelText')}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={handleDelete}>
              {formatMessage('editorDeleteNetworkConfirmDialogConfirmText')}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>
    </Page>
  );
};

export default NetworkEditor;
