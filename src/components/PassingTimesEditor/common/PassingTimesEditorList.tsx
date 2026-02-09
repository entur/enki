import { Box, Typography } from '@mui/material';
import { SxProps } from '@mui/material';
import { changeElementAtIndex } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { ComponentType } from 'react';
import { useIntl } from 'react-intl';
import { PassingTimesEditorProps } from '..';
import { PassingTimesError } from './PassingTimesError';

type PassingTimesEditorListProps = PassingTimesEditorProps & {
  headingId: string;
  descriptionId: string;
  descriptionSx?: SxProps;
  EditorComponent: ComponentType<{
    passingTime: PassingTime;
    stopPoint: StopPoint;
    index: number;
    isLast: boolean;
    onChange: (pt: PassingTime) => void;
  }>;
};

export const PassingTimesEditorList = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
  headingId,
  descriptionId,
  descriptionSx,
  EditorComponent,
}: PassingTimesEditorListProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Typography variant="h4">{formatMessage({ id: headingId })}</Typography>
      <Typography variant="body1" sx={descriptionSx}>
        {formatMessage({ id: descriptionId })}
      </Typography>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {passingTimes.map((passingTime, index) => (
          <Box
            key={uniqueKeys[index]}
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
            <EditorComponent
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
