import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import { DeleteIcon } from '@entur/icons';
import { Checkbox, InputGroup, Switch } from '@entur/form';
import { DayTypeAssignment } from 'model';
import { dateToString } from 'helpers/dates';
import { DatePicker } from '@entur/datepicker';
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
      : this.onFieldChange('operatingPeriod', {
          fromDate: today,
          toDate: today
        });
    this.setState(s => ({ useDateRange: !s.useDateRange }));
  }

  handleOperatingPeriodFieldChange(field, value) {
    const { dayTypeAssignment } = this.props;
    const operatingPeriod = {
      ...dayTypeAssignment.operatingPeriod,
      [field]: value
    };

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
          <InputGroup label="Bruk fra- og til-dato">
            <Switch
              checked={useDateRange}
              onChange={() => this.handleDateRangeChange()}
            />
          </InputGroup>

          {!useDateRange && (
            <div>
              <InputGroup label="Dato">
                <DatePicker
                  selectedDate={date && moment(date).toDate()}
                  onChange={date =>
                    this.onFieldChange('date', dateToString(date))
                  }
                />
              </InputGroup>
            </div>
          )}

          {useDateRange && (
            <div className="range-dates">
              <div>
                <InputGroup label="Fra dato">
                  <DatePicker
                    selectedDate={
                      operatingPeriod
                        ? moment(operatingPeriod.fromDate).toDate()
                        : undefined
                    }
                    onChange={date =>
                      this.handleOperatingPeriodFieldChange(
                        'fromDate',
                        dateToString(date)
                      )
                    }
                  />
                </InputGroup>
              </div>

              <div>
                <InputGroup label="Til dato">
                  <DatePicker
                    selectedDate={
                      operatingPeriod
                        ? moment(operatingPeriod.toDate).toDate()
                        : undefined
                    }
                    onChange={date =>
                      this.handleOperatingPeriodFieldChange(
                        'toDate',
                        dateToString(date)
                      )
                    }
                  />
                </InputGroup>
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
