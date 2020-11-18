import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { TextField } from '@entur/form';
import { isBlank } from 'helpers/forms';
import { selectIntl } from 'i18n';
import JourneyPattern from 'model/JourneyPattern';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import './styles.scss';

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
      <TextField
        label={formatMessage('generalNameLabel')}
        {...getErrorFeedback(
          formatMessage('generalValidationName'),
          !isBlank(journeyPattern.name),
          namePristine
        )}
        value={journeyPattern.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({ ...journeyPattern, name: e.target.value })
        }
      />

      <TextField
        label={formatMessage('generalDescriptionLabel')}
        value={journeyPattern.description || ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({ ...journeyPattern, description: e.target.value })
        }
      />

      <TextField
        label={formatMessage('generalPrivateCodeLabel')}
        labelTooltip={formatMessage('generalPrivateCodeLabelTooltip')}
        value={journeyPattern.privateCode || ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({ ...journeyPattern, privateCode: e.target.value })
        }
      />
    </div>
  );
};

export default General;
