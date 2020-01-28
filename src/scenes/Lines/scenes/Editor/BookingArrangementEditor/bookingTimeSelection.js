import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { PURCHASE_WHEN } from 'model/enums';
import { selectIntl } from 'i18n';
import messages, { bookingTimeMessages } from './bookingTimeSelection.messages';
import { DEFAULT_SELECT_LABEL, DEFAULT_SELECT_VALUE } from './constants';

export default ({ bookWhen, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Dropdown
      className="form-section"
      label={formatMessage(messages.title)}
      value={bookWhen}
      items={[
        { label: DEFAULT_SELECT_LABEL, value: DEFAULT_SELECT_VALUE },
        ...Object.values(PURCHASE_WHEN).map(v => ({
          value: v,
          label: formatMessage(bookingTimeMessages[v])
        }))
      ]}
      onChange={({ value }) => onChange(value)}
    />
  );
};
