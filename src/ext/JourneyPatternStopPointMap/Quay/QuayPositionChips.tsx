import { TagChip } from '@entur/chip';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from '../../../components/ConfirmDialog';

interface QuayPositionChipsProps {
  quayId: string;
  stopPointSequenceIndexes: number[];
  deleteStopPointCallback: (index: number) => void;
}

interface QuayDeleteDialogState {
  index: number | undefined;
}

const QuayPositionChips = ({
  quayId,
  stopPointSequenceIndexes,
  deleteStopPointCallback,
}: QuayPositionChipsProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [deleteDialogState, setDeleteDialogState] =
    useState<QuayDeleteDialogState>({ index: undefined });

  return (
    <section>
      <div style={{ textWrap: 'nowrap' }}>
        {formatMessage({
          id: `quayOrder`,
        })}
        :
      </div>
      <div style={{ display: 'flex', marginBottom: '0.3rem' }}>
        {stopPointSequenceIndexes.map((index) => (
          <TagChip
            key={'stop-point-sequence-index-chip-' + quayId + '-' + index}
            className={'stop-point-sequence-index-chip'}
            size={'small'}
            onClose={() => {
              setDeleteDialogState({ index });
            }}
          >
            {index + 1}
          </TagChip>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogState.index !== undefined}
        title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
        message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
        buttons={[
          <SecondaryButton
            key="no"
            onClick={() => setDeleteDialogState({ index: undefined })}
          >
            {formatMessage({ id: 'no' })}
          </SecondaryButton>,
          <SuccessButton
            key="yes"
            onClick={() => {
              if (deleteDialogState.index === undefined) {
                return;
              }
              const indexToDelete = deleteDialogState.index;
              setDeleteDialogState({ index: undefined });
              deleteStopPointCallback(indexToDelete);
            }}
          >
            {formatMessage({ id: 'yes' })}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogState({ index: undefined })}
      />
    </section>
  );
};

export default QuayPositionChips;
