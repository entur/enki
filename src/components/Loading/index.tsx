import { Box } from '@mui/material';
import { ReactElement } from 'react';

import LoadingIcon from '../icons/Loading';

type Props = {
  isLoading?: boolean;
  isFullScreen?: boolean;
  text: string;
  className?: string;
  children: ReactElement | null | (() => ReactElement);
};

const Loading = ({
  className,
  isLoading = true,
  isFullScreen,
  text,
  children,
}: Props) => {
  if (!isLoading) {
    return typeof children === 'function' ? children() : children;
  }

  if (isFullScreen) {
    return (
      <Box
        className={className}
        sx={{
          display: 'block',
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2,
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            position: 'absolute',
            left: '50%',
            top: '50%',
            zIndex: 3,
          }}
        >
          <LoadingIcon />
        </Box>
        <Box sx={{ mt: '5px', fontSize: '17px', fontWeight: 500 }}>{text}</Box>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '100px',
        textAlign: 'center',
        color: 'primary.main',
      }}
    >
      <Box>
        <LoadingIcon />
      </Box>
      <Box sx={{ mt: '5px', fontSize: '17px', fontWeight: 500 }}>{text}</Box>
    </Box>
  );
};

export default Loading;
