import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';

import { DIRECTION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
import messages from './messages';
import { selectIntl } from 'i18n';

const General = ({
  journeyPattern,
  directionSelection,
  onFieldChange,
  handleDirectionSelectionChange
}) => {
  const [nameHolder, setNameHolder] = useState(journeyPattern.name);
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="journey-pattern-inputs">
      <InputGroup
        className="form-section"
        label={formatMessage(messages.nameLabel)}
        feedback={isBlank(nameHolder) ? 'Navn må fylles inn.' : undefined}
        variant={isBlank(nameHolder) ? 'error' : undefined}
      >
        <TextField
          defaultValue={nameHolder}
          onChange={e => setNameHolder(e.target.value)}
          onBlur={e => onFieldChange('name', e.target.value)}
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
        items={[...Object.values(DIRECTION_TYPE)]}
        value={directionSelection}
        onChange={({ value }) => handleDirectionSelectionChange(value)}
      />
    </div>
  );
};

General.propTypes = {
  journeyPattern: PropTypes.object.isRequired,
  directionSelection: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  handleDirectionSelectionChange: PropTypes.func.isRequired
};

export default General;
