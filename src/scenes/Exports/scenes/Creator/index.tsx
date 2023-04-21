import { SuccessButton } from '@entur/button';
import { Checkbox, TextField } from '@entur/form';
import { QuestionIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import { Heading4, LeadParagraph } from '@entur/typography';
import { saveExport } from 'actions/exports';
import LinesForExport from 'components/LinesForExport';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Export, ExportLineAssociation, newExport } from 'model/Export';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { exportIsValid } from './validateForm';

const ExportsCreator = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [theExport, setTheExport] = useState<Export>(newExport());

  const dispatch = useDispatch<any>();

  const namePristine = usePristine(theExport.name, saveClicked);

  const handleOnSaveClick = () => {
    if (exportIsValid(theExport)) {
      setSaving(true);
      dispatch(saveExport(theExport, intl))
        .then(() => navigate('/exports'))
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
      backButtonTitle={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
      title={formatMessage({ id: 'exportCreatorHeader' })}
    >
      <OverlayLoader
        className=""
        isLoading={isSaving}
        text={formatMessage({ id: 'exportCreatorSavingOverlayLoaderText' })}
      >
        <LeadParagraph>
          {formatMessage({ id: 'exportCreatorDescription' })}
        </LeadParagraph>
        <RequiredInputMarker />
        <TextField
          className="export-name"
          label={formatMessage({ id: 'exportCreatorNameFormLabel' })}
          {...getErrorFeedback(
            formatMessage({ id: 'validateFormErrorExportNameIsEmpty' }),
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
            {formatMessage({ id: 'exportCreatorLinesForExportHeader' })}
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
            {formatMessage({ id: 'exportCreatorDryRunFormLabel' })}
          </Checkbox>
          <Tooltip
            placement="right"
            content={formatMessage({
              id: 'exportCreatorDryRunFormLabelTooltip',
            })}
          >
            <span className="question-icon">
              <QuestionIcon />
            </span>
          </Tooltip>
        </div>
        <SuccessButton className="export-save" onClick={handleOnSaveClick}>
          {formatMessage({ id: 'exportCreatorSaveButtonLabelText' })}
        </SuccessButton>
      </OverlayLoader>
    </Page>
  );
};

export default ExportsCreator;
