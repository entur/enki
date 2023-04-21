import { TextField } from '@entur/form';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import JourneyPattern from 'model/JourneyPattern';
import { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import './styles.scss';

type Props = {
  journeyPattern: JourneyPattern;
  onFieldChange: (journeyPattern: JourneyPattern) => void;
  spoilPristine: boolean;
};

const General = ({ journeyPattern, onFieldChange, spoilPristine }: Props) => {
  const { formatMessage } = useIntl();

  const namePristine = usePristine(journeyPattern.name, spoilPristine);

  return (
    <div className="journey-pattern-inputs">
      <TextField
        label={formatMessage({ id: 'generalNameLabel' })}
        {...getErrorFeedback(
          formatMessage({ id: 'generalValidationName' }),
          !isBlank(journeyPattern.name),
          namePristine
        )}
        value={journeyPattern.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({ ...journeyPattern, name: e.target.value })
        }
      />

      <TextField
        label={formatMessage({ id: 'generalDescriptionLabel' })}
        value={journeyPattern.description || ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({
            ...journeyPattern,
            description: e.target.value || null,
          })
        }
      />

      <TextField
        label={formatMessage({ id: 'generalPrivateCodeLabel' })}
        labelTooltip={formatMessage({ id: 'generalPrivateCodeLabelTooltip' })}
        value={journeyPattern.privateCode || ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({
            ...journeyPattern,
            privateCode: e.target.value || null,
          })
        }
      />
    </div>
  );
};

export default General;
