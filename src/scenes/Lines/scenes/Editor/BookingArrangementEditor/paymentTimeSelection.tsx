import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Fieldset } from '@entur/form';
import { PURCHASE_MOMENT } from 'model/enums';
import { AppIntlState, selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { MessagesKey } from 'i18n/translations/translationKeys';

export const paymentTimeMessages: { [key in PURCHASE_MOMENT]: string } = {
  [PURCHASE_MOMENT.ON_RESERVATION]: 'purchaseMomentOnReservation',
  [PURCHASE_MOMENT.BEFORE_BOARDING]: 'purchaseMomentBeforeBoarding',
  [PURCHASE_MOMENT.AFTER_BOARDING]: 'purchaseMomentAfterBoarding',
  [PURCHASE_MOMENT.ON_CHECK_OUT]: 'purchaseMomentOnCheckOut',
};

type Props = {
  buyWhen: PURCHASE_MOMENT[];
  onChange: (purchase: PURCHASE_MOMENT) => void;
};

export default ({ buyWhen, onChange }: Props) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  return (
    <Fieldset
      className="form-section"
      label={formatMessage('paymentSelectionTitle')}
    >
      {Object.values(PURCHASE_MOMENT).map((v) => (
        <Checkbox
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value as PURCHASE_MOMENT)
          }
          value={v}
          key={v}
          checked={buyWhen.includes(v)}
        >
          {formatMessage(paymentTimeMessages[v] as keyof MessagesKey)}
        </Checkbox>
      ))}
    </Fieldset>
  );
};
