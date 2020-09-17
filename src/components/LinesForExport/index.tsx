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
  selected: boolean;
};

const mapLine = ({ id, name }: Line): ExportableLine => ({
  id: id!,
  name: name!,
  selected: false,
});

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
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Availability</HeaderCell>
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
              <DataCell status="positive">Available next 120 days</DataCell>
              <DataCell>01.01.2020 - 31.12.2020</DataCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
