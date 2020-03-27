import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { PURCHASE_WHEN } from 'model/enums';
import { selectIntl } from 'i18n';

export const bookingTimeMessages = {
  [PURCHASE_WHEN.TIME_OF_TRAVEL_ONLY]: 'purchaseWhenTimeOfTravelOnly',
  [PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY]: 'purchaseWhenDayOfTravelOnly',
  [PURCHASE_WHEN.UNTIL_PREVIOUS_DAY]: 'purchaseWhenUntilPreviousDay',
  [PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL]:
    'purchaseWhenAdvanceAndDayOfTravel',
};

export default ({ bookWhen, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Dropdown
      className="form-section"
      label={formatMessage('bookingTimeSelectionTitle')}
      value={bookWhen}
      items={[
        ...Object.values(PURCHASE_WHEN).map((v) => ({
          value: v,
          label: formatMessage(bookingTimeMessages[v]),
        })),
      ]}
      onChange={({ value }) => onChange(value)}
    />
  );
};
