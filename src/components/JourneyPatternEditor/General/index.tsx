import { TextField, Tooltip } from '@mui/material';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
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
        {...getMuiErrorProps(
          formatMessage({ id: 'generalValidationName' }),
          !isBlank(journeyPattern.name),
          namePristine,
        )}
        value={journeyPattern.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange({ ...journeyPattern, name: e.target.value })
        }
        variant="outlined"
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
        variant="outlined"
      />

      <Tooltip title={formatMessage({ id: 'generalPrivateCodeLabelTooltip' })}>
        <TextField
          label={formatMessage({ id: 'generalPrivateCodeLabel' })}
          value={journeyPattern.privateCode || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange({
              ...journeyPattern,
              privateCode: e.target.value || null,
            })
          }
          variant="outlined"
        />
      </Tooltip>
    </div>
  );
};

export default General;
