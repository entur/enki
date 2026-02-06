import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { EXPORT_STATUS, SEVERITY } from 'model/enums';

export const getIconForStatus = (status?: EXPORT_STATUS) => {
  switch (status) {
    case EXPORT_STATUS.SUCCESS:
      return <CheckCircleIcon sx={{ color: '#1a8e60' }} />;
    case EXPORT_STATUS.FAILED:
      return <ErrorIcon sx={{ color: '#d31b1b' }} />;
    case EXPORT_STATUS.IN_PROGRESS:
      return <WarningIcon sx={{ color: '#ffca28' }} />;
    default:
      return null;
  }
};

export const getIconForSeverity = (severity?: SEVERITY) => {
  switch (severity) {
    case SEVERITY.INFO:
      return <WarningIcon sx={{ color: '#ffca28' }} />;
    case SEVERITY.WARN:
      return <ErrorIcon sx={{ color: '#d31b1b' }} />;
    case SEVERITY.ERROR:
      return <ErrorIcon sx={{ color: '#d31b1b' }} />;
    default:
      return null;
  }
};
