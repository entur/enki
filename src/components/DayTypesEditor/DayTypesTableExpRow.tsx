import {
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import DayType from 'model/DayType';
import React, { useState } from 'react';

export const DayTypesTableExpRow = ({
  dayType,
  selected,
  onSelect,
  numberOfServiceJourneys,
  children,
  openInitial = false,
}: {
  dayType: DayType;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  numberOfServiceJourneys: number;
  children: any;
  openInitial?: boolean;
}) => {
  const [open, setopen] = useState(openInitial);

  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            name={dayType.name}
            checked={selected}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onSelect(event.target.checked)
            }
          />
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => setopen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{dayType.id}</TableCell>
        <TableCell>{dayType.name || 'No name'}</TableCell>
        <TableCell>{numberOfServiceJourneys}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
