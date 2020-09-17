import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  HeaderCell,
  TableBody,
  DataCell,
  useSortableData,
} from '@entur/table';
import { Checkbox } from '@entur/form';
import OperatingPeriod from 'model/OperatingPeriod';
import { useQuery } from '@apollo/client';
import FlexibleLine from 'model/FlexibleLine';
import Line from 'model/Line';
import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import { SmallText, StrongText } from '@entur/typography';
import JourneyPattern from 'model/JourneyPattern';
import parseDate from 'date-fns/parseISO';
import { isBefore, differenceInCalendarDays } from 'date-fns';
import { isAfter } from 'date-fns/esm';

type Props = {
  availability: OperatingPeriod;
};

type LinesData = {
  lines: Line[];
  flexibleLines: FlexibleLine[];
};

type ExportableLine = {
  id: string;
  name: string;
  status: string;
  from: Date;
  to: Date;
  selected: boolean;
};

type Availability = {
  from: Date;
  to: Date;
};

const union = (left: Availability, right: Availability): Availability => {
  return {
    from: isBefore(right.from, left.from) ? right.from : left.from,
    to: isAfter(right.to, left.to) ? right.to : left.to,
  };
};

const getAvailability = (journeyPatterns?: JourneyPattern[]): Availability => {
  let availability = { from: new Date(), to: new Date() };

  journeyPatterns?.forEach((jp) =>
    jp.serviceJourneys.forEach((sj) =>
      sj.dayTypes?.forEach((dt) =>
        dt.dayTypeAssignments.forEach(
          (dta) =>
            (availability = union(availability, {
              from: parseDate(dta.operatingPeriod.fromDate),
              to: parseDate(dta.operatingPeriod.toDate),
            }))
        )
      )
    )
  );

  return availability;
};

const mapLine = ({ id, name, journeyPatterns }: Line): ExportableLine => {
  const today = new Date();
  const availability = getAvailability(journeyPatterns);
  const availableForDaysFromNow = differenceInCalendarDays(
    availability.to,
    today
  );

  let status;

  if (availableForDaysFromNow > 121) {
    status = 'positive';
  } else if (availableForDaysFromNow > 0) {
    status = 'neutral';
  } else {
    status = 'negative';
  }

  return {
    id: id!,
    name: name!,
    status,
    ...availability,
    selected: false,
  };
};

const mapStatusToText = (status: string): string => {
  if (status === 'positive') {
    return 'Available next 120 days';
  } else if (status === 'neutral') {
    return 'Becomes unavailable in less than 120 days';
  } else {
    return 'No availability';
  }
};

export default (props: Props) => {
  const [lines, setLines] = useState<ExportableLine[]>([]);
  const { loading, data, error } = useQuery<LinesData>(GET_LINES_FOR_EXPORT);

  useEffect(() => {
    if (data) {
      setLines([
        ...data?.lines.map(mapLine),
        ...data?.flexibleLines.map(mapLine),
      ]);
    }
  }, [data]);

  const isEverythingSelected = Object.values(lines).every(
    (value) => value.selected
  );

  const isNothingSelected = Object.values(lines).every(
    (value) => !value.selected
  );

  const isSomeSelected = !isEverythingSelected && !isNothingSelected;

  const handleAllOrNothingChange = () =>
    setLines((prev) =>
      prev.map((prevItem) =>
        isEverythingSelected
          ? { ...prevItem, selected: false }
          : { ...prevItem, selected: true }
      )
    );

  const handleRegularChange = (id: string) =>
    setLines((prev) =>
      prev.map((prevItem) =>
        prevItem.id === id
          ? { ...prevItem, selected: !prevItem.selected }
          : prevItem
      )
    );

  const {
    sortedData,
    getSortableHeaderProps,
    getSortableTableProps,
  } = useSortableData<ExportableLine>(lines);

  return (
    <Table spacing="small" {...getSortableTableProps}>
      <TableHead>
        <TableRow>
          <HeaderCell padding="checkbox">
            <Checkbox
              name="all"
              checked={isSomeSelected ? 'indeterminate' : isEverythingSelected}
              onChange={handleAllOrNothingChange}
            />
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'name' })
            }
          >
            Line
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'status' })
            }
          >
            Status
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'to' })
            }
          >
            Availability
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody style={{ verticalAlign: 'top' }}>
        {!loading &&
          !error &&
          sortedData.map((line: ExportableLine) => (
            <TableRow key={line.id}>
              <DataCell padding="checkbox" style={{ padding: '.5rem 1rem' }}>
                <Checkbox
                  name={line.id}
                  checked={line.selected}
                  onChange={() => handleRegularChange(line.id)}
                />
              </DataCell>
              <DataCell>
                <StrongText>{line.name}</StrongText>
                <br />
                <SmallText>{line.id}</SmallText>
              </DataCell>
              <DataCell status={line.status}>
                {mapStatusToText(line.status)}
              </DataCell>
              <DataCell>{`${line.from.toLocaleDateString()} - ${line.to.toLocaleDateString()}`}</DataCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
