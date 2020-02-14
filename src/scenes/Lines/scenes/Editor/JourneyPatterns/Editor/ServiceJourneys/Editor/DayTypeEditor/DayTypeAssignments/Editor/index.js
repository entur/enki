import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import { DeleteIcon } from '@entur/icons';
import { Checkbox, InputGroup, Switch } from '@entur/form';
import { DayTypeAssignment } from 'model';
import { dateToString } from 'helpers/dates';
import { DatePicker } from '@entur/datepicker';
import './styles.scss';
import messages from '../../../../../messages';

const DayTypeAssignmentEditor = ({ dayTypeAssignment, onChange, onDelete }) => {
  const [useDateRange, setUseDateRange] = useState(
    Boolean(dayTypeAssignment.operatingPeriod)
  );
  const { isAvailable, operatingPeriod, date } = dayTypeAssignment || {};
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (field, value) => {
    onChange(dayTypeAssignment.withFieldChange(field, value));
  };

  const handleDateRangeChange = () => {
    const today = moment().format('YYYY-MM-DD');
    useDateRange
      ? onFieldChange('operatingPeriod', undefined)
      : onFieldChange('operatingPeriod', { fromDate: today, toDate: today });
    setUseDateRange(!useDateRange);
  };

  const handleOperatingPeriodFieldChange = (field, value) => {
    const operatingPeriod = {
      ...dayTypeAssignment.operatingPeriod,
      [field]: value
    };

    onFieldChange('operatingPeriod', operatingPeriod);
  };

  return (
    <div
      className={cx('day-type-assignment-editor', { available: isAvailable })}
    >
      <div className="set-availability">
        <Checkbox
          value="1"
          checked={isAvailable === true}
          onChange={e => onFieldChange('isAvailable', e.target.checked)}
        />
      </div>

      <div>
        <InputGroup label={formatMessage(messages.fromAndToDate)}>
          <Switch
            checked={useDateRange}
            onChange={() => handleDateRangeChange()}
          />
        </InputGroup>

        {!useDateRange && (
          <div>
            <InputGroup label={formatMessage(messages.date)}>
              <DatePicker
                selectedDate={date && moment(date).toDate()}
                onChange={date => onFieldChange('date', dateToString(date))}
              />
            </InputGroup>
          </div>
        )}

        {useDateRange && (
          <div className="range-dates">
            <div>
              <InputGroup label={formatMessage(messages.fromDate)}>
                <DatePicker
                  selectedDate={
                    operatingPeriod
                      ? moment(operatingPeriod.fromDate).toDate()
                      : undefined
                  }
                  onChange={date =>
                    handleOperatingPeriodFieldChange(
                      'fromDate',
                      dateToString(date)
                    )
                  }
                />
              </InputGroup>
            </div>

            <div>
              <InputGroup label={formatMessage(messages.toDate)}>
                <DatePicker
                  selectedDate={
                    operatingPeriod
                      ? moment(operatingPeriod.toDate).toDate()
                      : undefined
                  }
                  onChange={date =>
                    handleOperatingPeriodFieldChange(
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
};

DayTypeAssignmentEditor.propTypes = {
  dayTypeAssignment: PropTypes.instanceOf(DayTypeAssignment).isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DayTypeAssignmentEditor;
