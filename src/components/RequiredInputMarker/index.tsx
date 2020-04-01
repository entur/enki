import React from 'react';
import { useSelector } from 'react-redux';
import { Label } from '@entur/typography';
import { selectIntl } from 'i18n';
import './styles.scss';

const RequiredInputMarker = () => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Label className="required-input">
      <i> {formatMessage('requiredInputMarker')} </i>
    </Label>
  );
};

export default RequiredInputMarker;
