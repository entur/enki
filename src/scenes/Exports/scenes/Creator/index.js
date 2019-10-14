import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Button, Label, TextField, Checkbox } from '@entur/component-library';

import { Export } from '../../../../model';
import { saveExport } from '../../../../actions/exports';
import OverlayLoader from '../../../../components/OverlayLoader';
import CustomDatepicker from '../../../../components/CustomDatepicker';

import './styles.css';

const newExport = () => {
  const today = moment().format('YYYY-MM-DD');
  return new Export({ fromDate: today, toDate: today })
}

const ExportsCreator = ({ history }) => {
  const [isSaving, setSaving] = useState(false);
  const [theExport, setTheExport] = useState(newExport());

  const dispatch = useDispatch();

  const handleOnSaveClick = () => {
    setSaving(true);
    dispatch(saveExport(theExport))
      .finally(() => history.push('/exports'))
  };

  const handleFieldChange = (field, value) => {
    setTheExport(theExport.withChanges({ [field]: value }));
  };

  return (
    <div className="export-editor">
      <div className="header">
        <h2>Opprett eksport</h2>

        <div className="buttons">
          <Button variant="success" onClick={handleOnSaveClick}>
            Lagre
          </Button>
        </div>
      </div>

      <OverlayLoader isLoading={isSaving} text="Lagrer eksporten...">
        <div className="export-form">
          <Label>* Navn</Label>
          <TextField
            type="text"
            value={theExport.name}
            onChange={e => handleFieldChange('name', e.target.value)}
          />

          <Label>* Fra dato</Label>
          <CustomDatepicker
            startDate={theExport.fromDate}
            onChange={date => handleFieldChange('fromDate', date)}
          />

          <Label>* Til dato</Label>
          <CustomDatepicker
            startDate={theExport.toDate}
            onChange={date => handleFieldChange('toDate', date)}
          />

          <Label>Tørrkjøring</Label>
          <Checkbox
            value="1"
            checked={theExport.dryRun === true}
            onChange={e =>
              handleFieldChange('dryRun', e.target.checked)
            }
          />
        </div>
      </OverlayLoader>
    </div>
  );
}

export default withRouter(ExportsCreator);
