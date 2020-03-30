import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { BOOKING_ACCESS } from 'model/enums';
import { selectIntl } from 'i18n';

const bookingAccessMessages = {
  [BOOKING_ACCESS.PUBLIC]: 'bookingAccessPublic',
  [BOOKING_ACCESS.AUTHORISED_PUBLIC]: 'bookingAccessAuthorisedPublic',
  [BOOKING_ACCESS.STAFF]: 'bookingAccessStaff',
};

export default ({ bookingAccess, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Dropdown
      className="form-section"
      label={formatMessage('bookingAccessSelectionTitle')}
      value={bookingAccess}
      items={[
        ...Object.values(BOOKING_ACCESS).map((v) => ({
          value: v,
          label: formatMessage(bookingAccessMessages[v]),
        })),
      ]}
      onChange={({ value }) => onChange(value)}
    />
  );
};
