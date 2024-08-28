import { TagChip } from '@entur/chip';
import React from 'react';
import { useIntl } from 'react-intl';

interface QuayPositionChipsProps {
  stopPointIndexes: number[];
  deleteStopPointCallback: (index: number) => void;
}

const QuayPositionChips = ({
  stopPointIndexes,
  deleteStopPointCallback,
}: QuayPositionChipsProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <section>
      <div>
        {formatMessage({
          id: `quayPosition${stopPointIndexes?.length > 1 ? 's' : ''}`,
        })}
        :
      </div>
      <div style={{ display: 'flex', marginBottom: '0.3rem' }}>
        {stopPointIndexes.map((index) => (
          <TagChip
            className={'stop-point-index-chip'}
            size={'small'}
            onClose={() => {
              deleteStopPointCallback(index);
            }}
          >
            {index + 1}
          </TagChip>
        ))}
      </div>
    </section>
  );
};

export default QuayPositionChips;
