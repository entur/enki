import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { EXPORT_STATUS, SEVERITY } from 'model/enums';
import './styles.scss';

export const getIconForStatus = (status?: EXPORT_STATUS) => {
  switch (status) {
    case EXPORT_STATUS.SUCCESS:
      return <CheckCircleIcon className="success-icon" />;
    case EXPORT_STATUS.FAILED:
      return <ErrorIcon className="error-icon" />;
    case EXPORT_STATUS.IN_PROGRESS:
      return <WarningIcon className="exlamation-icon" />;
    default:
      return null;
  }
};

export const getIconForSeverity = (severity?: SEVERITY) => {
  switch (severity) {
    case SEVERITY.INFO:
      return <WarningIcon className="exlamation-icon" />;
    case SEVERITY.WARN:
      return <ErrorIcon className="error-icon" />;
    case SEVERITY.ERROR:
      return <ErrorIcon className="error-icon" />;
    default:
      return null;
  }
};
