import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { NegativeButton, SecondaryButton, SuccessButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
import { RouteComponentProps } from 'react-router';
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
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import { Network } from 'model/Network';
import { filterAuthorities, OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import RequiredInputMarker from 'components/RequiredInputMarker';
import Provider from 'model/Provider';
import './styles.scss';

const getCurrentNetwork = (
  state: GlobalState,
  match: { params: MatchParams }
): Network =>
  state.networks?.find((network) => network.id === match.params.id) ?? {
    name: '',
    authorityRef: '',
  };

const NetworkEditor = ({
  match,
  history,
}: RouteComponentProps<MatchParams>) => {
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
    getCurrentNetwork(state, match)
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
    if (match.params.id) {
      dispatch(loadNetworkById(match.params.id)).catch(() =>
        history.push('/networks')
      );
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadFlexibleLines();
    dispatchLoadNetwork();
  }, [dispatchLoadFlexibleLines, dispatchLoadNetwork]);

  const handleOnSaveClick = () => {
    if (network.name && network.authorityRef) {
      setSaving(true);
      dispatch(saveNetwork(network))
        .then(() => history.push('/networks'))
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
    dispatch(deleteNetworkById(network?.id)).then(() =>
      history.push('/networks')
    );
  };

  const authorities = filterAuthorities(organisations ?? [], activeProvider);

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find((l) => l.networkRef === network.id) ||
    isDeleting;

  return (
    <Page
      backButtonTitle={formatMessage('navBarNetworksMenuItemLabel')}
      title={
        match.params.id
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
              <InputGroup
                className="form-section"
                label={formatMessage('editorNameLabelText')}
                {...getErrorFeedback(
                  formatMessage('editorValidationName'),
                  !isBlank(network.name),
                  namePristine
                )}
              >
                <TextField
                  defaultValue={network.name ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('name', e.target.value)
                  }
                />
              </InputGroup>
              <InputGroup
                className="form-section"
                label={formatMessage('editorDescriptionLabelText')}
              >
                <TextArea
                  value={network.description ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('description', e.target.value)
                  }
                />
              </InputGroup>
              <InputGroup
                className="form-section"
                label={formatMessage('editorPrivateCodeLabelText')}
              >
                <TextField
                  value={network.privateCode ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('privateCode', e.target.value)
                  }
                />
              </InputGroup>
              <Dropdown
                className="form-section"
                value={network.authorityRef}
                label={formatMessage('editorAuthorityLabelText')}
                items={[
                  ...authorities.map((org) => ({
                    label: org.name,
                    value: org.id,
                  })),
                ]}
                onChange={(organisation) =>
                  handleAuthoritySelectionChange(organisation?.value ?? '')
                }
                {...getErrorFeedback(
                  formatMessage('editorValidationAuthority'),
                  !isBlank(network.authorityRef),
                  authorityPristine
                )}
              />
              <div className="buttons">
                {match.params.id && (
                  <NegativeButton
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isDeleteDisabled}
                  >
                    {formatMessage('editorDeleteButtonText')}
                  </NegativeButton>
                )}

                <SuccessButton onClick={handleOnSaveClick}>
                  {formatMessage('editorSaveButtonText')}
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

export default withRouter(NetworkEditor);
