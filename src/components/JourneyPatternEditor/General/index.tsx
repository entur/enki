import { TextField, Tooltip } from '@mui/material';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import JourneyPattern from 'model/JourneyPattern';
import { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import Grid from '@mui/material/Grid';

type Props = {
  journeyPattern: JourneyPattern;
  onFieldChange: (journeyPattern: JourneyPattern) => void;
  spoilPristine: boolean;
};

const General = ({ journeyPattern, onFieldChange, spoilPristine }: Props) => {
  const { formatMessage } = useIntl();

  const namePristine = usePristine(journeyPattern.name, spoilPristine);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
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
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
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
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Tooltip
          title={formatMessage({ id: 'generalPrivateCodeLabelTooltip' })}
        >
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
      </Grid>
    </Grid>
  );
};

export default General;
