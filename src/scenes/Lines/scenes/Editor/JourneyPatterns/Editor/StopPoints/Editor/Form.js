import React, { Fragment } from 'react';
import Errors from '../../../../Errors';
import {Checkbox, Label, TextField} from '@entur/component-library';
import {hasValue} from '../../../../helpers';
import {withI18n} from '../../../../../../../../hocs/withI18n';
import StopPlaceSelection from './StopPlaceSelection';
import QuaySearchResults from './QuaySearchResults';

export default withI18n(function Form ({
  flexibleStopPlaces,
  i18n,
  stopPlaceSelection,
  quaySearch,
  errors,
  handleStopPlaceSelectionChange,
  handleFieldChange,
  debouncedSearchForQuay,
  handleFrontTextChange,
  stopPoint
}) {
  let frontTextValue = stopPoint.destinationDisplay &&
    stopPoint.destinationDisplay.frontText
      ? stopPoint.destinationDisplay.frontText
      : '';

  return (
    <Fragment>
      <Errors errors={errors.flexibleStopPlaceRefAndQuayRef} />

      <StopPlaceSelection
        stopPlaceSelection={stopPlaceSelection}
        flexibleStopPlaceRefAndQuayRefErrors={errors.flexibleStopPlaceRefAndQuayRef}
        flexibleStopPlaces={flexibleStopPlaces}
        handleStopPlaceSelectionChange={handleStopPlaceSelectionChange}
      />

      <Label>{i18n('label.quayRef')}</Label>
      <TextField
        type="text"
        value={stopPoint.quayRef || ''}
        onChange={e => {
          let value = e.target.value;
          handleFieldChange('quayRef', hasValue(value) ? value : null);
          debouncedSearchForQuay();
        }
        }
        className={(errors.quayRef.length > 0 || errors.flexibleStopPlaceRefAndQuayRef.length > 0) && 'input-error'}
      />

      <QuaySearchResults quaySearch={quaySearch}/>

      <Errors errors={errors.quayRef} />

      <Label>* {i18n('label.frontText')}</Label>
      <TextField
        type="text"
        value={frontTextValue}
        onChange={e => handleFrontTextChange(e.target.value)}
        className={errors.frontText.length > 0 && 'input-error'}
      />

      <Errors errors={errors.frontText} />

      <div style={{marginBottom: '1em'}}>
        <Checkbox
          value={'1'}
          checked={stopPoint.forBoarding === true}
          onChange={e =>
            handleFieldChange('forBoarding', e.target.checked)
          }
          label={i18n('label.forBoarding')}
        />
      </div>

      <Checkbox
        value={'1'}
        checked={stopPoint.forAlighting === true}
        onChange={e =>
          handleFieldChange('forAlighting', e.target.checked)
        }
        label={i18n('label.forAlighting')}
      />
    </Fragment>
  );
});
