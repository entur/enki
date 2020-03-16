import React from 'react';
import { Dropdown } from '@entur/dropdown';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import messages from './Form.messages';

export default function StopPlaceSelection({
  stopPlaceSelection,
  error,
  flexibleStopPlaces,
  handleStopPlaceSelectionChange
}) {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Dropdown
      label={formatMessage(messages.stopPlace)}
      variant={error ? 'error' : undefined}
      feedback={error ? formatMessage(error) : undefined}
      items={[
        ...flexibleStopPlaces.map(fsp => ({
          label: fsp.name,
          value: fsp.id
        }))
      ]}
      value={stopPlaceSelection}
      onChange={e => handleStopPlaceSelectionChange(e.value)}
    />
  );
}
