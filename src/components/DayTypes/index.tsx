import { useQuery } from '@apollo/client';
import { PrimaryButton } from '@entur/button';
import { Checkbox, TextField } from '@entur/form';
import { QuestionIcon } from '@entur/icons';
import { Contrast } from '@entur/layout';
import { Modal } from '@entur/modal';
import {
  DataCell,
  ExpandableRow,
  ExpandRowButton,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Tooltip } from '@entur/tooltip';
import { Heading4 } from '@entur/typography';
import { UttuQuery } from 'api';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import DayTypeAssignmentsEditor from 'components/ServiceJourneyEditor/DayTypeAssignmentsEditor';
import WeekdayPicker from 'components/WeekdayPicker';
import { selectIntl } from 'i18n';
import DayType from 'model/DayType';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type DayTypesData = {
  dayTypes: DayType[];
};

// Hjelpe-komponent for å håndtere en rad og innholdet til raden under
const ExpRow = ({
  dayType,
  selected,
  onSelect,
  children,
}: {
  dayType: DayType;
  selected: boolean;
  onSelect: Function;
  children: any;
}) => {
  const [open, setopen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>
        <DataCell padding="checkbox">
          <Checkbox
            name={dayType.id}
            checked={selected}
            onChange={() => {
              onSelect(dayType.id);
            }}
          />
        </DataCell>
        <DataCell>{dayType.id}</DataCell>
        <DataCell>{dayType.name || 'No name'}</DataCell>
        <DataCell>
          <ExpandRowButton onClick={() => setopen(!open)} open={open} />
        </DataCell>
      </TableRow>
      {/* Tabellen i eksemplet har 3 kolonner, derav colSpan={3} */}
      <ExpandableRow colSpan={3} open={open}>
        {children}
      </ExpandableRow>
    </React.Fragment>
  );
};
// Hjelpekomponent for innholdet inne i den ekspanderte raden
const SummaryTable = ({ dayType }: { dayType: DayType }) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div style={{ padding: '1.5rem' }}>
      <TextField
        label={'name'}
        className="form-section"
        value={dayType.name}
        onChange={() => {}}
      />
      <Heading4>{formatMessage('dayTypeEditorWeekdays')}</Heading4>
      <WeekdayPicker
        days={dayType.daysOfWeek ?? []}
        onChange={(dow) => {}}
        spoilPristine={false}
      />
      <Heading4>
        {formatMessage('dayTypeEditorDateAvailability')}
        <Tooltip
          content={formatMessage('dayTypeEditorDateTooltip')}
          placement="right"
        >
          <span className="question-icon">
            <QuestionIcon />
          </span>
        </Tooltip>
      </Heading4>
      <DayTypeAssignmentsEditor
        dayTypeAssignments={
          dayType.dayTypeAssignments?.length
            ? dayType.dayTypeAssignments
            : [newDayTypeAssignment()]
        }
        onChange={() => {}}
      />
    </div>
  );
};

export const DayTypes = ({
  open,
  setOpen,
  selectedDayTypes,
  selectDayTypes,
}: {
  open: boolean;
  setOpen: Function;
  selectedDayTypes: DayType[];
  selectDayTypes: Function;
}) => {
  const { data, loading } = useQuery<DayTypesData>(GET_DAY_TYPES);
  const [selected, setSelected] = useState<string[]>(
    selectedDayTypes.map((dt) => dt.id!)
  );

  const onSelect = useCallback(
    (ref) => {
      if (selected.includes(ref)) {
        setSelected([...selected.filter((v) => v !== ref)]);
      } else {
        setSelected([...selected, ref]);
      }
    },
    [selected, setSelected]
  );

  const onCompleteButtonClick = useCallback(() => {
    selectDayTypes(data?.dayTypes.filter((dt) => selected.includes(dt.id!)));
    setOpen(false);
  }, [data?.dayTypes, selected]);

  return (
    <Modal
      open={open}
      size="large"
      title={'Select day types'}
      onDismiss={() => setOpen(false)}
      className="copy-dialog"
    >
      {loading && <pre>Loading</pre>}
      {!loading && data && (
        <>
          <PrimaryButton onClick={() => onCompleteButtonClick()}>
            Done
          </PrimaryButton>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell padding="checkbox">
                  <Checkbox name="all" checked={false} onChange={() => {}} />
                </HeaderCell>
                <HeaderCell>Id</HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell padding="radio">{''}</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.dayTypes?.map((dayType: DayType) => (
                <ExpRow
                  dayType={dayType}
                  selected={selected.includes(dayType.id!)}
                  onSelect={onSelect}
                  key={dayType.id}
                >
                  <SummaryTable dayType={dayType} />
                </ExpRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Modal>
  );
};
