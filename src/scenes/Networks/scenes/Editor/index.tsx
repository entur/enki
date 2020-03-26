import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { SuccessButton, NegativeButton, SecondaryButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
import { RouteComponentProps } from 'react-router';
import { isBlank } from 'helpers/forms';
import { ORGANISATION_TYPE } from 'model/enums';
import {
  deleteNetworkById,
  loadNetworkById,
  saveNetwork
} from 'actions/networks';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import ConfirmDialog from 'components/ConfirmDialog';
import PageHeader from 'components/PageHeader';

import './styles.scss';
import selectActiveProvider from 'selectors/selectActiveProvider';
import { selectIntl } from 'i18n';
import messages from './messages';
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import { Network } from 'model/Network';
import { IntlState } from 'react-intl-redux';
import { IntlFormatters } from 'react-intl';
import { OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';

const getCurrentNetwork = (
  state: GlobalState,
  match: { params: MatchParams }
): Network =>
  state.networks?.find(network => network.id === match.params.id) ?? {};

const NetworkEditor = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector<IntlState, IntlFormatters>(selectIntl);
  const activeProvider = useSelector(selectActiveProvider());
  const organisations = useSelector<GlobalState, OrganisationState>(
    ({ organisations }) => organisations
  );
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    ({ flexibleLines }) => flexibleLines
  );
  const currentNetwork = useSelector<GlobalState, Network>(state =>
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

  const handleAuthoritySelectionChange = (
    authoritySelection: string | undefined
  ) => {
    setNetwork({
      ...network,
      authorityRef: authoritySelection
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteNetworkById(network?.id)).then(() =>
      history.push('/networks')
    );
  };

  const authorities = (organisations ?? []).filter(
    org =>
      org.types.includes(ORGANISATION_TYPE.AUTHORITY) &&
      org.references.netexAuthorityId &&
      org.references.codeSpace === activeProvider.codespace.xmlns
  );

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find(l => l.networkRef === network.id) ||
    isDeleting;

  return (
    <div className="network-editor">
      <div className="header">
        <PageHeader
          withBackButton
          title={
            match.params.id
              ? formatMessage(messages.editNetworkHeaderText)
              : formatMessage(messages.createNetworkHeaderText)
          }
        />
      </div>

      <Paragraph>{formatMessage(messages.networkDescription)}</Paragraph>

      {network && lines ? (
        <OverlayLoader
          className=""
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.savingNetworkLoadingText)
              : formatMessage(messages.deletingNetworkLoadingText)
          }
        >
          <div className="network-form">
            <InputGroup
              className="form-section"
              label={formatMessage(messages.nameLabelText)}
              {...getErrorFeedback(
                formatMessage(messages.validationName),
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
              label={formatMessage(messages.descriptionLabelText)}
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
              label={formatMessage(messages.privateCodeLabelText)}
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
              label={formatMessage(messages.authorityLabelText)}
              items={[
                ...authorities.map(org => ({
                  label: org.name,
                  value: org.id
                }))
              ]}
              onChange={organisation =>
                handleAuthoritySelectionChange(organisation?.value)
              }
              {...getErrorFeedback(
                formatMessage(messages.validationAuthority),
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
                  {formatMessage(messages.deleteButtonText)}
                </NegativeButton>
              )}

              <SuccessButton onClick={handleOnSaveClick}>
                {formatMessage(messages.saveButtonText)}
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
              ? formatMessage(messages.loadingNetworkText)
              : formatMessage(messages.loadingDependenciesText)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.deleteNetworkConfirmDialogTitle)}
        message={formatMessage(messages.deleteNetworkConfirmDialogMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.deleteNetworkConfirmDialogCancelText)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage(messages.deleteNetworkConfirmDialogConfirmText)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(NetworkEditor);
