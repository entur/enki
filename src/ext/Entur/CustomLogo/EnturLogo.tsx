import { useIntl } from 'react-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from './logo.png';

export const EnturLogo = () => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
        style={{ height: 28, width: 'auto' }}
      />
      <Typography
        variant="h6"
        sx={{ ml: 1, fontWeight: 'bold', color: 'inherit' }}
      >
        {formatMessage({ id: 'appTitle' })}
      </Typography>
    </Box>
  );
};
