import { useQuery } from '@apollo/client/react';
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
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import { ExportLineAssociation } from 'model/Export';
import FlexibleLine from 'model/FlexibleLine';
import Line from 'model/Line';
import { useEffect, useState } from 'react';
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
        })),
    );
    // eslint-disable-next-line
  }, [lines]);

  const { sortedData, getSortableHeaderProps, getSortableTableProps } =
    useSortableData<ExportableLine>(lines);

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
            <TableRow
              key={line.id}
              style={{
                opacity: line.status === 'negative' ? 0.5 : 1,
                color: line.status === 'negative' ? '#888' : 'inherit',
              }}
            >
              <DataCell padding="checkbox" style={{ padding: '.5rem 1rem' }}>
                <Checkbox
                  name={line.id}
                  checked={line.selected}
                  disabled={line.status === 'negative'}
                  onChange={() => handleRegularChange(line.id)}
                />
              </DataCell>
              <DataCell>
                <StrongText
                  style={{
                    color: line.status === 'negative' ? '#888' : 'inherit',
                  }}
                >
                  {line.name}
                </StrongText>
                <br />
                <SmallText
                  style={{
                    color: line.status === 'negative' ? '#888' : 'inherit',
                  }}
                >
                  {line.id}
                </SmallText>
              </DataCell>
              <DataCell status={line.status}>
                {mapStatusToTextWithUndefined(line.status)}
              </DataCell>
              <DataCell>{`${new DateFormatter(getLocale().toString()).format(line.from.toDate(getLocalTimeZone()))} - ${new DateFormatter(getLocale().toString()).format(line.to.toDate(getLocalTimeZone()))}`}</DataCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
