import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextArea, TextField } from '@entur/form';

import { DIRECTION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
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
    <div className="journey-pattern-inputs">
      <InputGroup
        className="form-section"
        label={formatMessage(messages.nameLabel)}
        feedback={
          isBlank(journeyPattern.name) ? 'Navn må fylles inn.' : undefined
        }
        variant={isBlank(journeyPattern.name) ? 'error' : undefined}
      >
        <TextField
          defaultValue={journeyPattern.name}
          onChange={e => onFieldChange('name', e.target.value)}
        />
      </InputGroup>

      <InputGroup
        label={formatMessage(messages.descriptionLabel)}
        className="form-section"
      >
        <TextField
          value={journeyPattern.description || ''}
          onChange={e => onFieldChange('description', e.target.value)}
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.privateCodeLabel)}
      >
        <TextField
          value={journeyPattern.privateCode || ''}
          onChange={e => onFieldChange('privateCode', e.target.value)}
        />
      </InputGroup>

      <Dropdown
        label={formatMessage(messages.directionLabel)}
        items={[
          { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
          ...Object.values(DIRECTION_TYPE)
        ]}
        value={directionSelection}
        onChange={({ value }) => handleDirectionSelectionChange(value)}
      />
    </div>
  );
};

General.propTypes = {
  journeyPattern: PropTypes.object.isRequired,
  directionSelection: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleDirectionSelectionChange: PropTypes.func.isRequired
};

export default General;
