import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import {
  Label,
  Checkbox,
  SlideSwitch,
  DeleteIcon
} from '@entur/component-library';
import { DayTypeAssignment } from 'model';
import CustomDatepicker from 'components/CustomDatepicker';
import OperatingPeriod from 'model/OperatingPeriod';
import './styles.scss';

class DayTypeAssignmentEditor extends Component {
  state = {
    useDateRange: Boolean(this.props.dayTypeAssignment.operatingPeriod)
  };

  onFieldChange(field, value) {
    const { dayTypeAssignment, onChange } = this.props;
    onChange(dayTypeAssignment.withFieldChange(field, value));
  }

  handleDateRangeChange() {
    const today = moment().format('YYYY-MM-DD');
    this.state.useDateRange
      ? this.onFieldChange('operatingPeriod', undefined)
      : this.onFieldChange(
          'operatingPeriod',
          new OperatingPeriod({ fromDate: today, toDate: today })
        );
    this.setState(s => ({ useDateRange: !s.useDateRange }));
  }

  handleOperatingPeriodFieldChange(field, value) {
    const { dayTypeAssignment } = this.props;
    const operatingPeriod = dayTypeAssignment.operatingPeriod
      ? dayTypeAssignment.operatingPeriod.withFieldChange(field, value)
      : new OperatingPeriod({ [field]: value });

    this.onFieldChange('operatingPeriod', operatingPeriod);
  }

  render() {
    const {
      dayTypeAssignment: { isAvailable, date, operatingPeriod },
      onDelete
    } = this.props;
    const { useDateRange } = this.state;

    return (
      <div
        className={cx('day-type-assignment-editor', { available: isAvailable })}
      >
        <div className="set-availability">
          <Checkbox
            value="1"
            checked={isAvailable === true}
            onChange={e => this.onFieldChange('isAvailable', e.target.checked)}
          />
        </div>

        <div>
          <SlideSwitch
            id="use-date-range-switch"
            label="Bruk fra og til dato"
            checked={useDateRange}
            onChange={this.handleDateRangeChange.bind(this)}
          />

          {!useDateRange && (
            <div>
              <Label>Dato</Label>
              <CustomDatepicker
                startDate={date}
                onChange={date => this.onFieldChange('date', date)}
              />
            </div>
          )}

          {useDateRange && (
            <div className="range-dates">
              <div>
                <Label>Fra dato</Label>
                <CustomDatepicker
                  startDate={operatingPeriod?.fromDate}
                  onChange={date =>
                    this.handleOperatingPeriodFieldChange('fromDate', date)
                  }
                />
              </div>

              <div>
                <Label>Til dato</Label>
                <CustomDatepicker
                  startDate={operatingPeriod?.toDate}
                  onChange={date =>
                    this.handleOperatingPeriodFieldChange('toDate', date)
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="delete" onClick={onDelete}>
          <DeleteIcon />
        </div>
      </div>
    );
  }
}

DayTypeAssignmentEditor.propTypes = {
  dayTypeAssignment: PropTypes.instanceOf(DayTypeAssignment).isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DayTypeAssignmentEditor;
