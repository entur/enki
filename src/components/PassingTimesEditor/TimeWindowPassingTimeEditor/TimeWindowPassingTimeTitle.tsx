import { Typography } from '@mui/material';
import StopPoint from 'model/StopPoint';
import { ReactElement } from 'react';
import { useAppSelector } from '../../../store/hooks';

type Props = {
  stopPoint: StopPoint;
};

const TimeWindowPassingTimeTitle = ({ stopPoint }: Props): ReactElement => {
  const flexibleStopPlaces = useAppSelector(
    (state) => state.flexibleStopPlaces,
  );

  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
      {flexibleStopPlaces?.find(
        (stop) =>
          stop.id ===
          (stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id),
      )?.name ?? ''}
    </Typography>
  );
};

export default TimeWindowPassingTimeTitle;
