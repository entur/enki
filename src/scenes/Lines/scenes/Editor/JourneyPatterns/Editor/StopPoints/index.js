import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
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

const StopPointsEditor = ({ stopPoints, onChange }) => {
  const [stopPointInDialog, setStopPointInDialog] = useState(null);
  const [stopPointIndexInDialog, setStopPointIndexInDialog] = useState(
    TEMP_INDEX
  );
  const { formatMessage } = useSelector(selectIntl);

  const updateStopPoint = (index, stopPlace) => {
    onChange(replaceElement(stopPoints, index, stopPlace));
  };

  const deleteStopPlace = index => {
    const copy = stopPoints.slice();
    copy.splice(index, 1);
    onChange(copy);
  };

  const openDialogForStopPoint = index => {
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
      <SecondaryButton onClick={() => setStopPointInDialog(new StopPoint())}>
        <AddIcon />
        {formatMessage(messages.addStopPoint)}
      </SecondaryButton>
      <BannerAlertBox
        style={{ marginTop: '0.5rem' }}
        variant="info"
        title={formatMessage(messages.atleastTwoPoints)}
      >
        {formatMessage(messages.atleastTwoPointsDetailed)}
      </BannerAlertBox>
      <StopPointsTable
        stopPoints={stopPoints}
        onRowClick={openDialogForStopPoint.bind(this)}
        onDeleteClick={deleteStopPlace.bind(this)}
      />

      {stopPointInDialog !== null && (
        <Dialog
          isOpen={true}
          content={
            <StopPointEditor
              isFirst={stopPoints.length === 0 || stopPointIndexInDialog === 0}
              stopPoint={stopPointInDialog}
              onChange={stopPointInDialog =>
                this.setState({ stopPointInDialog })
              }
              onClose={closeStopPointDialog}
              onSave={handleOnStopPointDialogSaveClick.bind(this)}
              isEditMode={stopPointIndexInDialog !== TEMP_INDEX}
            />
          }
          onClose={closeStopPointDialog}
        />
      )}
    </div>
  );
};

StopPointsEditor.propTypes = {
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired
};

export default StopPointsEditor;
