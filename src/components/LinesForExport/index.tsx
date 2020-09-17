import React from 'react';
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

interface LinesData {
  lines: Line[];
  flexibleLines: FlexibleLine[];
}

export default (props: Props) => {
  const { loading, data, error } = useQuery<LinesData>(GET_LINES_FOR_EXPORT);

  const lines: Line[] = [
    ...(data ? data?.lines : []),
    ...(data ? data?.flexibleLines : []),
  ];

  const {
    sortedData,
    getSortableHeaderProps,
    getSortableTableProps,
  } = useSortableData<Line>(lines);

  return (
    <Table spacing="small" {...getSortableTableProps}>
      <TableHead>
        <TableRow>
          <HeaderCell padding="checkbox">
            <Checkbox name="all" checked="indeterminate" onChange={() => {}} />
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
          sortedData.map((line: Line) => (
            <TableRow key={line.id}>
              <DataCell padding="checkbox">
                <Checkbox name={line.id} checked={false} onChange={() => {}} />
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
