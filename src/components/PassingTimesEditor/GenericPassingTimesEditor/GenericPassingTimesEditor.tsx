import { Box, Typography } from '@mui/material';
import { changeElementAtIndex } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { useIntl } from 'react-intl';
import { PassingTimesEditorProps } from '..';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { PassingTimesError } from '../common/PassingTimesError';

export const GenericPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Typography variant="h4">
        {formatMessage({ id: 'serviceJourneyPassingTimes' })}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {formatMessage({ id: 'passingTimesInfo' })}
      </Typography>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <Box
        className="passing-times-editor"
        sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        {passingTimes.map((passingTime, index) => (
          <Box
            key={uniqueKeys[index]}
            className="passing-time"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              borderBottom:
                index < passingTimes.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Box
              className="time-number"
              sx={{
                minWidth: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: 'action.hover',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              {index + 1}
            </Box>
            <FixedPassingTimeEditor
              passingTime={passingTime}
              stopPoint={stopPoints[index]}
              index={index}
              isLast={index === stopPoints.length - 1}
              onChange={(changedPassingTime) => {
                onChange(
                  changeElementAtIndex(passingTimes, changedPassingTime, index),
                );
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};
