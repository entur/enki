import React, { useState, useEffect, useMemo } from 'react';
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
import { useQuery } from '@apollo/client';
import FlexibleLine from 'model/FlexibleLine';
import Line from 'model/Line';
import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import { SmallText, StrongText } from '@entur/typography';
import JourneyPattern from 'model/JourneyPattern';
import parseDate from 'date-fns/parseISO';
import {
  isBefore,
  differenceInCalendarDays,
  areIntervalsOverlapping,
  parseISO,
} from 'date-fns';
import { isAfter } from 'date-fns/esm';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import { ExportLineAssociation } from 'model/Export';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

type Props = {
  fromDate: string;
  toDate: string;
  onChange: (lines: ExportLineAssociation[]) => void;
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
  enable: boolean;
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

const mapLine = (
  { id, name, journeyPatterns }: Line,
  availability: Availability
): ExportableLine => {
  const today = new Date();
  const jpAvailability = getAvailability(journeyPatterns);
  const availableForDaysFromNow = differenceInCalendarDays(
    jpAvailability.to,
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

  const enable = areIntervalsOverlapping(
    { start: jpAvailability.from, end: jpAvailability.to },
    { start: availability.from, end: availability.to }
  );

  return {
    id: id!,
    name: name!,
    status,
    ...jpAvailability,
    enable,
    selected: enable,
  };
};

const mapStatusToText = (status: string): string => {
  if (status === 'positive') {
    return 'Available next 120 days';
  } else if (status === 'neutral') {
    return 'Becomes unavailable in less than 120 days';
  } else {
    return 'No longer available';
  }
};

export default ({ fromDate, toDate, onChange }: Props) => {
  const availability = useMemo(
    () => ({
      from: parseISO(fromDate),
      to: parseISO(toDate),
    }),
    [fromDate, toDate]
  );
  const [lines, setLines] = useState<ExportableLine[]>([]);
  const { loading, data, error, refetch } = useQuery<LinesData>(
    GET_LINES_FOR_EXPORT
  );

  useRefetchOnLocationChange(refetch);

  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    if (data) {
      setLines([
        ...data?.lines.map((line) => mapLine(line, availability)),
        ...data?.flexibleLines.map((line) => mapLine(line, availability)),
      ]);
    }
  }, [data, availability]);

  useEffect(() => {
    onChange(
      lines
        .filter((line) => line.selected)
        .map(({ id }) => ({
          lineRef: id,
        }))
    );
    // eslint-disable-next-line
  }, [lines]);

  const {
    sortedData,
    getSortableHeaderProps,
    getSortableTableProps,
  } = useSortableData<ExportableLine>(lines);

  const isEverythingSelected = Object.values(lines).every(
    (value) => value.selected
  );

  const isNothingSelected = Object.values(lines).every(
    (value) => !value.selected
  );

  const isSomeSelected = !isEverythingSelected && !isNothingSelected;

  const handleAllOrNothingChange = () => {
    setLines((prev) =>
      prev.map((prevItem) =>
        isEverythingSelected
          ? { ...prevItem, selected: false }
          : { ...prevItem, selected: true }
      )
    );
  };

  const handleRegularChange = (id: string) => {
    setLines((prev) =>
      prev.map((prevItem) =>
        prevItem.id === id
          ? { ...prevItem, selected: !prevItem.selected }
          : prevItem
      )
    );
  };

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
            {formatMessage('exportCreatorLinesForExportTableLineHeader')}
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'status' })
            }
          >
            {formatMessage('exportCreatorLinesForExportTableStatusHeader')}
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'to' })
            }
          >
            {formatMessage(
              'exportCreatorLinesForExportTableAvailabilityHeader'
            )}
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
                  disabled={!line.enable}
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
