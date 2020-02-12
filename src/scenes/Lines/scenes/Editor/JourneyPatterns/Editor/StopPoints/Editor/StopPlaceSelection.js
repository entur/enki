import React, { Fragment } from 'react';
import { Dropdown } from '@entur/dropdown';
import { DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL } from './constants';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

export default function StopPlaceSelection({
  stopPlaceSelection,
  flexibleStopPlaceRefAndQuayRefErrors,
  flexibleStopPlaces,
  handleStopPlaceSelectionChange
}) {
  const { formatMessage } = useSelector(selectIntl);
  const error = flexibleStopPlaceRefAndQuayRefErrors[0];

  return (
    <Fragment>
      <Dropdown
        label="Stoppested"
        variant={error ? 'error' : undefined}
        feedback={error ? formatMessage(error) : undefined}
        items={[
          { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
          ...flexibleStopPlaces.map(fsp => ({
            label: fsp.name,
            value: fsp.id
          }))
        ]}
        value={stopPlaceSelection}
        onChange={e => handleStopPlaceSelectionChange(e.value)}
      />
    </Fragment>
  );
}
