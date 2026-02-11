import { Button, Chip } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
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
      <div style={{ textWrap: 'nowrap', marginBottom: '0.15rem' }}>
        {formatMessage({
          id: `quayOrder`,
        })}
        :
      </div>
      <div style={{ display: 'flex', marginBottom: '0.3rem' }}>
        {stopPointSequenceIndexes.map((index) => (
          <Chip
            key={'stop-point-sequence-index-chip-' + quayId + '-' + index}
            className={'stop-point-sequence-index-chip'}
            size="small"
            label={index + 1}
            onDelete={() => {
              setDeleteDialogState({ index });
            }}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogState.index !== undefined}
        title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
        message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
        buttons={[
          <Button
            key="no"
            variant="outlined"
            onClick={() => setDeleteDialogState({ index: undefined })}
          >
            {formatMessage({ id: 'no' })}
          </Button>,
          <Button
            key="yes"
            variant="contained"
            color="success"
            onClick={() => {
              if (deleteDialogState.index === undefined) {
                return;
              }
              const indexToDelete = deleteDialogState.index;
              setDeleteDialogState({ index: undefined });
              deleteStopPointCallback(indexToDelete);
              // To avoid grey area on the map once the container gets bigger in the height:
              window.dispatchEvent(new Event('resize'));
            }}
          >
            {formatMessage({ id: 'yes' })}
          </Button>,
        ]}
        onDismiss={() => setDeleteDialogState({ index: undefined })}
      />
    </section>
  );
};

export default QuayPositionChips;
