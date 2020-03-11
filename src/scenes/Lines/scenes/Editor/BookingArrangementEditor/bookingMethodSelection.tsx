import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Fieldset } from '@entur/form';
import { BOOKING_METHOD } from 'model/enums';
import { selectIntl } from 'i18n';
import messages, {
  bookingMethodMessages
} from './bookingMethodSelection.messages';

type Props = {
  bookingMethods: BOOKING_METHOD[];
  onChange: (bookingMethod: BOOKING_METHOD) => void;
};

export default ({ bookingMethods, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Fieldset className="form-section" label={formatMessage(messages.title)}>
      {Object.values(BOOKING_METHOD).map(v => (
        <Checkbox
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value as BOOKING_METHOD)
          }
          value={v}
          key={v}
          checked={bookingMethods.includes(v)}
        >
          {formatMessage(bookingMethodMessages[v])}
        </Checkbox>
      ))}
    </Fieldset>
  );
};
