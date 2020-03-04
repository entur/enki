import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import cx from 'classnames';
import moment from 'moment';
import { DeleteIcon } from '@entur/icons';
import { Checkbox, InputGroup, Switch } from '@entur/form';
import { dateToString } from 'helpers/dates';
import { DatePicker } from '@entur/datepicker';
import './styles.scss';
import messages from '../../../../../messages';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';

type Props = {
  dayTypeAssignment: DayTypeAssignment;
  onChange: (dayTypeAssignment: DayTypeAssignment) => void;
  onDelete: () => void;
};

const DayTypeAssignmentEditor = ({
  dayTypeAssignment,
  onChange,
  onDelete
}: Props) => {
  const [useDateRange, setUseDateRange] = useState(
    Boolean(dayTypeAssignment.operatingPeriod)
  );
  const { isAvailable, operatingPeriod, date } = dayTypeAssignment || {};
  const { formatMessage } = useSelector(selectIntl);

  const handleDateRangeChange = () => {
    const today = moment().format('YYYY-MM-DD');
    const dateFields = useDateRange
      ? { date: today, operatingPeriod: null }
      : {
          date: undefined,
          operatingPeriod: { fromDate: today, toDate: today }
        };

    onChange({ ...dayTypeAssignment, ...dateFields });
    setUseDateRange(!useDateRange);
  };

  const handleOperatingPeriodFieldChange = (
    field: keyof OperatingPeriod,
    date: Date | null
  ) => {
    if (!dayTypeAssignment.operatingPeriod || !date) return;

    const newOperatingPeriod = {
      ...dayTypeAssignment,
      operatingPeriod: {
        ...dayTypeAssignment.operatingPeriod,
        [field]: dateToString(date)
      }
    };

    onChange(newOperatingPeriod);
  };

  return (
    <div
      className={cx('day-type-assignment-editor', { available: isAvailable })}
    >
      <div className="set-availability">
        <Checkbox
          value="1"
          checked={isAvailable === true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...dayTypeAssignment, isAvailable: e.target.checked })
          }
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
                selectedDate={moment(date).toDate()}
                onChange={(date: Date | null) =>
                  onChange({
                    ...dayTypeAssignment,
                    date: date !== null ? dateToString(date) : undefined
                  })
                }
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
                  onChange={(date: Date | null) =>
                    handleOperatingPeriodFieldChange('fromDate', date)
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
                  onChange={(date: Date | null) =>
                    handleOperatingPeriodFieldChange('toDate', date)
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

export default DayTypeAssignmentEditor;
