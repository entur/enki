import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { BannerAlertBox } from '@entur/alert';
import { SecondaryButton } from '@entur/button';
import { StopPoint } from 'model';
import { replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import StopPointsTable from './Table';
import StopPointEditor from './Editor';
import messages from '../messages';

const TEMP_INDEX = -1;

type Props = {
  stopPoints: any[];
  deleteStopPoint: (index: number) => void;
  onChange: (stopPoints: any) => void;
};

const StopPointsEditor = ({ stopPoints, deleteStopPoint, onChange }: Props) => {
  const [stopPointInDialog, setStopPointInDialog] = useState<any | null>(null);
  const [stopPointIndexInDialog, setStopPointIndexInDialog] = useState(
    TEMP_INDEX
  );
  const { formatMessage } = useSelector(selectIntl);

  const updateStopPoint = (index: number, stopPlace: any) => {
    onChange(replaceElement(stopPoints, index, stopPlace));
  };

  const openDialogForStopPoint = (index: number) => {
    setStopPointInDialog(stopPoints[index]);
    setStopPointIndexInDialog(index);
  };

  const closeStopPointDialog = () => {
    setStopPointInDialog(null);
    setStopPointIndexInDialog(TEMP_INDEX);
  };

  const handleOnStopPointDialogSaveClick = () => {
    if (stopPointIndexInDialog === TEMP_INDEX) {
      onChange(stopPoints.concat(stopPointInDialog));
    } else {
      updateStopPoint(stopPointIndexInDialog, stopPointInDialog);
    }
    setStopPointInDialog(null);
    setStopPointIndexInDialog(TEMP_INDEX);
  };

  return (
    <div className="stop-points-editor">
      <BannerAlertBox
        style={{ marginTop: '0.5rem' }}
        variant="info"
        title={formatMessage(messages.atleastTwoPoints)}
      >
        {formatMessage(messages.atleastTwoPointsDetailed)}
      </BannerAlertBox>
      <StopPointsTable
        stopPoints={stopPoints}
        onRowClick={openDialogForStopPoint}
        onDeleteClick={deleteStopPoint}
      />

      <SecondaryButton
        onClick={() => setStopPointInDialog(new StopPoint())}
        style={{ margin: '2rem 0' }}
      >
        <AddIcon />
        {formatMessage(messages.addStopPoint)}
      </SecondaryButton>

      {stopPointInDialog !== null && (
        <Dialog
          isOpen={true}
          content={
            <StopPointEditor
              isFirst={stopPoints.length === 0 || stopPointIndexInDialog === 0}
              stopPoint={stopPointInDialog}
              onChange={(stopPointInDialog: number) =>
                setStopPointInDialog(stopPointInDialog)
              }
              onClose={closeStopPointDialog}
              onSave={handleOnStopPointDialogSaveClick}
              isEditMode={stopPointIndexInDialog !== TEMP_INDEX}
            />
          }
          onClose={closeStopPointDialog}
        />
      )}
    </div>
  );
};

export default StopPointsEditor;
