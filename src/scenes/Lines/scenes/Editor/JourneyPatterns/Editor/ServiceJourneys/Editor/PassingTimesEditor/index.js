import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropDown, DropDownOptions } from '@entur/component-library';

import { StopPoint, PassingTime } from 'model';
import { replaceElement } from 'helpers/arrays';
import TimePicker from 'components/TimePicker';

import './styles.css';

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

  handleFieldChange(index, field, value) {
    const { passingTimes, onChange } = this.props;

    const newPt = passingTimes[index]
      ? passingTimes[index].withChanges({
          [field]: value
        })
      : new PassingTime({ [field]: value });
    const newPts = replaceElement(passingTimes, index, newPt);

    onChange(newPts);
  }

  handleDayOffsetChange(index, field, value) {
    value = parseInt(value);
    this.handleFieldChange(index, field, value !== 0 ? value : undefined);
  }

  getTimePicker = (tpt, index, field) => (
    <TimePicker
      time={tpt && tpt[field] ? tpt[field] : null}
      onChange={t => this.handleFieldChange(index, field, t)}
      position="below"
    />
  );

  getDayOffsetDropDown = (tpt, index, field) => (
    <DropDown
      value={tpt && tpt[field] ? tpt[field].toString() : '0'}
      onChange={e => this.handleDayOffsetChange(index, field, e.target.value)}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <DropDownOptions key={i} label={'+' + i} value={i} />
      ))}
    </DropDown>
  );

  render() {
    const { flexibleStopPlaces, passingTimes, stopPoints } = this.props;

    const passingTimeEditors = stopPoints.map((sp, i) => {
      let stopPlaceName;

      const stopPlace = flexibleStopPlaces.find(
        fsp => fsp.id === sp.flexibleStopPlaceRef
      );

      if (stopPlace) {
        stopPlaceName = stopPlace.name;
      } else {
        stopPlaceName = sp.quayRef;
      }

      const tpt = passingTimes[i];

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
            <div className="time-n-day">
              <div className="time">
                {this.getTimePicker(tpt, i, 'departureTime')}
              </div>
              <div className="day">
                {this.getDayOffsetDropDown(tpt, i, 'departureDayOffset')}
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="passing-times-editor">
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
                <div>Tidligst</div>
                <div>Normalt</div>
              </div>
            </div>
          </div>
        </div>
        <div className="passing-time-editors">{passingTimeEditors}</div>
      </div>
    );
  }
}

PassingTimesEditor.propTypes = {
  passingTimes: PropTypes.arrayOf(PropTypes.instanceOf(PassingTime)).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(PassingTimesEditor);
