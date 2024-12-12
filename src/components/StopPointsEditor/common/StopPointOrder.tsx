import { IconButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import { Paragraph } from '@entur/typography';
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
    <div className={'order'}>
      {!isFirst && (
        <IconButton
          onClick={() => swapStopPoints(order - 2, order - 1)}
          className={'move-up'}
          size={'small'}
        >
          <BackArrowIcon />
        </IconButton>
      )}
      <Paragraph>{order}</Paragraph>
      {!isLast && (
        <IconButton
          onClick={() => swapStopPoints(order - 1, order)}
          className={'move-down'}
          size={'small'}
        >
          <BackArrowIcon />
        </IconButton>
      )}
    </div>
  );
};

export default StopPointOrder;
