import { Box } from '@mui/material';
import { Fragment, ReactElement } from 'react';
import LoadingIcon from '../icons/Loading';

type Props = {
  isLoading: boolean;
  seeThrough?: boolean;
  text?: string;
  className?: string;
  children: ReactElement | ReactElement[];
};

const OverlayLoader = ({
  className,
  isLoading,
  text,
  children,
  seeThrough = true,
}: Props) => {
  return (
    <Box className={className} sx={{ position: 'relative' }}>
      {isLoading && (
        <Fragment>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              zIndex: 1001,
              width: '100%',
              height: '100%',
              backgroundColor: 'background.default',
              opacity: seeThrough ? 0.9 : 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              zIndex: 1001,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 500,
              maxHeight: '1000px',
            }}
          >
            <Box>
              <LoadingIcon />
            </Box>
            <Box sx={{ mt: '5px', fontSize: '17px', fontWeight: 500 }}>
              {text}
            </Box>
          </Box>
        </Fragment>
      )}

      {children}
    </Box>
  );
};

export default OverlayLoader;
