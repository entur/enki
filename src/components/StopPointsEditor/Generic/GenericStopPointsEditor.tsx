import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import useUniqueKeys from 'hooks/useUniqueKeys';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage({ id: 'editorStopPoints' })}</Heading3>
      <Paragraph>{formatMessage({ id: 'stopPointsInfoFixed' })}</Paragraph>
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
        buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
      />
    </section>
  );
};
