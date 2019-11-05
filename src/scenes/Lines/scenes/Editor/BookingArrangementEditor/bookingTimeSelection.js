import React from 'react';
import {useSelector} from 'react-redux';
import {
  DropDown,
  DropDownOptions,
  FormGroup
} from '@entur/component-library';
import {
  PURCHASE_WHEN
} from '../../../../../model/enums';
import {selectIntl} from '../../../../../i18n';
import messages, {bookingTimeMessages} from './bookingTimeSelection.messages';
import { DEFAULT_SELECT_LABEL, DEFAULT_SELECT_VALUE } from './constants';

export default ({ bookWhen, handleFieldChange }) => {
  const {formatMessage} = useSelector(selectIntl);

  return (
    <FormGroup
      className="form-section"
      inputId="bookWhen"
      title={formatMessage(messages.title)}
    >
      <DropDown
        value={bookWhen}
        onChange={e => handleFieldChange('bookWhen', e.target.value)}
      >
        <DropDownOptions
          label={DEFAULT_SELECT_LABEL}
          value={DEFAULT_SELECT_VALUE}
        />
        {Object.values(PURCHASE_WHEN).map(v => (
          <DropDownOptions
            key={v}
            label={formatMessage(bookingTimeMessages[v])}
            value={v}
          />
        ))}
      </DropDown>
    </FormGroup>
  );
}
