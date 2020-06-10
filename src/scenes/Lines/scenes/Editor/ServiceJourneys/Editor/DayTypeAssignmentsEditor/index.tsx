import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import moment from 'moment/moment';
import { AddIcon } from '@entur/icons';
import { TertiaryButton } from '@entur/button';
import DayTypeAssignment from 'model/DayTypeAssignment';
import {
  removeElementByIndex,
  replaceElement,
  useUniqueKeys,
} from 'helpers/arrays';
import { DatePicker } from '@entur/datepicker';
import { InputGroup } from '@entur/form';
import OperatingPeriod from 'model/OperatingPeriod';
import { getErrorFeedback } from 'helpers/errorHandling';
import DeleteButton from 'components/DeleteButton/DeleteButton';
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
  const operatingPeriods = dayTypeAssignments
    .map((dta) => dta.operatingPeriod)
    .filter(Boolean);

  const dateJsToIso = (date: Date | null): string => {
    const dateOrNow = date ?? new Date();
    const y = dateOrNow.getFullYear();
    const m = dateOrNow?.getMonth() + 1;
    const d = dateOrNow?.getDate();
    return `${y}-${m! < 10 ? '0' + m : m}-${d! < 10 ? '0' + d : d}`;
  };

  return (
    <>
      <div className="day-type-assignments-editor">
        {operatingPeriods.map((op, index) => (
          <div key={uniqueKeys[index]} className="day-type-assignment">
            <InputGroup label={formatMessage('dayTypeEditorFromDate')}>
              <DatePicker
                selectedDate={moment(op.fromDate).toDate()}
                onChange={(date: Date | null) =>
                  changeDay({ ...op, fromDate: dateJsToIso(date) }, index)
                }
              />
            </InputGroup>
            <InputGroup
              label={formatMessage('dayTypeEditorToDate')}
              {...getErrorFeedback(
                formatMessage('dayTypeEditorToDateValidation'),
                isNotBefore(op.toDate ?? '', op.fromDate ?? ''),
                false
              )}
            >
              <DatePicker
                selectedDate={moment(op.toDate).toDate()}
                onChange={(date: Date | null) =>
                  changeDay({ ...op, toDate: dateJsToIso(date) }, index)
                }
              />
            </InputGroup>
            {dayTypeAssignments.length > 1 && (
              <DeleteButton
                onClick={() =>
                  onChange(removeElementByIndex(dayTypeAssignments, index))
                }
                title={formatMessage('delete')}
              />
            )}
          </div>
        ))}
      </div>
      <TertiaryButton onClick={() => addNewDayTypeAssignment()}>
        <AddIcon />
        {formatMessage('dayTypeEditorAddDayTypeAssignment')}
      </TertiaryButton>
    </>
  );
};

export default DayTypeAssignmentsEditor;
