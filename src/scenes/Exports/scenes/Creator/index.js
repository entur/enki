import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { SuccessButton } from '@entur/button';
import { Checkbox, InputGroup, TextField } from '@entur/form';
import { DatePicker } from '@entur/datepicker';
import { Export } from 'model';
import { dateToString } from 'helpers/dates';
import { saveExport } from 'actions/exports';
import OverlayLoader from 'components/OverlayLoader';
import { selectIntl } from 'i18n';

import './styles.scss';
import messages from './creator.messages';
import validatorMessages from './validateForm.messages';
import validateForm, {
  validateName,
  toDateIsBeforeFromDate
} from './validateForm';

const newExport = () => {
  const today = moment().format('YYYY-MM-DD');
  return new Export({ fromDate: today, toDate: today });
};

const ExportsCreator = ({ history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const [isSaving, setSaving] = useState(false);
  const [theExport, setTheExport] = useState(newExport());
  const [errors, setErrors] = useState({
    name: [],
    fromDateToDate: []
  });

  const dispatch = useDispatch();

  const handleOnSaveClick = () => {
    let [valid, errors] = validateForm(theExport);
    if (!valid) {
      setErrors(errors);
    } else {
      setSaving(true);
      dispatch(saveExport(theExport))
        .then(() => history.push('/exports'))
        .finally(() => setSaving(false));
    }
  };

  const onFieldChange = useCallback(
    (field, value) => {
      setTheExport(theExport.withFieldChange(field, value));
    },
    [theExport]
  );

  return (
    <div className="export-editor">
      <div className="header">
        <h2>{formatMessage(messages.header)}</h2>

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
              onChange={e => onFieldChange('name', e.target.value)}
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
              onChange={date => onFieldChange('fromDate', dateToString(date))}
            />
          </InputGroup>

          <InputGroup label={formatMessage(messages.toDateFormLabel)}>
            <DatePicker
              selectedDate={moment(theExport.toDate).toDate()}
              onChange={date => onFieldChange('toDate', dateToString(date))}
            />
          </InputGroup>

          <InputGroup label={formatMessage(messages.dryRunFormLabel)}>
            <Checkbox
              value="1"
              checked={theExport.dryRun === true}
              onChange={e => onFieldChange('dryRun', e.target.checked)}
            />
          </InputGroup>
        </div>
      </OverlayLoader>
    </div>
  );
};

export default withRouter(ExportsCreator);
