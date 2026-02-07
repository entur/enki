import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Error from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import { Box, Typography } from '@mui/material';
import { VariantType } from 'helpers/errorHandling';
import { useEffect } from 'react';

type Props = {
  title?: string;
  message: string;
  onRequestClose?: () => void;
  onDismiss: () => void;
  dismissAfter?: number;
  topOffset?: object;
  isActive?: boolean;
  type: VariantType;
};

const typeColors: Record<
  VariantType,
  { bg: string; border: string; color: string }
> = {
  success: { bg: '#d0f1e3', border: '#1a8e60', color: '#1a8e60' },
  error: { bg: '#ffcece', border: '#d31b1b', color: '#d31b1b' },
  negative: { bg: '#ffcece', border: '#d31b1b', color: '#d31b1b' },
  warning: { bg: '#fff4cd', border: '#ffca28', color: '#ffca28' },
  info: { bg: '#e1eff8', border: '#0082b9', color: '#0082b9' },
  information: { bg: '#e1eff8', border: '#0082b9', color: '#0082b9' },
};

const Note = ({
  title,
  message,
  isActive,
  type,
  topOffset,
  onDismiss,
  dismissAfter,
  onRequestClose,
}: Props) => {
  useEffect(() => {
    const transitionIntervall = 500;
    const dismissTimeout = setTimeout(
      onDismiss,
      (dismissAfter ?? 0) + transitionIntervall,
    );
    return () => clearTimeout(dismissTimeout);
    // eslint-disable-next-line
  }, [dismissAfter]);

  const getTypeIcon = (type: VariantType) => {
    const color = typeColors[type]?.color;
    const iconSx = { display: 'flex', color };

    if (type === 'success') {
      return (
        <Box component="span" sx={iconSx}>
          <Check />
        </Box>
      );
    } else if (type === 'error') {
      return (
        <Box component="span" sx={iconSx}>
          <Error />
        </Box>
      );
    } else if (type === 'warning') {
      return (
        <Box component="span" sx={iconSx}>
          <Warning />
        </Box>
      );
    } else if (type === 'info') {
      return (
        <Box component="span" sx={iconSx}>
          <Info />
        </Box>
      );
    } else {
      return null;
    }
  };

  const onCloseClicked = () => {
    if (typeof onRequestClose === 'function') {
      onRequestClose();
    }
  };

  const colors = typeColors[type] ?? typeColors.info;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '2rem',
        right: isActive ? '1rem' : '-100%',
        width: 'auto',
        px: 2,
        py: 0,
        m: 0,
        boxShadow: '0 0 1px 1px rgba(10, 10, 11, 0.125)',
        cursor: 'default',
        transition: '0.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
        transform: 'translate3d(0, 0, 0)',
        boxSizing: 'content-box',
        minWidth: '350px',
        minHeight: '85px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isActive ? 1500 : undefined,
        backgroundColor: colors.bg,
        borderBottom: `3px solid ${colors.border}`,
      }}
      style={topOffset as React.CSSProperties}
    >
      <Box
        sx={{
          justifyContent: 'flex-end',
          ml: 'auto',
          cursor: 'pointer',
          mt: '10px',
          mb: '-5px',
        }}
      >
        <Close onClick={onCloseClicked} sx={{ cursor: 'pointer' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'content-box',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'content-box',
          }}
        >
          {getTypeIcon(type)}
          <Box component="span" sx={{ ml: '10px', color: colors.color }}>
            {title}
          </Box>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            ml: '45px',
            boxSizing: 'content-box',
            mb: '20px',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Note;
