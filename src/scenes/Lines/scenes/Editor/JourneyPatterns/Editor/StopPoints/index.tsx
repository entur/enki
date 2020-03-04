import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { BannerAlertBox } from '@entur/alert';
import { SecondaryButton } from '@entur/button';
import { StopPoint } from 'model';
import { replaceElement } from 'helpers/arrays';
import { ExpandablePanel } from '@entur/expand';
import StopPointEditor from './Editor';
import messages from '../messages';

type Props = {
  stopPoints: StopPoint[];
  deleteStopPoint: (index: number) => void;
  onChange: (stopPoints: StopPoint[]) => void;
  setIsValidStopPoints: (isValid: boolean) => void;
};

const StopPointsEditor = ({
  stopPoints,
  deleteStopPoint,
  onChange,
  setIsValidStopPoints
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateStopPoint = (index: number, stopPlace: StopPoint) => {
    onChange(replaceElement(stopPoints, index, stopPlace));
  };

  return (
    <div className="stop-points-editor">
      {stopPoints.length < 2 && (
        <BannerAlertBox
          style={{ margin: '0.5rem 0' }}
          variant="info"
          title={formatMessage(messages.atleastTwoPoints)}
        >
          {formatMessage(messages.atleastTwoPointsDetailed)}
        </BannerAlertBox>
      )}

      {stopPoints.map((stopPoint, index) => (
        <ExpandablePanel
          key={stopPoint.id}
          title={stopPoint.destinationDisplay?.frontText}
        >
          <StopPointEditor
            isFirst={index === 0}
            stopPoint={stopPoint}
            deleteStopPoint={() => deleteStopPoint(index)}
            onChange={(stopPoint: StopPoint) =>
              updateStopPoint(index, stopPoint)
            }
            setIsValidStopPoints={setIsValidStopPoints}
          />
        </ExpandablePanel>
      ))}

      <SecondaryButton
        onClick={() => onChange(stopPoints.concat(new StopPoint()))}
        style={{ margin: '2rem 0' }}
      >
        <AddIcon />
        {formatMessage(messages.addStopPoint)}
      </SecondaryButton>
    </div>
  );
};

export default StopPointsEditor;
