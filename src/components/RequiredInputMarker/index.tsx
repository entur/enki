import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';

const RequiredInputMarker = () => {
  const { formatMessage } = useIntl();
  return (
    <Typography variant="caption" sx={{ display: 'block', mb: 2.5 }}>
      <i> {formatMessage({ id: 'requiredInputMarker' })} </i>
    </Typography>
  );
};

export default RequiredInputMarker;
