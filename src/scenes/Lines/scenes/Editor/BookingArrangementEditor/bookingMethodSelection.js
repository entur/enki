import React from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Fieldset } from '@entur/form';
import { BOOKING_METHOD } from 'model/enums';
import { selectIntl } from 'i18n';
import messages, {
  bookingMethodMessages
} from './bookingMethodSelection.messages';

export default ({ bookingMethods, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Fieldset className="form-section" label={formatMessage(messages.title)}>
      {Object.values(BOOKING_METHOD).map(v => (
        <Checkbox
          onChange={e => onChange(e.target.value)}
          value={v}
          key={v}
          checked={bookingMethods && bookingMethods.includes(v)}
        >
          {formatMessage(bookingMethodMessages[v])}
        </Checkbox>
      ))}
    </Fieldset>
  );
};
