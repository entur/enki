import { Tooltip } from 'react-leaflet';
import React, { MutableRefObject } from 'react';

interface QuayIndexTooltipProps {
  markerRef: MutableRefObject<any>;
  stopPointIndexes: number[];
  quayId: string;
}

const QuayIndexTooltip = ({
  markerRef,
  stopPointIndexes,
  quayId,
}: QuayIndexTooltipProps) => {
  return (
    <div
      // This wrapper is important as Tooltip itself doesn't accept onClick,
      // and directly applying flex screws up tooltip's look
      style={{
        display: 'flex',
      }}
      onClick={() => {
        markerRef.current.openPopup();
      }}
    >
      <Tooltip
        interactive={true}
        direction="right"
        offset={[10, -17]}
        opacity={1}
        permanent
      >
        {stopPointIndexes.map((index, i) => {
          const isLast = i == stopPointIndexes.length - 1;
          return (
            <span
              key={'tooltip-index-' + quayId + '-' + index}
              className={!isLast ? 'stop-point-index-tooltip-item' : ''}
            >
              {index + 1}
            </span>
          );
        })}
      </Tooltip>
    </div>
  );
};

export default QuayIndexTooltip;
