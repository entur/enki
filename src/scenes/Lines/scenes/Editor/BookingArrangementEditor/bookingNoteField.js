import React from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextArea } from '@entur/form';
import { selectIntl } from 'i18n';

export default ({ bookingNote, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <InputGroup
      className="form-section"
      label={formatMessage('bookingNoteFieldTitle')}
    >
      <TextArea
        value={bookingNote ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
};
