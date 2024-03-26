import { NegativeButton, SecondaryButton, SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { TextArea, TextField } from '@entur/form';
import { Paragraph } from '@entur/typography';
import { loadFlexibleLines } from 'actions/flexibleLines';
import {
  deleteNetworkById,
  loadNetworkById,
  saveNetwork,
} from 'actions/networks';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useConfig } from 'config/ConfigContext';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Network } from 'model/Network';
import { filterAuthorities } from 'model/Organisation';
import Provider from 'model/Provider';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import { OrganisationState } from 'reducers/organisations';
import './styles.scss';

const getCurrentNetwork = (state: GlobalState, params: Params): Network =>
  state.networks?.find((network) => network.id === params.id) ?? {
    name: '',
    authorityRef: '',
  };

const NetworkEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
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
    () => dispatch(loadFlexibleLines(intl)),
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
      backButtonTitle={formatMessage({ id: 'navBarNetworksMenuItemLabel' })}
      title={
        params.id
          ? formatMessage({ id: 'editorEditNetworkHeaderText' })
          : formatMessage({ id: 'editorCreateNetworkHeaderText' })
      }
    >
      <div className="network-editor">
        <Paragraph>
          {formatMessage({ id: 'editorNetworkDescription' })}
        </Paragraph>

        {network && lines ? (
          <OverlayLoader
            className=""
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingNetworkLoadingText' })
                : formatMessage({ id: 'editorDeletingNetworkLoadingText' })
            }
          >
            <div className="network-form">
              <RequiredInputMarker />

              <TextField
                className="form-section"
                label={formatMessage({ id: 'editorNetworkNameLabelText' })}
                {...getErrorFeedback(
                  formatMessage({ id: 'editorNetworkValidationName' }),
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
                label={formatMessage({
                  id: 'editorNetworkDescriptionLabelText',
                })}
                value={network.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange('description', e.target.value)
                }
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorNetworkPrivateCodeLabelText',
                })}
                value={network.privateCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('privateCode', e.target.value)
                }
              />

              {}
              <Dropdown
                className="form-section"
                selectedItem={{
                  value: network.authorityRef,
                  label: network.name,
                }}
                items={() =>
                  mapToItems(
                    authorities.map((v) => ({ ...v, name: v.name.value }))
                  )
                }
                placeholder={formatMessage({ id: 'defaultOption' })}
                clearable
                label={formatMessage({ id: 'editorNetworkAuthorityLabelText' })}
                onChange={(organisation) =>
                  handleAuthoritySelectionChange(organisation?.value ?? '')
                }
                {...getErrorFeedback(
                  formatMessage({ id: 'editorNetworkValidationAuthority' }),
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
                    {formatMessage({ id: 'editorDeleteButtonText' })}
                  </NegativeButton>
                )}

                <SuccessButton onClick={handleOnSaveClick}>
                  {params.id
                    ? formatMessage({ id: 'editorSaveButtonText' })
                    : formatMessage(
                        { id: 'editorDetailedCreate' },
                        { details: formatMessage({ id: 'network' }) }
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
            <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
              {formatMessage({
                id: 'editorDeleteNetworkConfirmDialogCancelText',
              })}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={handleDelete}>
              {formatMessage({
                id: 'editorDeleteNetworkConfirmDialogConfirmText',
              })}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>
    </Page>
  );
};

export default NetworkEditor;
