import React from 'react';

import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon
} from '@entur/icons';
import './styles.scss';
import { EXPORT_STATUS, SEVERITY } from 'model/enums';

export const getIconForStatus = status => {
  switch (status) {
    case EXPORT_STATUS.SUCCESS:
      return <ValidationCheckIcon className="success-icon" />;
    case EXPORT_STATUS.FAILED:
      return <ValidationErrorIcon className="error-icon" />;
    case EXPORT_STATUS.IN_PROGRESS:
      return <ValidationExclamationIcon className="exlamation-icon" />;
    default:
      return null;
  }
};

export const getIconForSeverity = severity => {
  switch (severity) {
    case SEVERITY.INFO:
      return <ValidationExclamationIcon className="exlamation-icon" />;
    case SEVERITY.WARN:
      return <ValidationErrorIcon className="error-icon" />;
    case SEVERITY.ERROR:
      return <ValidationErrorIcon className="error-icon" />;
    default:
      return null;
  }
};
