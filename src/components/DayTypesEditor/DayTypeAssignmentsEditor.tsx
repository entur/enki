import { IconButton, TertiaryButton } from '@entur/button';
import { DatePicker, timeOrDateValueToNativeDate } from '@entur/datepicker';
import { Switch } from '@entur/form';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import { getErrorFeedback } from 'helpers/errorHandling';
import useUniqueKeys from 'hooks/useUniqueKeys';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';
import { useIntl } from 'react-intl';
import { getCurrentDate, parseISOToCalendarDate } from '../../utils/dates';
import './styles.scss';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
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

  const isNotBefore = (toDate: string, fromDate: string): boolean => {
    const to = parseISOToCalendarDate(toDate);
    const from = parseISOToCalendarDate(fromDate);
    // If either date can't be parsed, skip validation (return true = no error)
    if (!to || !from) {
      return true;
    }
    return to.compare(from) >= 0;
  };

  if (dayTypeAssignments.length === 0) addNewDayTypeAssignment();

  const uniqueKeys = useUniqueKeys(dayTypeAssignments);

  const dateJsToIso = (date: Date | null | undefined): string => {
    const dateOrNow = date ?? new Date();
    const y = dateOrNow?.getFullYear();
    const m = dateOrNow?.getMonth() + 1;
    const d = dateOrNow?.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  };

  // Check if date has a valid 4-digit year (1000-9999)
  // Used to prevent state updates while user is still typing the year
  const hasValidYear = (date: Date | null | undefined): boolean => {
    if (!date) return false;
    const year = date.getFullYear();
    return year >= 1000 && year <= 9999;
  };

  // Safely parse ISO string to CalendarDate for DatePicker, falling back to today
  const safeParseDate = (isoString: string | null | undefined) => {
    const parsed = parseISOToCalendarDate(isoString);
    return parsed ?? getCurrentDate();
  };

  return (
    <>
      <div className="day-type-assignments-editor">
        <Table>
          <TableBody>
            {dayTypeAssignments.map((dta, index) => (
              <TableRow key={uniqueKeys[index]} className="day-type-assignment">
                <DataCell>
                  <DatePicker
                    label={formatMessage({ id: 'dayTypeEditorFromDate' })}
                    selectedDate={safeParseDate(dta.operatingPeriod.fromDate)}
                    onChange={(date) => {
                      const nativeDate = timeOrDateValueToNativeDate(date!);
                      // Only update state if year is complete (4 digits)
                      if (hasValidYear(nativeDate)) {
                        changeDay(
                          {
                            ...dta.operatingPeriod,
                            fromDate: dateJsToIso(nativeDate),
                          },
                          index,
                        );
                      }
                    }}
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
                    selectedDate={safeParseDate(dta.operatingPeriod.toDate)}
                    onChange={(date) => {
                      const nativeDate = timeOrDateValueToNativeDate(date!);
                      // Only update state if year is complete (4 digits)
                      if (hasValidYear(nativeDate)) {
                        changeDay(
                          {
                            ...dta.operatingPeriod,
                            toDate: dateJsToIso(nativeDate),
                          },
                          index,
                        );
                      }
                    }}
                  />
                </DataCell>

                <DataCell>
                  <Switch
                    checked={dta.isAvailable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      changeIsAvailable(e.target.checked, index);
                    }}
                  >
                    {formatMessage({ id: 'dayTypeAssignmentAvailableLabel' })}
                  </Switch>
                </DataCell>

                <DataCell>
                  {dayTypeAssignments.length > 1 && (
                    <IconButton
                      onClick={() =>
                        onChange(
                          removeElementByIndex(dayTypeAssignments, index),
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </DataCell>
              </TableRow>
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
