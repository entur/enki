import { Box, IconButton, Typography } from '@mui/material';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import React from 'react';

export type StopPointOrder = {
  order: number;
  isFirst: boolean;
  isLast: boolean;
  swapStopPoints: (position1: number, position2: number) => void;
};

const StopPointOrder = ({
  order,
  isFirst,
  isLast,
  swapStopPoints,
}: StopPointOrder) => {
  return (
    <Box
      className="order"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 40,
      }}
    >
      {!isFirst && (
        <IconButton
          onClick={() => swapStopPoints(order - 2, order - 1)}
          className={'move-up'}
          size={'small'}
        >
          <ArrowUpward />
        </IconButton>
      )}
      <Typography variant="body1">{order}</Typography>
      {!isLast && (
        <IconButton
          onClick={() => swapStopPoints(order - 1, order)}
          className={'move-down'}
          size={'small'}
        >
          <ArrowDownward />
        </IconButton>
      )}
    </Box>
  );
};

export default StopPointOrder;
