import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import { JourneyPattern } from 'model';
import { DIRECTION_TYPE } from 'model/enums';
import { DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL } from '../../../constants';
import messages from './messages';
import { selectIntl } from 'i18n';

const General = ({
  journeyPattern,
  directionSelection,
  onFieldChange,
  handleDirectionSelectionChange
}) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Fragment>
      <Label>{formatMessage(messages.nameLabel)}</Label>
      <TextField
        type="text"
        value={journeyPattern.name}
        onChange={e => onFieldChange('name', e.target.value)}
      />

      <Label>{formatMessage(messages.descriptionLabel)}</Label>
      <TextArea
        type="text"
        value={journeyPattern.description}
        onChange={e => onFieldChange('description', e.target.value)}
      />

      <Label>{formatMessage(messages.privateCodeLabel)}</Label>
      <TextField
        type="text"
        value={journeyPattern.privateCode}
        onChange={e => onFieldChange('privateCode', e.target.value)}
      />

      <Label>{formatMessage(messages.directionLabel)}</Label>
      <DropDown
        value={directionSelection}
        onChange={e => handleDirectionSelectionChange(e.target.value)}
      >
        <DropDownOptions
          label={DEFAULT_SELECT_LABEL}
          value={DEFAULT_SELECT_VALUE}
        />
        {Object.values(DIRECTION_TYPE).map(dt => (
          <DropDownOptions key={dt} label={dt} value={dt} />
        ))}
      </DropDown>
    </Fragment>
  );
};

General.propTypes = {
  journeyPattern: PropTypes.instanceOf(JourneyPattern).isRequired,
  directionSelection: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleDirectionSelectionChange: PropTypes.func.isRequired
};

export default General;
