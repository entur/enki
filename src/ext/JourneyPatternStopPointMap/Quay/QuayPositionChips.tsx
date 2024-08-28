import { TagChip } from '@entur/chip';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from '../../../components/ConfirmDialog';

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
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
          <>
            <TagChip
              className={'stop-point-index-chip'}
              size={'small'}
              onClose={() => {
                setDeleteDialogOpen(true);
              }}
            >
              {index + 1}
            </TagChip>
            <ConfirmDialog
              isOpen={isDeleteDialogOpen}
              title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
              message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
              buttons={[
                <SecondaryButton
                  key="no"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  {formatMessage({ id: 'no' })}
                </SecondaryButton>,
                <SuccessButton
                  key="yes"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    deleteStopPointCallback(index);
                  }}
                >
                  {formatMessage({ id: 'yes' })}
                </SuccessButton>,
              ]}
              onDismiss={() => setDeleteDialogOpen(false)}
            />
          </>
        ))}
      </div>
    </section>
  );
};

export default QuayPositionChips;
