import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { simpleFormat } from '../helpers/translation';
import { componentDisplayName } from './hocs';

export const withI18n = WrappedComponent => {
  class WithI18n extends Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `WithI18n(${componentDisplayName(WrappedComponent)})`;

    render() {
      const i18n = simpleFormat(this.props.intl.formatMessage);
      return <WrappedComponent i18n={i18n} {...this.props} />;
    }
  }

  return injectIntl(WithI18n);
};
