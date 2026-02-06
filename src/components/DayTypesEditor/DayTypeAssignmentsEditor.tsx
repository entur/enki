import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getCurrentDate, isNotBefore } from '../../utils/dates';
import { parseISO, format, isValid } from 'date-fns';
import './styles.scss';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

/**
 * Convert ISO date string to native Date, with fallback to today.
 */
const parseToNativeDate = (isoString: string | null | undefined): Date => {
  if (!isoString) return new Date();
  const parsed = parseISO(isoString);
  return isValid(parsed) ? parsed : new Date();
};

/**
 * Convert native Date to ISO date string (YYYY-MM-DD).
 */
const toISODateString = (date: Date | null): string | null => {
  if (!date || !isValid(date)) return null;
  return format(date, 'yyyy-MM-dd');
};

/**
 * Row component that manages local Date state for DatePickers.
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

  const [localFromDate, setLocalFromDate] = useState<Date | null>(() =>
    parseToNativeDate(dta.operatingPeriod.fromDate),
  );
  const [localToDate, setLocalToDate] = useState<Date | null>(() =>
    parseToNativeDate(dta.operatingPeriod.toDate),
  );

  // Sync local state when parent props change
  useEffect(() => {
    const parsed = parseToNativeDate(dta.operatingPeriod.fromDate);
    if (isValid(parsed)) {
      setLocalFromDate(parsed);
    }
  }, [dta.operatingPeriod.fromDate]);

  useEffect(() => {
    const parsed = parseToNativeDate(dta.operatingPeriod.toDate);
    if (isValid(parsed)) {
      setLocalToDate(parsed);
    }
  }, [dta.operatingPeriod.toDate]);

  const handleFromDateChange = (date: Date | null) => {
    setLocalFromDate(date);
    const isoString = toISODateString(date);
    if (isoString) {
      onOperatingPeriodChange(
        {
          ...dta.operatingPeriod,
          fromDate: isoString,
        },
        index,
      );
    }
  };

  const handleToDateChange = (date: Date | null) => {
    setLocalToDate(date);
    const isoString = toISODateString(date);
    if (isoString) {
      onOperatingPeriodChange(
        {
          ...dta.operatingPeriod,
          toDate: isoString,
        },
        index,
      );
    }
  };

  const toDateIsValid = isNotBefore(
    dta.operatingPeriod.toDate ?? '',
    dta.operatingPeriod.fromDate ?? '',
  );

  return (
    <TableRow className="day-type-assignment">
      <TableCell>
        <DatePicker
          label={formatMessage({ id: 'dayTypeEditorFromDate' })}
          value={localFromDate}
          onChange={handleFromDateChange}
        />
      </TableCell>

      <TableCell>
        <DatePicker
          label={formatMessage({ id: 'dayTypeEditorToDate' })}
          value={localToDate}
          onChange={handleToDateChange}
          slotProps={{
            textField: {
              error: !toDateIsValid,
              helperText: !toDateIsValid
                ? formatMessage({ id: 'dayTypeEditorToDateValidation' })
                : '',
            },
          }}
        />
      </TableCell>

      <TableCell>
        <FormControlLabel
          control={
            <Switch
              checked={dta.isAvailable}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onIsAvailableChange(e.target.checked, index);
              }}
            />
          }
          label={formatMessage({ id: 'dayTypeAssignmentAvailableLabel' })}
        />
      </TableCell>

      <TableCell>
        {showDelete && (
          <IconButton onClick={() => onDelete(index)}>
            <Delete />
          </IconButton>
        )}
      </TableCell>
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
      <Button
        variant="text"
        onClick={() => addNewDayTypeAssignment()}
        startIcon={<Add />}
      >
        {formatMessage({ id: 'dayTypeEditorAddDayTypeAssignment' })}
      </Button>
    </>
  );
};

export default DayTypeAssignmentsEditor;
