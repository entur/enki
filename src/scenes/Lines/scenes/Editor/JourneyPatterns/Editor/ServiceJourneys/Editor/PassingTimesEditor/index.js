import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup } from '@entur/form';
import { StopPoint, PassingTime } from 'model';
import { replaceElement } from 'helpers/arrays';
import TimePicker from 'components/TimePicker';
import { validateTimes } from './validateForm';

import './styles.scss';

class PassingTimesEditor extends Component {
  componentDidMount() {
    const { passingTimes, stopPoints, onChange } = this.props;
    if (passingTimes.length < stopPoints.length) {
      const count = stopPoints.length - passingTimes.length;
      const newPts = passingTimes.slice();
      for (let i = count; i > 0; i--) {
        newPts.push(new PassingTime());
      }
      onChange(newPts);
    } else if (stopPoints.length < passingTimes.length) {
      const newPts = passingTimes.slice();
      newPts.splice(stopPoints.length);
      onChange(newPts);
    }
  }

  componentDidUpdate() {
    const { passingTimes, setValidPassingTimes } = this.props;
    setValidPassingTimes(validateTimes(passingTimes));
  }

  onFieldChange(index, field, value) {
    const { passingTimes, onChange } = this.props;
    const newPt = passingTimes[index]
      ? passingTimes[index].withFieldChange(field, value)
      : new PassingTime({ [field]: value });
    const newPts = replaceElement(passingTimes, index, newPt);

    onChange(newPts);
  }

  handleDayOffsetChange(index, field, value) {
    value = parseInt(value);
    this.onFieldChange(index, field, value !== 0 ? value : undefined);
  }

  getTimePicker = (tpt, index, field) => (
    <TimePicker
      time={tpt && tpt[field] ? tpt[field] : null}
      onChange={t => this.onFieldChange(index, field, t)}
      position="below"
    />
  );

  getDayOffsetDropDown = (tpt, index, field) => (
    <Dropdown
      value={tpt && tpt[field] ? tpt[field].toString() : '0'}
      onChange={e => this.handleDayOffsetChange(index, field, e.value)}
      placeholder="Daytime offset"
      items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({
        value: i,
        label: '+' + i
      }))}
    />
  );

  getValidationMessage = (
    field: 'arrival' | 'departure',
    isFirst: Boolean,
    isLast: Boolean
  ) => {
    if (isFirst) {
      return field === 'departure'
        ? 'Must have a departure time set'
        : undefined;
    } else if (isLast) {
      return field === 'arrival' ? 'Must have a arrival time set' : undefined;
    } else {
      return 'Either departure or arrival time must be set';
    }
  };

  render() {
    const { flexibleStopPlaces, stopPoints, passingTimes } = this.props;

    return stopPoints.map((sp, i) => {
      const stopPlace = flexibleStopPlaces.find(
        fsp => fsp.id === sp.flexibleStopPlaceRef
      );

      const stopPlaceName = stopPlace?.name ?? sp.quayRef;
      const tpt = passingTimes[i];

      return (
        <>
          <h3>{'#' + (i + 1) + ' ' + stopPlaceName} </h3>
          <h4>Avgang</h4>
          <InputGroup label="Tidligste avgangstid">
            <div className="time-and-offset-container">
              <div>{this.getTimePicker(tpt, i, 'earliestDepartureTime')}</div>
              <div className="time-and-offset">
                {this.getDayOffsetDropDown(
                  tpt,
                  i,
                  'earliestDepartureDayOffset'
                )}
              </div>
            </div>
          </InputGroup>

          <InputGroup label="Normal avgangstid">
            <div className="time-and-offset-container">
              <div>{this.getTimePicker(tpt, i, 'departureTime')}</div>
              <div className="time-and-offset">
                {this.getDayOffsetDropDown(tpt, i, 'departureDayOffset')}
              </div>
            </div>
          </InputGroup>
          <h4>Ankomst</h4>
          <InputGroup label="Normal ankomsttid">
            <div className="time-and-offset-container">
              <div>{this.getTimePicker(tpt, i, 'arrivalTime')}</div>
              <div className="time-and-offset">
                {this.getDayOffsetDropDown(tpt, i, 'arrivalDayOffset')}
              </div>
            </div>
          </InputGroup>
          <InputGroup label="Seneste ankomsttid">
            <div className="time-and-offset-container">
              <div>{this.getTimePicker(tpt, i, 'latestArrivalTime')}</div>
              <div className="time-and-offset">
                {this.getDayOffsetDropDown(tpt, i, 'latestArrivalDayOffset')}
              </div>
            </div>
          </InputGroup>
        </>
      );
    });
  }
}

PassingTimesEditor.propTypes = {
  passingTimes: PropTypes.arrayOf(PropTypes.instanceOf(PassingTime)).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired,
  setValidPassingTimes: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(PassingTimesEditor);
