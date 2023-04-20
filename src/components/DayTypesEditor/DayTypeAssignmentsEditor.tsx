import React from 'react';
import moment from 'moment/moment';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { IconButton, TertiaryButton } from '@entur/button';
import DayTypeAssignment from 'model/DayTypeAssignment';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import {
  DatePicker,
  nativeDateToDateValue,
  timeOrDateValueToNativeDate,
} from '@entur/datepicker';
import OperatingPeriod from 'model/OperatingPeriod';
import { getErrorFeedback } from 'helpers/errorHandling';
import './styles.scss';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { Switch } from '@entur/form';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';
import { useIntl } from 'react-intl';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }: Props) => {
  const { formatMessage } = useIntl();

  const addNewDayTypeAssignment = () => {
    const today: string = moment().format('YYYY-MM-DD');
    const tomorrow: string = moment().add(1, 'days').format('YYYY-MM-DD');
    const dayTypeAssignment = {
      isAvailable: true,
      operatingPeriod: {
        fromDate: today,
        toDate: tomorrow,
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

  const isAtLeastOneDayAfter = (toDate: string, fromDate: string): boolean =>
    !moment(toDate).isBefore(moment(fromDate).add(1, 'days'));

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
                      moment(dta.operatingPeriod.fromDate).toDate()
                    )}
                    onChange={(date) => {
                      changeDay(
                        {
                          ...dta.operatingPeriod,
                          fromDate: dateJsToIso(
                            timeOrDateValueToNativeDate(date!)
                          ),
                        },
                        index
                      );
                    }}
                  />
                </DataCell>

                <DataCell>
                  <DatePicker
                    label={formatMessage({ id: 'dayTypeEditorToDate' })}
                    {...getErrorFeedback(
                      formatMessage({ id: 'dayTypeEditorToDateValidation' }),
                      isAtLeastOneDayAfter(
                        dta.operatingPeriod.toDate ?? '',
                        dta.operatingPeriod.fromDate ?? ''
                      ),
                      false
                    )}
                    selectedDate={nativeDateToDateValue(
                      moment(dta.operatingPeriod.toDate).toDate()
                    )}
                    onChange={(date) => {
                      changeDay(
                        {
                          ...dta.operatingPeriod,
                          toDate: dateJsToIso(
                            timeOrDateValueToNativeDate(date!)
                          ),
                        },
                        index
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
                          removeElementByIndex(dayTypeAssignments, index)
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
