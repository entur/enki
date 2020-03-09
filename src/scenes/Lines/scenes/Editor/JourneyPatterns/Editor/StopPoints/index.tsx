import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { StopPoint } from 'model';
import { replaceElement } from 'helpers/arrays';
import { ExpandablePanel } from '@entur/expand';
import validateForm from './Editor/validateForm';
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
      {stopPoints.map((stopPoint, index) => {
        const [isValid] = validateForm(stopPoint, index === 0);
        return (
          <ExpandablePanel
            key={stopPoint.id}
            title={stopPoint.destinationDisplay?.frontText}
            defaultOpen={!isValid}
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
        );
      })}

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
