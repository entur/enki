import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup } from '@entur/form';
import { BOOKING_ACCESS } from 'model/enums';
import { DEFAULT_SELECT_LABEL, DEFAULT_SELECT_VALUE } from './constants';
import { selectIntl } from 'i18n';
import messages, {
  bookingAccessMessages
} from './bookingAccessSelection.messages';

export default ({ bookingAccess, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <InputGroup className="form-section" label={formatMessage(messages.title)}>
      <Dropdown
        value={bookingAccess}
        items={[
          { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
          ...Object.values(BOOKING_ACCESS).map(v => ({
            value: v,
            label: formatMessage(bookingAccessMessages[v])
          }))
        ]}
        onChange={({ value }) => onChange(value)}
      />
    </InputGroup>
  );
};
