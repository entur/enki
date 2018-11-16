import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Label,
  Checkbox,
  SlideSwitch,
  DeleteIcon
} from '@entur/component-library';

import { DayTypeAssignment } from '../../../../../../../../../../../../../../model/index';
import CustomDatepicker from '../../../../../../../../../../../../../../components/CustomDatepicker/index';
import OperatingPeriod from '../../../../../../../../../../../../../../model/OperatingPeriod';

import './styles.css';

class DayTypeAssignmentEditor extends Component {
  state = { useDateRange: this.props.dayTypeAssignment.operatingPeriod };

  handleDateRangeChange() {
    if (this.state.useDateRange) {
      this.handleFieldChange('operatingPeriod', undefined);
    }
    this.setState(s => ({ useDateRange: !s.useDateRange }));
  }

  handleFieldChange(field, value) {
    const { dayTypeAssignment, onChange } = this.props;
    onChange(dayTypeAssignment.withChanges({ [field]: value }));
  }

  handleOperatingPeriodFieldChange(field, value) {
    const { dayTypeAssignment, onChange } = this.props;
    const operatingPeriod = dayTypeAssignment.operatingPeriod
      ? dayTypeAssignment.operatingPeriod.withChanges({ [field]: value })
      : new OperatingPeriod({ [field]: value });
    onChange(dayTypeAssignment.withChanges({ operatingPeriod }));
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
            onChange={e =>
              this.handleFieldChange('isAvailable', e.target.checked)
            }
          />
        </div>

        <div>
          <SlideSwitch
            id="use-date-range-switch"
            label="Bruk fra og til dato"
            checked={useDateRange}
            onChange={::this.handleDateRangeChange}
          />

          {!useDateRange && (
            <div>
              <Label>Dato</Label>
              <CustomDatepicker
                startDate={date}
                onChange={date => this.handleFieldChange('date', date)}
              />
            </div>
          )}

          {useDateRange && (
            <div className="range-dates">
              <div>
                <Label>Fra dato</Label>
                <CustomDatepicker
                  startDate={
                    operatingPeriod ? operatingPeriod.fromDate : undefined
                  }
                  onChange={date =>
                    this.handleOperatingPeriodFieldChange('fromDate', date)
                  }
                />
              </div>

              <div>
                <Label>Til dato</Label>
                <CustomDatepicker
                  startDate={
                    operatingPeriod ? operatingPeriod.toDate : undefined
                  }
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
  dayTypeAssignment: PropTypes.arrayOf(PropTypes.instanceOf(DayTypeAssignment))
    .isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DayTypeAssignmentEditor;
