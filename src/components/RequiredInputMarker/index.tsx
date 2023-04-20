import React from 'react';
import { useSelector } from 'react-redux';
import { Label } from '@entur/typography';
import { useIntl } from 'react-intl';
import './styles.scss';

const RequiredInputMarker = () => {
  const { formatMessage } = useIntl();
  return (
    <Label className="required-input">
      <i> {formatMessage({ id: 'requiredInputMarker' })} </i>
    </Label>
  );
};

export default RequiredInputMarker;
