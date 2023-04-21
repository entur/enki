import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import useUniqueKeys from 'hooks/useUniqueKeys';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { MixedFlexibleStopPointEditor } from './MixedFlexibleStopPointEditor';

export const MixedFlexibleStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
}: StopPointsEditorProps) => {
  const keys = useUniqueKeys(pointsInSequence);
  const { formatMessage } = useIntl();

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage({ id: 'editorStopPoints' })}</Heading3>
      <Paragraph>
        {formatMessage({ id: 'stopPointsInfoMixedFlexible' })}
      </Paragraph>
      <div className="stop-point-editor">
        {pointsInSequence.map((stopPoint, pointIndex) => (
          <MixedFlexibleStopPointEditor
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
        buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
      />
    </section>
  );
};
