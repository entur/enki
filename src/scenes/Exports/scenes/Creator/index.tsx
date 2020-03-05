import React, { useState, ChangeEvent } from 'react';
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

import './styles.scss';
import messages from './creator.messages';
import validatorMessages from './validateForm.messages';
import validateForm, {
  validateName,
  toDateIsBeforeFromDate,
  ExportValidation,
  ExportError
} from './validateForm';
import { Export } from 'model/Export';
import { GlobalState } from 'reducers';
import { IntlFormatters } from 'react-intl';

const newExport = (): Export => {
  const today = moment().format('YYYY-MM-DD');
  return { name: '', fromDate: today, toDate: today, dryRun: false };
};

const ExportsCreator = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector<GlobalState, IntlFormatters>(
    selectIntl
  );
  const [isSaving, setSaving] = useState<boolean>(false);
  const [theExport, setTheExport] = useState<Export>(newExport());
  const [errors, setErrors] = useState<ExportError>({
    name: [],
    fromDateToDate: []
  });

  const dispatch = useDispatch<any>();

  const handleOnSaveClick = () => {
    const [valid, errors] = validateForm(theExport) as ExportValidation;
    if (!valid) {
      setErrors(errors);
    } else {
      setSaving(true);
      dispatch(saveExport(theExport))
        .then(() => history.push('/exports'))
        .finally(() => setSaving(false));
    }
  };

  const onFieldChange = (field: keyof Export, value: string | boolean) => {
    setTheExport({ ...theExport, [field]: value });
  };

  return (
    <div className="export-editor">
      <div className="header">
        <PageHeader withBackButton title={formatMessage(messages.header)} />

        <div className="buttons">
          <SuccessButton
            disabled={!validateForm(theExport)[0]}
            onClick={handleOnSaveClick}
          >
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
            feedback={formatMessage(validatorMessages.errorExportNameIsEmpty)}
            variant={validateName(theExport.name).length ? 'error' : undefined}
          >
            <TextField
              defaultValue={theExport.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
              className={errors.name.length ? 'input-error' : ''}
            />
          </InputGroup>

          <InputGroup
            variant={
              toDateIsBeforeFromDate(theExport.fromDate, theExport.toDate)
                ? 'error'
                : undefined
            }
            feedback={formatMessage(
              validatorMessages.errorExportFromDateIsAfterToDate
            )}
            label={formatMessage(messages.fromDateFormLabel)}
          >
            <DatePicker
              selectedDate={moment(theExport.fromDate).toDate()}
              onChange={(date: Date | null) =>
                onFieldChange('fromDate', dateToString(date))
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage(messages.toDateFormLabel)}>
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
