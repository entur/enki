import React from 'react';
import {useSelector} from 'react-redux';
import {
  CheckboxGroup,
  Checkbox,
  FormGroup
} from '@entur/component-library';
import {
  PURCHASE_MOMENT,
} from '../../../../../model/enums';
import {selectIntl} from '../../../../../i18n';
import messages, {paymentTimeMessages} from './paymentTimeSelection.messages';

export default ({ buyWhen, handleFieldChange }) => {
  const {formatMessage} = useSelector(selectIntl);
  return (
    <FormGroup
      className="form-section"
      inputId="buyWhen"
      title={formatMessage(messages.title)}
    >
      <CheckboxGroup
        id="buyWhen"
        onChange={e =>
          handleFieldChange('buyWhen', e.target.value, true)
        }
      >
        {Object.values(PURCHASE_MOMENT).map(v => (
          <Checkbox
            key={v}
            label={formatMessage(paymentTimeMessages[v])}
            value={v}
            checked={buyWhen && buyWhen.includes(v)}
          />
        ))}
      </CheckboxGroup>
    </FormGroup>
  );
}
