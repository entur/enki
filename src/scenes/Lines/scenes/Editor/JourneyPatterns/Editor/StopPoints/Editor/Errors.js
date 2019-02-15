import React from 'react';
import {withI18n} from '../../../../../../../../hocs/withI18n';

export default withI18n(function ({i18n, errors}) {
  if (errors.length === 0) {
    return null;
  }
  return (
    <ul className="errors">
      { errors.map(errorKey => <li key={errorKey}>{i18n(errorKey)}</li>) }
    </ul>
  );
});