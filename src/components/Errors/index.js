import React from 'react';
import { injectIntl } from 'react-intl';
import './styles.scss';

export default injectIntl(function({ intl, errors }) {
  if (errors.length === 0) {
    return null;
  }
  return (
    <ul className="errors">
      {errors.map(errorKey => (
        <li key={errorKey}>{intl.formatMessage(errorKey)}</li>
      ))}
    </ul>
  );
});
