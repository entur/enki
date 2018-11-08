import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropDown, DropDownOptions } from '@entur/component-library';

import {
  StopPointInJourneyPattern,
  TimetabledPassingTime
} from '../../../../../../../../../../model';
import { replaceElement } from '../../../../../../../../../../helpers/arrays';
import TimePicker from '../../../../../../../../../../components/TimePicker';

import './styles.css';

class TimetabledPassingTimesEditor extends Component {
  componentDidMount() {
    const { timetabledPassingTimes, stopPoints, onChange } = this.props;
    if (timetabledPassingTimes.length < stopPoints.length) {
      const count = stopPoints.length - timetabledPassingTimes.length;
      const newTpts = timetabledPassingTimes.slice();
      for (let i = count; i > 0; i--) {
        newTpts.push(new TimetabledPassingTime());
      }
      onChange(newTpts);
    } else if(stopPoints.length < timetabledPassingTimes.length) {
      const newTpts = timetabledPassingTimes.slice();
      newTpts.splice(stopPoints.length);
      onChange(newTpts);
    }
  }

  handleFieldChange(index, field, value) {
    const { timetabledPassingTimes, onChange } = this.props;

    const newTpt = timetabledPassingTimes[index]
      ? timetabledPassingTimes[index].withChanges({
          [field]: value
        })
      : new TimetabledPassingTime({ [field]: value });
    const newTpts = replaceElement(timetabledPassingTimes, index, newTpt);

    onChange(newTpts);
  }

  handleDayOffsetChange(index, field, value) {
    value = parseInt(value);
    this.handleFieldChange(index, field, value !== 0 ? value : undefined);
  }

  getTimePicker(tpt, index, field) {
    return (
      <TimePicker
        time={tpt && tpt[field] ? tpt[field] : null}
        onChange={t => this.handleFieldChange(index, field, t)}
        position="below"
      />
    );
  }

  getDayOffsetDropDown(tpt, index, field) {
    return (
      <DropDown
        value={tpt && tpt[field] ? tpt[field].toString() : '0'}
        onChange={e => this.handleDayOffsetChange(index, field, e.target.value)}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <DropDownOptions key={i} label={'+' + i} value={i} />
        ))}
      </DropDown>
    );
  }

  render() {
    const {
      flexibleStopPlaces,
      timetabledPassingTimes,
      stopPoints
    } = this.props;

    const passingTimeEditors = stopPoints.map((sp, i) => {
      const stopPlaceName = flexibleStopPlaces.find(
        fsp => fsp.id === sp.flexibleStopPlaceRef
      ).name;
      const tpt = timetabledPassingTimes[i];

      return (
        <div key={i} className="passing-time-editor">
          <div className="number">{i + 1}</div>

          <div className="stop-place">
            <div>{stopPlaceName}</div>
          </div>

          <div className="times">
            <div className="time-n-day">
              <div className="time">
                {this.getTimePicker(tpt, i, 'arrivalTime')}
              </div>
              <div className="day">
                {this.getDayOffsetDropDown(tpt, i, 'arrivalDayOffset')}
              </div>
            </div>
            <div className="time-n-day">
              <div className="time">
                {this.getTimePicker(tpt, i, 'latestArrivalTime')}
              </div>
              <div className="day">
                {this.getDayOffsetDropDown(tpt, i, 'latestArrivalDayOffset')}
              </div>
            </div>
          </div>

          <div className="times">
            <div className="time-n-day">
              <div className="time">
                {this.getTimePicker(tpt, i, 'departureTime')}
              </div>
              <div className="day">
                {this.getDayOffsetDropDown(tpt, i, 'departureDayOffset')}
              </div>
            </div>
            <div className="time-n-day">
              <div className="time">
                {this.getTimePicker(tpt, i, 'earliestDepartureTime')}
              </div>
              <div className="day">
                {this.getDayOffsetDropDown(
                  tpt,
                  i,
                  'earliestDepartureDayOffset'
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="timetabled-passing-times-editor">
        <div className="headers">
          <div className="number">#</div>
          <div className="stop-place">Stoppested</div>
          <div className="table-headers">
            <div className="collection">
              <div className="upper">Ankomst</div>
              <div className="lowers">
                <div>Normalt</div>
                <div>Senest</div>
              </div>
            </div>

            <div className="collection">
              <div className="upper">Avgang</div>
              <div className="lowers">
                <div>Normalt</div>
                <div>Tidligst</div>
              </div>
            </div>
          </div>
        </div>
        <div className="passing-time-editors">{passingTimeEditors}</div>
      </div>
    );
  }
}

TimetabledPassingTimesEditor.propTypes = {
  timetabledPassingTimes: PropTypes.arrayOf(
    PropTypes.instanceOf(TimetabledPassingTime)
  ).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPointInJourneyPattern))
    .isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(TimetabledPassingTimesEditor);
