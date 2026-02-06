import { useQuery } from '@apollo/client/react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import { ExportLineAssociation } from 'model/Export';
import FlexibleLine from 'model/FlexibleLine';
import Line from 'model/Line';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { getCurrentDate, CalendarDate } from '../../utils/dates';
import { getLocale } from 'i18n/getLocale';
import {
  AvailabilityStatus,
  calculateLineAvailability,
  mapStatusToText,
} from 'helpers/availability';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';

type Props = {
  onChange: (lines: ExportLineAssociation[]) => void;
};

type LinesData = {
  lines: Line[];
  flexibleLines: FlexibleLine[];
};

type Status = AvailabilityStatus | undefined;

type ExportableLine = {
  id: string;
  name: string;
  status: Status;
  from: CalendarDate;
  to: CalendarDate;
  selected: boolean;
};

const mapLine = ({ id, name, journeyPatterns }: Line): ExportableLine => {
  try {
    const { availability, status } = calculateLineAvailability(journeyPatterns);
    return {
      id: id!,
      name: name!,
      status,
      ...availability,
      selected: status !== 'negative',
    };
  } catch {
    // Handle lines without valid availability
    return {
      id: id!,
      name: name!,
      status: 'negative',
      from: getCurrentDate(),
      to: getCurrentDate(),
      selected: false,
    };
  }
};

const mapStatusToTextWithUndefined = (status: Status): string => {
  if (!status) return 'Unknown';
  return mapStatusToText(status);
};

type SortKey = 'name' | 'status' | 'to';
type SortDirection = 'asc' | 'desc';

export default ({ onChange }: Props) => {
  const [lines, setLines] = useState<ExportableLine[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { loading, data, error, refetch } =
    useQuery<LinesData>(GET_LINES_FOR_EXPORT);

  useRefetchOnLocationChange(refetch);

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (data) {
      setLines([
        ...data.lines.map(mapLine),
        ...data.flexibleLines.map(mapLine),
      ]);
    }
  }, [data]);

  useEffect(() => {
    onChange(
      lines
        .filter((line) => line.selected)
        .map(({ id }) => ({
          lineRef: id,
        })),
    );
    // eslint-disable-next-line
  }, [lines]);

  const sortedData = useMemo(() => {
    if (!sortKey) return lines;
    const key = sortKey;
    const sorted = [...lines].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [lines, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const isSorted = (key: SortKey) => sortKey === key;

  const selectableLines = lines.filter((line) => line.status !== 'negative');

  const isEverythingSelected =
    selectableLines.length > 0 &&
    selectableLines.every((line) => line.selected);

  const isNothingSelected = selectableLines.every((line) => !line.selected);

  const isSomeSelected = !isEverythingSelected && !isNothingSelected;

  const handleAllOrNothingChange = () => {
    setLines((prev) =>
      prev.map((prevItem) =>
        isEverythingSelected
          ? { ...prevItem, selected: false }
          : {
              ...prevItem,
              selected: prevItem.status !== 'negative',
            },
      ),
    );
  };

  const handleRegularChange = (id: string) => {
    setLines((prev) =>
      prev.map((prevItem) =>
        prevItem.id === id
          ? {
              ...prevItem,
              selected:
                prevItem.status === 'negative' ? false : !prevItem.selected,
            }
          : prevItem,
      ),
    );
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              name="all"
              checked={isEverythingSelected}
              indeterminate={isSomeSelected}
              onChange={handleAllOrNothingChange}
            />
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={isSorted('name')}
              direction={isSorted('name') ? sortDirection : 'asc'}
              onClick={() => handleSort('name')}
            >
              {formatMessage({
                id: 'exportCreatorLinesForExportTableLineHeader',
              })}
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={isSorted('status')}
              direction={isSorted('status') ? sortDirection : 'asc'}
              onClick={() => handleSort('status')}
            >
              {formatMessage({
                id: 'exportCreatorLinesForExportTableStatusHeader',
              })}
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={isSorted('to')}
              direction={isSorted('to') ? sortDirection : 'asc'}
              onClick={() => handleSort('to')}
            >
              {formatMessage({
                id: 'exportCreatorLinesForExportTableAvailabilityHeader',
              })}
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody style={{ verticalAlign: 'top' }}>
        {!loading &&
          !error &&
          sortedData.map((line: ExportableLine) => (
            <TableRow
              key={line.id}
              style={{
                opacity: line.status === 'negative' ? 0.5 : 1,
                color: line.status === 'negative' ? '#888' : 'inherit',
              }}
            >
              <TableCell padding="checkbox" style={{ padding: '.5rem 1rem' }}>
                <Checkbox
                  name={line.id}
                  checked={line.selected}
                  disabled={line.status === 'negative'}
                  onChange={() => handleRegularChange(line.id)}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  component="strong"
                  fontWeight="bold"
                  style={{
                    color: line.status === 'negative' ? '#888' : 'inherit',
                  }}
                >
                  {line.name}
                </Typography>
                <br />
                <Typography
                  variant="caption"
                  component="span"
                  style={{
                    color: line.status === 'negative' ? '#888' : 'inherit',
                  }}
                >
                  {line.id}
                </Typography>
              </TableCell>
              <TableCell>{mapStatusToTextWithUndefined(line.status)}</TableCell>
              <TableCell>{`${new DateFormatter(getLocale().toString()).format(line.from.toDate(getLocalTimeZone()))} - ${new DateFormatter(getLocale().toString()).format(line.to.toDate(getLocalTimeZone()))}`}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
