import { IconButton, TertiaryButton } from '@entur/button';
import { CalendarDate, DatePicker } from '@entur/datepicker';
import { Switch } from '@entur/form';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import { getErrorFeedback } from 'helpers/errorHandling';
import useUniqueKeys from 'hooks/useUniqueKeys';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getCurrentDate, parseISOToCalendarDate } from '../../utils/dates';
import './styles.scss';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

// Check if CalendarDate has a valid 4-digit year (1000-9999)
// Used to determine when to sync local date state back to parent ISO string state
const hasValidYear = (date: CalendarDate | null): boolean => {
  if (!date) return false;
  return date.year >= 1000 && date.year <= 9999;
};

// Safely parse ISO string to CalendarDate, falling back to today
const safeParseDate = (isoString: string | null | undefined): CalendarDate => {
  const parsed = parseISOToCalendarDate(isoString);
  return parsed ?? getCurrentDate();
};

// Validation: check if toDate is not before fromDate
const isNotBefore = (toDate: string, fromDate: string): boolean => {
  const to = parseISOToCalendarDate(toDate);
  const from = parseISOToCalendarDate(fromDate);
  // If either date can't be parsed, skip validation (return true = no error)
  if (!to || !from) {
    return true;
  }
  return to.compare(from) >= 0;
};

/**
 * Row component that manages local CalendarDate state for DatePickers.
 * This allows users to see their typed input during year entry, while only
 * propagating valid 4-digit year dates back to the parent ISO string state.
 */
type RowProps = {
  dta: DayTypeAssignment;
  index: number;
  showDelete: boolean;
  onOperatingPeriodChange: (op: OperatingPeriod, index: number) => void;
  onIsAvailableChange: (isAvailable: boolean, index: number) => void;
  onDelete: (index: number) => void;
};

const DayTypeAssignmentRow = ({
  dta,
  index,
  showDelete,
  onOperatingPeriodChange,
  onIsAvailableChange,
  onDelete,
}: RowProps) => {
  const { formatMessage } = useIntl();

  // Local state for DatePicker values - allows showing partial year input
  const [localFromDate, setLocalFromDate] = useState<CalendarDate>(() =>
    safeParseDate(dta.operatingPeriod.fromDate),
  );
  const [localToDate, setLocalToDate] = useState<CalendarDate>(() =>
    safeParseDate(dta.operatingPeriod.toDate),
  );

  // Sync local state when parent props change (e.g., external reset or undo)
  useEffect(() => {
    const parsedFrom = safeParseDate(dta.operatingPeriod.fromDate);
    // Only sync if the parent has a different valid date
    if (
      hasValidYear(parsedFrom) &&
      parsedFrom.toString() !== localFromDate.toString()
    ) {
      setLocalFromDate(parsedFrom);
    }
  }, [dta.operatingPeriod.fromDate]);

  useEffect(() => {
    const parsedTo = safeParseDate(dta.operatingPeriod.toDate);
    // Only sync if the parent has a different valid date
    if (
      hasValidYear(parsedTo) &&
      parsedTo.toString() !== localToDate.toString()
    ) {
      setLocalToDate(parsedTo);
    }
  }, [dta.operatingPeriod.toDate]);

  const handleFromDateChange = (date: CalendarDate | null) => {
    if (!date) return;

    // Always update local state so user sees their input
    setLocalFromDate(date);

    // Only propagate to parent when year is complete (4 digits)
    if (hasValidYear(date)) {
      onOperatingPeriodChange(
        {
          ...dta.operatingPeriod,
          fromDate: date.toString(),
        },
        index,
      );
    }
  };

  const handleToDateChange = (date: CalendarDate | null) => {
    if (!date) return;

    // Always update local state so user sees their input
    setLocalToDate(date);

    // Only propagate to parent when year is complete (4 digits)
    if (hasValidYear(date)) {
      onOperatingPeriodChange(
        {
          ...dta.operatingPeriod,
          toDate: date.toString(),
        },
        index,
      );
    }
  };

  return (
    <TableRow className="day-type-assignment">
      <DataCell>
        <DatePicker
          label={formatMessage({ id: 'dayTypeEditorFromDate' })}
          selectedDate={localFromDate}
          onChange={handleFromDateChange}
        />
      </DataCell>

      <DataCell>
        <DatePicker
          label={formatMessage({ id: 'dayTypeEditorToDate' })}
          {...getErrorFeedback(
            formatMessage({ id: 'dayTypeEditorToDateValidation' }),
            isNotBefore(
              dta.operatingPeriod.toDate ?? '',
              dta.operatingPeriod.fromDate ?? '',
            ),
            false,
          )}
          selectedDate={localToDate}
          onChange={handleToDateChange}
        />
      </DataCell>

      <DataCell>
        <Switch
          checked={dta.isAvailable}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onIsAvailableChange(e.target.checked, index);
          }}
        >
          {formatMessage({ id: 'dayTypeAssignmentAvailableLabel' })}
        </Switch>
      </DataCell>

      <DataCell>
        {showDelete && (
          <IconButton onClick={() => onDelete(index)}>
            <DeleteIcon />
          </IconButton>
        )}
      </DataCell>
    </TableRow>
  );
};

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }: Props) => {
  const { formatMessage } = useIntl();

  const addNewDayTypeAssignment = () => {
    const today = getCurrentDate();
    const tomorrow = today.add({ days: 1 });
    const dayTypeAssignment = {
      isAvailable: true,
      operatingPeriod: {
        fromDate: today.toString(),
        toDate: tomorrow.toString(),
      },
    };
    onChange([...dayTypeAssignments, dayTypeAssignment]);
  };

  const changeDay = (op: OperatingPeriod, index: number) => {
    const updated = { ...dayTypeAssignments[index], operatingPeriod: op };
    onChange(replaceElement(dayTypeAssignments, index, updated));
  };

  const changeIsAvailable = (isAvailable: boolean, index: number) => {
    const updated = { ...dayTypeAssignments[index], isAvailable };
    onChange(replaceElement(dayTypeAssignments, index, updated));
  };

  const deleteAssignment = (index: number) => {
    onChange(removeElementByIndex(dayTypeAssignments, index));
  };

  if (dayTypeAssignments.length === 0) addNewDayTypeAssignment();

  const uniqueKeys = useUniqueKeys(dayTypeAssignments);

  return (
    <>
      <div className="day-type-assignments-editor">
        <Table>
          <TableBody>
            {dayTypeAssignments.map((dta, index) => (
              <DayTypeAssignmentRow
                key={uniqueKeys[index]}
                dta={dta}
                index={index}
                showDelete={dayTypeAssignments.length > 1}
                onOperatingPeriodChange={changeDay}
                onIsAvailableChange={changeIsAvailable}
                onDelete={deleteAssignment}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <TertiaryButton onClick={() => addNewDayTypeAssignment()}>
        <AddIcon />
        {formatMessage({ id: 'dayTypeEditorAddDayTypeAssignment' })}
      </TertiaryButton>
    </>
  );
};

export default DayTypeAssignmentsEditor;
