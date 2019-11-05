import React from 'react';
import {useSelector} from 'react-redux';
import {
  CheckboxGroup,
  Checkbox,
  FormGroup
} from '@entur/component-library';
import {
  BOOKING_METHOD,
} from '../../../../../model/enums';
import {selectIntl} from '../../../../../i18n';
import messages, {bookingMethodMessages} from './bookingMethodSelection.messages';

export default ({ bookingMethods, handleFieldChange }) => {
  const {formatMessage} = useSelector(selectIntl);

  return (
    <FormGroup
      className="form-section"
      inputId="bookingMethods"
      title={formatMessage(messages.title)}
    >
      <CheckboxGroup
        id="bookingMethods"
        onChange={e =>
          handleFieldChange('bookingMethods', e.target.value, true)
        }
      >
        {Object.values(BOOKING_METHOD).map(v => (
          <Checkbox
            key={v}
            label={formatMessage(bookingMethodMessages[v])}
            value={v}
            checked={bookingMethods && bookingMethods.includes(v)}
          />
        ))}
      </CheckboxGroup>
    </FormGroup>
  );
}
