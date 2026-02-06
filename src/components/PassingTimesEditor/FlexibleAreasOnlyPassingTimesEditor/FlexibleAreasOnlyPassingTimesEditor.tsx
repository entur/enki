import { Typography } from '@mui/material';
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
      <div className="passing-times-editor">
        <div className="passing-time">
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
        </div>
      </div>
    </>
  );
};
