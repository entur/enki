import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import moment from 'moment/moment';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import DayTypeAssignment from 'model/DayTypeAssignment';
import {
  removeElementByIndex,
  replaceElement,
  useUniqueKeys,
} from 'helpers/arrays';
import messages from './messages';
import { DatePicker } from '@entur/datepicker';
import { InputGroup } from '@entur/form';
import OperatingPeriod from 'model/OperatingPeriod';
import { getErrorFeedback } from 'helpers/errorHandling';
import './styles.scss';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const addNewDayTypeAssignment = () => {
    const today: string = moment().format('YYYY-MM-DD');
    const dayTypeAssignment = {
      isAvailable: true,
      operatingPeriod: {
        fromDate: today,
        toDate: today,
      },
    };
    onChange([...dayTypeAssignments, dayTypeAssignment]);
  };

  const changeDay = (op: OperatingPeriod, index: number) => {
    const updated = { ...dayTypeAssignments[index], operatingPeriod: op };
    onChange(replaceElement(dayTypeAssignments, index, updated));
  };

  const isNotBefore = (toDate: string, fromDate: string): boolean =>
    !moment(toDate).isBefore(moment(fromDate));

  if (dayTypeAssignments.length === 0) addNewDayTypeAssignment();

  const uniqueKeys = useUniqueKeys(dayTypeAssignments);
  const operatingPeriods = dayTypeAssignments.map((dta) => dta.operatingPeriod);

  return (
    <>
      <div className="day-type-assignments-editor">
        {operatingPeriods.map((op, index) => (
          <div key={uniqueKeys[index]} className="day-type-assignment">
            <InputGroup label={formatMessage(messages.fromDate)}>
              <DatePicker
                selectedDate={moment(op.fromDate).toDate()}
                onChange={(date: Date | null) =>
                  changeDay({ ...op, fromDate: date?.toString() ?? '' }, index)
                }
              />
            </InputGroup>
            <InputGroup
              label={formatMessage(messages.toDate)}
              {...getErrorFeedback(
                formatMessage(messages.toDateValidation),
                isNotBefore(op.toDate ?? '', op.fromDate ?? ''),
                false
              )}
            >
              <DatePicker
                selectedDate={moment(op.toDate).toDate()}
                onChange={(date: Date | null) =>
                  changeDay({ ...op, toDate: date?.toString() ?? '' }, index)
                }
              />
            </InputGroup>
            {dayTypeAssignments.length > 1 && (
              <SecondaryButton
                className="delete-button"
                onClick={() =>
                  onChange(removeElementByIndex(dayTypeAssignments, index))
                }
              >
                <DeleteIcon inline /> {formatMessage(messages.delete)}
              </SecondaryButton>
            )}
          </div>
        ))}
      </div>
      <SecondaryButton onClick={() => addNewDayTypeAssignment()}>
        <AddIcon />
        {formatMessage(messages.addDayTypeAssignment)}
      </SecondaryButton>
    </>
  );
};

export default DayTypeAssignmentsEditor;
