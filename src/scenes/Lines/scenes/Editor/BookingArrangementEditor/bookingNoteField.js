import React from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextArea } from '@entur/form';
import { selectIntl } from 'i18n';
import messages from './bookingNoteField.messages';

export default ({ bookingNote, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <InputGroup className="form-section" label={formatMessage(messages.title)}>
      <TextArea value={bookingNote} onChange={e => onChange(e.target.value)} />
    </InputGroup>
  );
};
