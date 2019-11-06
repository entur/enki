import React from 'react';
import {useSelector} from 'react-redux';
import {
  DropDown,
  DropDownOptions,
  FormGroup
} from '@entur/component-library';
import {
  BOOKING_ACCESS
} from '../../../../../model/enums';
import {
  DEFAULT_SELECT_LABEL,
  DEFAULT_SELECT_VALUE
} from './constants';
import {selectIntl} from '../../../../../i18n';
import messages, {bookingAccessMessages} from './bookingAccessSelection.messages';

export default ({ bookingAccess, onChange }) => {
  const {formatMessage} = useSelector(selectIntl);
  return (
    <FormGroup
      className="form-section"
      inputId="bookingAccess"
      title={formatMessage(messages.title)}
    >
      <DropDown
        value={bookingAccess}
        onChange={e =>
          onChange(e.target.value)
        }
      >
        <DropDownOptions
          label={DEFAULT_SELECT_LABEL}
          value={DEFAULT_SELECT_VALUE}
        />
        {Object.values(BOOKING_ACCESS).map(v => (
          <DropDownOptions
            key={v}
            label={formatMessage(bookingAccessMessages[v])}
            value={v}
          />
        ))}
      </DropDown>
    </FormGroup>
  );
}
