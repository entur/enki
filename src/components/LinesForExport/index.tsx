import { useQuery } from '@apollo/client';
import { Checkbox } from '@entur/form';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  useSortableData,
} from '@entur/table';
import { SmallText, StrongText } from '@entur/typography';
import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import { differenceInCalendarDays, isAfter, isBefore } from 'date-fns';
import parseDate from 'date-fns/parseISO';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import { ExportLineAssociation } from 'model/Export';
import FlexibleLine from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import Line from 'model/Line';
import OperatingPeriod from 'model/OperatingPeriod';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  onChange: (lines: ExportLineAssociation[]) => void;
};

type LinesData = {
  lines: Line[];
  flexibleLines: FlexibleLine[];
};

type Status = 'negative' | 'positive' | 'neutral' | undefined;

type ExportableLine = {
  id: string;
  name: string;
  status: Status;
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

const mergeAvailability = (
  availability: Availability | undefined,
  operatingPeriod: OperatingPeriod
) => {
  const availabilityFromOperatingPeriod = {
    from: parseDate(operatingPeriod.fromDate),
    to: parseDate(operatingPeriod.toDate),
  };

  return availability
    ? union(availability, availabilityFromOperatingPeriod)
    : availabilityFromOperatingPeriod;
};

const getAvailability = (journeyPatterns?: JourneyPattern[]): Availability => {
  let availability: Availability | undefined = undefined;

  journeyPatterns?.forEach((jp) =>
    jp.serviceJourneys.forEach((sj) =>
      sj.dayTypes?.forEach((dt) =>
        dt.dayTypeAssignments.forEach(
          (dta) =>
            (availability = mergeAvailability(
              availability,
              dta.operatingPeriod
            ))
        )
      )
    )
  );

  if (!availability) {
    throw new Error('Unable to calculate availability for line');
  }

  return availability;
};

const mapLine = ({ id, name, journeyPatterns }: Line): ExportableLine => {
  const today = new Date();
  const jpAvailability = getAvailability(journeyPatterns);
  const availableForDaysFromNow = differenceInCalendarDays(
    jpAvailability.to,
    today
  );

  let status: Status;

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
    ...jpAvailability,
    selected: true,
  };
};

const mapStatusToText = (status: Status): string => {
  if (status === 'positive') {
    return 'Available next 120 days';
  } else if (status === 'neutral') {
    return 'Becomes unavailable in less than 120 days';
  } else {
    return 'No longer available';
  }
};

export default ({ onChange }: Props) => {
  const [lines, setLines] = useState<ExportableLine[]>([]);
  const { loading, data, error, refetch } =
    useQuery<LinesData>(GET_LINES_FOR_EXPORT);

  useRefetchOnLocationChange(refetch);

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (data) {
      setLines([
        ...data?.lines.map(mapLine),
        ...data?.flexibleLines.map(mapLine),
      ]);
    }
  }, [data]);

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

  const { sortedData, getSortableHeaderProps, getSortableTableProps } =
    useSortableData<ExportableLine>(lines);

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
            {formatMessage({
              id: 'exportCreatorLinesForExportTableLineHeader',
            })}
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'status' })
            }
          >
            {formatMessage({
              id: 'exportCreatorLinesForExportTableStatusHeader',
            })}
          </HeaderCell>
          <HeaderCell
            {
              // @ts-ignore
              ...getSortableHeaderProps({ name: 'to' })
            }
          >
            {formatMessage({
              id: 'exportCreatorLinesForExportTableAvailabilityHeader',
            })}
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
