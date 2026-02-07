import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { EXPORT_STATUS, SEVERITY } from 'model/enums';

export const getIconForStatus = (status?: EXPORT_STATUS) => {
  switch (status) {
    case EXPORT_STATUS.SUCCESS:
      return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    case EXPORT_STATUS.FAILED:
      return <ErrorIcon sx={{ color: 'error.main' }} />;
    case EXPORT_STATUS.IN_PROGRESS:
      return <WarningIcon sx={{ color: 'warning.main' }} />;
    default:
      return null;
  }
};

export const getIconForSeverity = (severity?: SEVERITY) => {
  switch (severity) {
    case SEVERITY.INFO:
      return <WarningIcon sx={{ color: 'warning.main' }} />;
    case SEVERITY.WARN:
      return <ErrorIcon sx={{ color: 'error.main' }} />;
    case SEVERITY.ERROR:
      return <ErrorIcon sx={{ color: 'error.main' }} />;
    default:
      return null;
  }
};
