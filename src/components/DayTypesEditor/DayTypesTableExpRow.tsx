import {
  DataCell,
  ExpandableRow,
  ExpandRowButton,
  TableRow,
} from '@entur/table';
import DayType from 'model/DayType';
import React, { useState } from 'react';

export const DayTypesTableExpRow = ({
  dayType,
  numberOfServiceJourneys,
  children,
}: {
  dayType: DayType;
  numberOfServiceJourneys: number;
  children: any;
}) => {
  const [open, setopen] = useState(false);

  return (
    <>
      <TableRow>
        <DataCell>
          <ExpandRowButton onClick={() => setopen(!open)} open={open} />
        </DataCell>
        <DataCell>{dayType.id}</DataCell>
        <DataCell>{dayType.name || 'No name'}</DataCell>
        <DataCell>{numberOfServiceJourneys}</DataCell>
      </TableRow>
      <ExpandableRow colSpan={3} open={open}>
        {children}
      </ExpandableRow>
    </>
  );
};
