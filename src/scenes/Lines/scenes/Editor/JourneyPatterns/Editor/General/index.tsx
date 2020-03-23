import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';

import { DIRECTION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
import messages from './messages';
import { selectIntl } from 'i18n';
import JourneyPattern from 'model/JourneyPattern';

type Props = {
  journeyPattern: JourneyPattern;
  onFieldChange: (journeyPattern: JourneyPattern) => void;
};

const General = ({ journeyPattern, onFieldChange }: Props) => {
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameHolder(e.target.value)
          }
          onBlur={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange({ ...journeyPattern, name: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        label={formatMessage(messages.descriptionLabel)}
        className="form-section"
      >
        <TextField
          value={journeyPattern.description || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange({ ...journeyPattern, description: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.privateCodeLabel)}
        labelTooltip={formatMessage(messages.privateCodeLabelTooltip)}
      >
        <TextField
          value={journeyPattern.privateCode || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange({ ...journeyPattern, privateCode: e.target.value })
          }
        />
      </InputGroup>

      <Dropdown
        label={formatMessage(messages.directionLabel)}
        items={Object.values(DIRECTION_TYPE)}
        value={journeyPattern.directionType}
        onChange={e =>
          onFieldChange({
            ...journeyPattern,
            directionType: e?.value as DIRECTION_TYPE
          })
        }
      />
    </div>
  );
};

export default General;
