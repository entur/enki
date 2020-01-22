import React from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Fieldset } from '@entur/form';
import { PURCHASE_MOMENT } from 'model/enums';
import { selectIntl } from 'i18n';
import messages, { paymentTimeMessages } from './paymentTimeSelection.messages';

export default ({ buyWhen, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Fieldset className="form-section" label={formatMessage(messages.title)}>
      {Object.values(PURCHASE_MOMENT).map(v => (
        <Checkbox
          onChange={e => onChange(e.target.value)}
          value={v}
          key={v}
          checked={buyWhen && buyWhen.includes(v)}
        >
          {formatMessage(paymentTimeMessages[v])}
        </Checkbox>
      ))}
    </Fieldset>
  );
};
