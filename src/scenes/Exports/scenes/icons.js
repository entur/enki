import React from 'react';

import {
  SuccessIcon,
  ExclamationIcon,
  ErrorIcon
} from '@entur/component-library';

import { EXPORT_STATUS, SEVERITY } from '../../../model/enums';

export const getIconForStatus = (status) => {
  switch (status) {
    case EXPORT_STATUS.SUCCESS:
      return <SuccessIcon color="rgba(44,255,0,1)" />;
    case EXPORT_STATUS.FAILED:
      return <ErrorIcon color="rgba(255,0,0,1)" />;
    case EXPORT_STATUS.IN_PROGRESS:
      return <ExclamationIcon color="rgba(231,231,98,1)" />;
    default:
      return null;
  }
}

export const getIconForSeverity = (severity) => {
  switch (severity) {
    case SEVERITY.INFO:
      return <ExclamationIcon color="rgba(203,203,188,1)" />;
    case SEVERITY.WARN:
      return <ErrorIcon color="rgba(255,234,0,1)" />;
    case SEVERITY.ERROR:
      return <ErrorIcon color="rgba(255,0,0,1)" />;
    default:
      return null;
  }
}
