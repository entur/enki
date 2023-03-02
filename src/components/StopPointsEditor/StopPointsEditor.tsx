import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import { useStopPointEditor } from 'components/StopPointEditor';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { selectIntl } from 'i18n';
import { FlexibleLineType } from 'model/FlexibleLine';
import StopPoint from 'model/StopPoint';
import React from 'react';
import { useSelector } from 'react-redux';

export type StopPointsEditorProps = {
  flexibleLineType?: FlexibleLineType | undefined;
  pointsInSequence: StopPoint[];
  spoilPristine: boolean;
  updateStopPoint: (index: number, stopPoint: StopPoint) => void;
  deleteStopPoint: (index: number) => void;
  addStopPoint: () => void;
};

export const StopPointsEditor = ({
  flexibleLineType,
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
}: StopPointsEditorProps) => {
  const keys = useUniqueKeys(pointsInSequence);
  const StopPointEditor = useStopPointEditor(flexibleLineType);
  const { formatMessage } = useSelector(selectIntl);

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage('editorStopPoints')}</Heading3>
      <Paragraph>
        {flexibleLineType
          ? formatMessage('stopPointsInfo')
          : formatMessage('stopPointsInfoFixed')}
      </Paragraph>
      <div className="stop-point-editor">
        {pointsInSequence.map((stopPoint, pointIndex) => (
          <StopPointEditor
            key={keys[pointIndex]}
            order={pointIndex + 1}
            stopPoint={stopPoint}
            spoilPristine={spoilPristine}
            isFirst={pointIndex === 0}
            isLast={pointIndex === pointsInSequence.length - 1}
            onChange={(updatedStopPoint: StopPoint) =>
              updateStopPoint(pointIndex, updatedStopPoint)
            }
            onDelete={() => deleteStopPoint(pointIndex)}
            canDelete={pointsInSequence.length > 2}
          />
        ))}
      </div>
      <AddButton
        onClick={addStopPoint}
        buttonTitle={formatMessage('editorAddStopPoint')}
      />
    </section>
  );
};
