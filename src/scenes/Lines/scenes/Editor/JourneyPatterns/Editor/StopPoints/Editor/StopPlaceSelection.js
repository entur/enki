import React, { Fragment } from 'react';
import { Dropdown } from '@entur/dropdown';
import { DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL } from './constants';

export default function StopPlaceSelection({
  stopPlaceSelection,
  flexibleStopPlaceRefAndQuayRefErrors,
  flexibleStopPlaces,
  handleStopPlaceSelectionChange
}) {
  return (
    <Fragment>
      <Dropdown
        label="Stoppested"
        variant={
          flexibleStopPlaceRefAndQuayRefErrors.length ? 'error' : undefined
        }
        feedback={flexibleStopPlaceRefAndQuayRefErrors[0]}
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
