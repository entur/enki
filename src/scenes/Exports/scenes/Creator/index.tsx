import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { SuccessButton } from '@entur/button';
import { Checkbox, InputGroup, TextField } from '@entur/form';
import { DatePicker } from '@entur/datepicker';
import { dateToString } from 'helpers/dates';
import { saveExport } from 'actions/exports';
import PageHeader from 'components/PageHeader';
import OverlayLoader from 'components/OverlayLoader';
import { selectIntl } from 'i18n';
import { RouteComponentProps } from 'react-router';
import messages from './creator.messages';
import validatorMessages from './validateForm.messages';
import { exportIsValid, toDateIsAfterFromDate } from './validateForm';
import { Export } from 'model/Export';
import { GlobalState } from 'reducers';
import { IntlFormatters } from 'react-intl';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import './styles.scss';

const newExport = (): Export => {
  const today = moment().format('YYYY-MM-DD');
  return { name: '', fromDate: today, toDate: today, dryRun: false };
};

const ExportsCreator = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector<GlobalState, IntlFormatters>(
    selectIntl
  );
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [theExport, setTheExport] = useState<Export>(newExport());

  const dispatch = useDispatch<any>();

  const namePristine = usePristine(theExport.name, saveClicked);
  const toDatePristine = usePristine(theExport.toDate, saveClicked);

  const handleOnSaveClick = () => {
    if (exportIsValid(theExport)) {
      setSaving(true);
      dispatch(saveExport(theExport))
        .then(() => history.push('/exports'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const onFieldChange = (field: keyof Export, value: string | boolean) => {
    setTheExport({ ...theExport, [field]: value });
  };

  return (
    <div className="export-editor">
      <div className="header">
        <PageHeader withBackButton title={formatMessage(messages.header)} />

        <div className="buttons">
          <SuccessButton onClick={handleOnSaveClick}>
            {formatMessage(messages.saveButtonLabelText)}
          </SuccessButton>
        </div>
      </div>

      <OverlayLoader
        className=""
        isLoading={isSaving}
        text={formatMessage(messages.savingOverlayLoaderText)}
      >
        <div className="export-form">
          <InputGroup
            label={formatMessage(messages.nameFormLabel)}
            {...getErrorFeedback(
              formatMessage(validatorMessages.errorExportNameIsEmpty),
              !isBlank(theExport.name),
              namePristine
            )}
          >
            <TextField
              defaultValue={theExport.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage(messages.fromDateFormLabel)}>
            <DatePicker
              selectedDate={moment(theExport.fromDate).toDate()}
              onChange={(date: Date | null) =>
                onFieldChange('fromDate', dateToString(date))
              }
            />
          </InputGroup>

          <InputGroup
            label={formatMessage(messages.toDateFormLabel)}
            {...getErrorFeedback(
              formatMessage(validatorMessages.errorExportFromDateIsAfterToDate),
              toDateIsAfterFromDate(theExport.fromDate, theExport.toDate),
              toDatePristine
            )}
          >
            <DatePicker
              selectedDate={moment(theExport.toDate).toDate()}
              onChange={(date: Date | null) =>
                onFieldChange('toDate', dateToString(date))
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage(messages.dryRunFormLabel)}>
            <Checkbox
              value="1"
              checked={theExport.dryRun}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange('dryRun', e.target.checked)
              }
            />
          </InputGroup>
        </div>
      </OverlayLoader>
    </div>
  );
};

export default withRouter(ExportsCreator);
