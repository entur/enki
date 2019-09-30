import React, { Fragment } from 'react';
import {DropDown, DropDownOptions, Label} from '@entur/component-library';
import {DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL} from './constants';

export default function StopPlaceSelection ({ stopPlaceSelection, flexibleStopPlaceRefAndQuayRefErrors, flexibleStopPlaces, handleStopPlaceSelectionChange }) {
  return (
    <Fragment>
      <Label>Stoppested</Label>
      <DropDown
        value={stopPlaceSelection}
        onChange={e =>
          handleStopPlaceSelectionChange(e.target.value)
        }
        className={flexibleStopPlaceRefAndQuayRefErrors.length > 0 ? 'input-error' : ''}
      >
        <DropDownOptions
          label={DEFAULT_SELECT_LABEL}
          value={DEFAULT_SELECT_VALUE}
        />
        {flexibleStopPlaces.map(fsp => (
          <DropDownOptions
            key={fsp.name}
            label={fsp.name}
            value={fsp.id}
          />
        ))}
      </DropDown>
    </Fragment>
  );
}
