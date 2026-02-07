import { Typography } from '@mui/material';
import { useQuaySearch } from 'api/useQuaySearch';
import StopPoint from 'model/StopPoint';
import { ReactElement } from 'react';

type Props = {
  stopPoint: StopPoint;
};

const FixedPassingTimeTitle = ({ stopPoint }: Props): ReactElement => {
  const quayRef = stopPoint.quayRef;
  const { stopPlace } = useQuaySearch(quayRef);

  return (
    <Typography
      className="title"
      variant="body2"
      sx={{ minWidth: 120, flexShrink: 0 }}
    >
      {stopPlace?.name.value ?? quayRef}
    </Typography>
  );
};

export default FixedPassingTimeTitle;
