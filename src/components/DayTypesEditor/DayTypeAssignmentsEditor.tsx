import { IconButton, TertiaryButton } from '@entur/button';
import {
  DatePicker,
  nativeDateToDateValue,
  timeOrDateValueToNativeDate,
} from '@entur/datepicker';
import { Switch } from '@entur/form';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import { getErrorFeedback } from 'helpers/errorHandling';
import useUniqueKeys from 'hooks/useUniqueKeys';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';
import { useIntl } from 'react-intl';
import { getCurrentDate, calendarDateToISO } from '../../utils/dates';
import './styles.scss';
import { parseAbsoluteToLocal } from '@internationalized/date';

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

  const isNotBefore = (toDate: string, fromDate: string): boolean =>
    parseAbsoluteToLocal(toDate).compare(parseAbsoluteToLocal(fromDate)) > -1;

  if (dayTypeAssignments.length === 0) addNewDayTypeAssignment();

  const uniqueKeys = useUniqueKeys(dayTypeAssignments);

  const dateJsToIso = (date: Date | null | undefined): string => {
    const dateOrNow = date ?? new Date();
    const y = dateOrNow?.getFullYear();
    const m = dateOrNow?.getMonth() + 1;
    const d = dateOrNow?.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
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
                    selectedDate={nativeDateToDateValue(
                      new Date(dta.operatingPeriod.fromDate),
                    )}
                    onChange={(date) => {
                      changeDay(
                        {
                          ...dta.operatingPeriod,
                          fromDate: dateJsToIso(
                            timeOrDateValueToNativeDate(date!),
                          ),
                        },
                        index,
                      );
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
                    selectedDate={nativeDateToDateValue(
                      new Date(dta.operatingPeriod.toDate),
                    )}
                    onChange={(date) => {
                      changeDay(
                        {
                          ...dta.operatingPeriod,
                          toDate: dateJsToIso(
                            timeOrDateValueToNativeDate(date!),
                          ),
                        },
                        index,
                      );
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
