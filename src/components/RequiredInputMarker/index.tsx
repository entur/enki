import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import './styles.scss';

const RequiredInputMarker = () => {
  const { formatMessage } = useIntl();
  return (
    <Typography variant="caption" className="required-input">
      <i> {formatMessage({ id: 'requiredInputMarker' })} </i>
    </Typography>
  );
};

export default RequiredInputMarker;
