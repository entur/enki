import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';

import { isBlank } from 'helpers/forms';
import messages from './messages';
import { selectIntl } from 'i18n';
import JourneyPattern from 'model/JourneyPattern';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';

type Props = {
  journeyPattern: JourneyPattern;
  onFieldChange: (journeyPattern: JourneyPattern) => void;
  spoilPristine: boolean;
};

const General = ({ journeyPattern, onFieldChange, spoilPristine }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const namePristine = usePristine(journeyPattern.name, spoilPristine);

  return (
    <div className="journey-pattern-inputs">
      <InputGroup
        className="form-section"
        label={formatMessage(messages.nameLabel)}
        {...getErrorFeedback(
          formatMessage(messages.validationName),
          !isBlank(journeyPattern.name),
          namePristine
        )}
      >
        <TextField
          defaultValue={journeyPattern.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
    </div>
  );
};

export default General;
