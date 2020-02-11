import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { Label } from '@entur/typography';
import { TextField } from '@entur/form';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import { ClockIcon } from '@entur/icons';
import { StopPoint, PassingTime } from 'model';
import { replaceElement } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';

import './styles.scss';

class PassingTimesEditor extends Component {
  state = {
    isValid: true,
    errorMessage: ''
  };

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

  componentDidUpdate(prevProps) {
    const { passingTimes, setValidPassingTimes, intl } = this.props;
    const { isValid, errorMessage } = validateTimes(passingTimes, { intl });
    if (this.props !== prevProps) {
      this.setState({ isValid, errorMessage });
    }
    setValidPassingTimes(isValid);
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

  getDayOffsetDropDown = (tpt, index, field) => (
    <Dropdown
      items={[...Array(10).keys()].map(i => ({
        value: i,
        label: i
      }))}
      onChange={({ value }) => this.handleDayOffsetChange(index, field, value)}
      className="hourpicker"
      value={tpt && tpt[field] ? tpt[field].toString() : 0}
    />
  );

  getTimePicker = (tpt, index, field) => {
    const currentValue = tpt && tpt[field];

    const shownValue =
      currentValue
        ?.split(':')
        .slice(0, 2)
        .join(':') || undefined;

    return (
      <TextField
        onChange={e => this.onFieldChange(index, field, e.target.value + ':00')}
        prepend={<ClockIcon inline />}
        type="time"
        className="timepicker"
        value={shownValue}
      />
    );
  };

  renderRow = (sp, i) => {
    const { flexibleStopPlaces, passingTimes } = this.props;
    const stopPlace = flexibleStopPlaces.find(
      fsp => fsp.id === sp.flexibleStopPlaceRef
    );

    const stopPlaceName = stopPlace?.name ?? sp.quayRef;
    const tpt = passingTimes[i];

    return (
      <TableRow>
        <DataCell>{i}</DataCell>
        <DataCell>{stopPlaceName}</DataCell>
        <DataCell>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Label>Tidligst</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'earliestDepartureTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(
                    tpt,
                    i,
                    'earliestDepartureDayOffset'
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'departureTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'departureDayOffset')}
                </div>
              </div>
            </div>
          </div>
        </DataCell>
        <DataCell>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'arrivalTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'arrivalDayOffset')}
                </div>
              </div>
            </div>
            <div>
              <Label>Senest</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'latestArrivalTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'latestArrivalDayOffset')}
                </div>
              </div>
            </div>
          </div>
        </DataCell>
      </TableRow>
    );
  };

  renderRows = () => {
    const { stopPoints } = this.props;
    return stopPoints.map((sp, i) => this.renderRow(sp, i));
  };

  render() {
    const { isValid, errorMessage } = this.state;
    return (
      <>
        {!isValid && (
          <SmallAlertBox variant="error"> {errorMessage} </SmallAlertBox>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>#</HeaderCell>
              <HeaderCell>Stoppested</HeaderCell>
              <HeaderCell>Ankomst</HeaderCell>
              <HeaderCell>Avgang</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderRows()}</TableBody>
        </Table>
      </>
    );
  }
}

PassingTimesEditor.propTypes = {
  passingTimes: PropTypes.arrayOf(PropTypes.instanceOf(PassingTime)).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired,
  setValidPassingTimes: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces, intl }) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(PassingTimesEditor);
