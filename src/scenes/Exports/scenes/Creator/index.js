import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Button, Label, TextField, Checkbox } from '@entur/component-library';

import { Export } from 'model';
import { saveExport } from 'actions/exports';
import OverlayLoader from 'components/OverlayLoader';
import CustomDatepicker from 'components/CustomDatepicker';
import { selectIntl } from 'i18n';
import Errors from 'components/Errors';

import './styles.css';
import messages from './creator.messages';
import validateForm from './validateForm';

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
          <Button variant="success" onClick={handleOnSaveClick}>
            {formatMessage(messages.saveButtonLabelText)}
          </Button>
        </div>
      </div>

      <OverlayLoader
        isLoading={isSaving}
        text={formatMessage(messages.savingOverlayLoaderText)}
      >
        <div className="export-form">
          <Label>{formatMessage(messages.nameFormLabel)}</Label>
          <TextField
            type="text"
            value={theExport.name}
            onChange={e => onFieldChange('name', e.target.value)}
            className={errors.name.length ? 'input-error' : ''}
          />

          <Errors errors={errors.name} />

          <Label>{formatMessage(messages.fromDateFormLabel)}</Label>
          <CustomDatepicker
            startDate={theExport.fromDate}
            onChange={date => onFieldChange('fromDate', date)}
            datePickerClassName={
              errors.fromDateToDate.length ? 'input-error' : ''
            }
          />

          <Label>{formatMessage(messages.toDateFormLabel)}</Label>
          <CustomDatepicker
            startDate={theExport.toDate}
            onChange={date => onFieldChange('toDate', date)}
            datePickerClassName={
              errors.fromDateToDate.length ? 'input-error' : ''
            }
          />

          <Errors errors={errors.fromDateToDate} />

          <Label>{formatMessage(messages.dryRunFormLabel)}</Label>
          <Checkbox
            value="1"
            checked={theExport.dryRun === true}
            onChange={e => onFieldChange('dryRun', e.target.checked)}
          />
        </div>
      </OverlayLoader>
    </div>
  );
};

export default withRouter(ExportsCreator);
