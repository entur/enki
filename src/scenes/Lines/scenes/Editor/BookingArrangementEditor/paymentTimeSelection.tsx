import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Fieldset } from '@entur/form';
import { PURCHASE_MOMENT } from 'model/enums';
import { selectIntl } from 'i18n';
import messages, { paymentTimeMessages } from './paymentTimeSelection.messages';

type Props = {
  buyWhen: PURCHASE_MOMENT[];
  onChange: (purchase: PURCHASE_MOMENT) => void;
};

export default ({ buyWhen, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Fieldset className="form-section" label={formatMessage(messages.title)}>
      {Object.values(PURCHASE_MOMENT).map(v => (
        <Checkbox
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value as PURCHASE_MOMENT)
          }
          value={v}
          key={v}
          checked={buyWhen.includes(v)}
        >
          {formatMessage(paymentTimeMessages[v])}
        </Checkbox>
      ))}
    </Fieldset>
  );
};
