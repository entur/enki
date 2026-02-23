import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { PassingTimesEditorProps } from '..';
import { TimeWindowPassingTimeEditor } from '../TimeWindowPassingTimeEditor/TimeWindowPassingTimeEditor';
import { PassingTimesError } from '../common/PassingTimesError';

export const FlexibleAreasOnlyPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Typography variant="h4">
        {formatMessage({ id: 'serviceJourneyBusinessHours' })}
      </Typography>
      <Typography variant="body1">
        {formatMessage({ id: 'passingTimesInfoFlexibleAreasOnly' })}
      </Typography>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ py: 2 }}>
          <TimeWindowPassingTimeEditor
            passingTime={passingTimes[0]}
            stopPoint={stopPoints[0]}
            onChange={(changedPassingTime) => {
              const { id, ...rest } = changedPassingTime;

              onChange([
                changedPassingTime,
                {
                  ...passingTimes[1],
                  ...rest,
                },
              ]);
            }}
          />
        </Box>
      </Box>
    </>
  );
};
