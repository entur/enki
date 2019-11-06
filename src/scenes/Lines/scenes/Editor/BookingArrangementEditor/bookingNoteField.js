import React from 'react';
import {useSelector} from 'react-redux';
import {
  TextArea,
  FormGroup
} from '@entur/component-library';
import {selectIntl} from '../../../../../i18n';
import messages from './bookingNoteField.messages';

export default ({ bookingNote, onChange }) => {
  const {formatMessage} = useSelector(selectIntl);
  return (
    <FormGroup
      className="form-section"
      inputId="bookingNote"
      title={formatMessage(messages.title)}
    >
      <TextArea
        id="note"
        type="text"
        value={bookingNote}
        onChange={e => onChange(e.target.value)}
      />
    </FormGroup>
  );
}
