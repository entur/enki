import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SuccessButton } from '@entur/button';
import { Checkbox, TextField } from '@entur/form';
import { saveExport } from 'actions/exports';
import OverlayLoader from 'components/OverlayLoader';
import { AppIntlState, selectIntl } from 'i18n';
import { RouteComponentProps } from 'react-router';
import { exportIsValid } from './validateForm';
import { Export, ExportLineAssociation, newExport } from 'model/Export';
import { GlobalState } from 'reducers';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import RequiredInputMarker from 'components/RequiredInputMarker';
import Page from 'components/Page';
import { Heading4, LeadParagraph, SubParagraph } from '@entur/typography';
import { Tooltip } from '@entur/tooltip';
import { QuestionIcon } from '@entur/icons';
import './styles.scss';
import LinesForExport from 'components/LinesForExport';

const ExportsCreator = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [theExport, setTheExport] = useState<Export>(newExport());

  const dispatch = useDispatch<any>();

  const namePristine = usePristine(theExport.name, saveClicked);

  const handleOnSaveClick = () => {
    if (exportIsValid(theExport)) {
      setSaving(true);
      dispatch(saveExport(theExport))
        .then(() => history.push('/exports'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const onFieldChange = (
    field: keyof Export,
    value: string | boolean | ExportLineAssociation[]
  ) => {
    setTheExport({ ...theExport, [field]: value });
  };

  return (
    <Page
      className="export-editor"
      backButtonTitle={formatMessage('navBarExportsMenuItemLabel')}
      title={formatMessage('exportCreatorHeader')}
    >
      <OverlayLoader
        className=""
        isLoading={isSaving}
        text={formatMessage('exportCreatorSavingOverlayLoaderText')}
      >
        <LeadParagraph>
          {formatMessage('exportCreatorDescription')}
        </LeadParagraph>
        <RequiredInputMarker />
        <TextField
          className="export-name"
          label={formatMessage('exportCreatorNameFormLabel')}
          {...getErrorFeedback(
            formatMessage('validateFormErrorExportNameIsEmpty'),
            !isBlank(theExport.name),
            namePristine
          )}
          defaultValue={theExport.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange('name', e.target.value)
          }
        />

        <div className="export-lines-table">
          <Heading4>
            {formatMessage('exportCreatorLinesForExportHeader')}
          </Heading4>
          <LinesForExport
            onChange={(lines) => {
              onFieldChange('lineAssociations', lines);
            }}
          />
        </div>
        <div className="export-dry-run">
          <Checkbox
            value="1"
            checked={theExport.dryRun}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFieldChange('dryRun', e.target.checked)
            }
          >
            {formatMessage('exportCreatorDryRunFormLabel')}
          </Checkbox>
          <Tooltip
            placement="right"
            content={formatMessage('exportCreatorDryRunFormLabelTooltip')}
          >
            <span className="question-icon">
              <QuestionIcon />
            </span>
          </Tooltip>
        </div>
        <SuccessButton className="export-save" onClick={handleOnSaveClick}>
          {formatMessage('exportCreatorSaveButtonLabelText')}
        </SuccessButton>
      </OverlayLoader>
    </Page>
  );
};

export default withRouter(ExportsCreator);
