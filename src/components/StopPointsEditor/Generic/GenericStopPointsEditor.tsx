import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { selectIntl } from 'i18n';
import StopPoint from 'model/StopPoint';
import React from 'react';
import { useSelector } from 'react-redux';
import { StopPointsEditorProps } from '..';
import { GenericStopPointEditor } from './GenericStopPointEditor';

export const GenericStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
  flexibleLineType,
}: StopPointsEditorProps) => {
  const keys = useUniqueKeys(pointsInSequence);
  const { formatMessage } = useSelector(selectIntl);

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage('editorStopPoints')}</Heading3>
      <Paragraph>{formatMessage('stopPointsInfoFixed')}</Paragraph>
      <div className="stop-point-editor">
        {pointsInSequence.map((stopPoint, pointIndex) => (
          <GenericStopPointEditor
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
            flexibleLineType={flexibleLineType}
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
