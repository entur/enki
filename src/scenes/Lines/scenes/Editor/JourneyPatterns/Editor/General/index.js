import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextArea, TextField } from '@entur/form';

import { JourneyPattern } from 'model';
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
  console.log(journeyPattern.name);

  return (
    <Fragment>
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
        <TextArea
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

      <InputGroup label={formatMessage(messages.directionLabel)}>
        <Dropdown
          items={[
            { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
            ...Object.values(DIRECTION_TYPE)
          ]}
          value={DEFAULT_SELECT_VALUE}
          onChange={({ value }) => handleDirectionSelectionChange(value)}
        />
      </InputGroup>
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
