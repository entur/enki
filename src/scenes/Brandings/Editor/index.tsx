import { NegativeButton, SecondaryButton, SuccessButton } from '@entur/button';
import { TextArea, TextField } from '@entur/form';
import { Paragraph } from '@entur/typography';
import {
  deleteBrandingById,
  loadBrandingById,
  loadBrandings,
  saveBranding,
} from 'actions/brandings';
import ConfirmDialog from 'components/ConfirmDialog';
import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Branding } from 'model/Branding';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppSelector } from '../../../store/hooks';
import './styles.scss';

const getCurrentBrandingSelector = (params: Params) => (state: GlobalState) =>
  state.brandings?.find((branding) => branding.id === params.id);

const BrandingEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  let currentBranding = useAppSelector(getCurrentBrandingSelector(params));

  if (!currentBranding) {
    currentBranding = {
      name: '',
    };
  }

  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [branding, setBranding] = useState<Branding>(currentBranding);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);

  const namePristine = usePristine(branding.name, saveClicked);

  const dispatch = useDispatch<any>();

  const onFieldChange = (field: keyof Branding, value: string) => {
    setBranding({ ...branding, [field]: value });
  };

  const dispatchLoadBranding = useCallback(() => {
    if (params.id) {
      dispatch(loadBrandingById(params.id)).catch(() => navigate('/brandings'));
    }
  }, [dispatch, params.id, history]);

  useEffect(() => {
    dispatchLoadBranding();
  }, [dispatchLoadBranding]);

  useEffect(() => {
    if (params.id) {
      setBranding(currentBranding);
    }
  }, [currentBranding, params.id]);

  const handleOnSaveClick = () => {
    if (branding.name) {
      setSaving(true);
      dispatch(saveBranding(branding))
        .then(() => dispatch(loadBrandings()))
        .then(() => navigate('/brandings'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteBrandingById(branding?.id)).then(() =>
      navigate('/brandings'),
    );
  };

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
      <div className="branding-editor">
        <Paragraph>
          {formatMessage({ id: 'editorBrandingDescription' })}
        </Paragraph>

        {branding ? (
          <OverlayLoader
            className=""
            isLoading={isSaving || isDeleting}
            text={
              isSaving
                ? formatMessage({ id: 'editorSavingBrandingLoadingText' })
                : formatMessage({ id: 'editorDeletingBrandingLoadingText' })
            }
          >
            <div className="branding-form">
              <RequiredInputMarker />

              <TextField
                className="form-section"
                label={formatMessage({ id: 'editorBrandingNameLabelText' })}
                {...getErrorFeedback(
                  formatMessage({ id: 'editorBrandingValidationName' }),
                  !isBlank(branding.name),
                  namePristine,
                )}
                value={branding.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)
                }
              />

              <TextArea
                className="form-section"
                label={formatMessage({
                  id: 'editorBrandingDescriptionLabelText',
                })}
                value={branding.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange('description', e.target.value)
                }
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorBrandingShortNameLabelText',
                })}
                value={branding.shortName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('shortName', e.target.value)
                }
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorBrandingUrlLabelText',
                })}
                value={branding.url}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('url', e.target.value)
                }
              />

              <TextField
                className="form-section"
                label={formatMessage({
                  id: 'editorBrandingImageUrlLabelText',
                })}
                value={branding.imageUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('imageUrl', e.target.value)
                }
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
                        { details: formatMessage({ id: 'branding' }) },
                      )}
                </SuccessButton>
              </div>
            </div>
          </OverlayLoader>
        ) : (
          <Loading
            className=""
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

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({
            id: 'editorDeleteBrandingConfirmDialogTitle',
          })}
          message={formatMessage({
            id: 'editorDeleteBrandingConfirmDialogMessage',
          })}
          buttons={[
            <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
              {formatMessage({
                id: 'editorDeleteBrandingConfirmDialogCancelText',
              })}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={handleDelete}>
              {formatMessage({
                id: 'editorDeleteBrandingConfirmDialogConfirmText',
              })}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>
    </Page>
  );
};

export default BrandingEditor;
