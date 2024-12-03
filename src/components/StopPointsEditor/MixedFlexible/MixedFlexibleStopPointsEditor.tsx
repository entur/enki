import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import useUniqueKeys from 'hooks/useUniqueKeys';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { MixedFlexibleStopPointEditor } from './MixedFlexibleStopPointEditor';
import { useEffect, useState } from 'react';

export const MixedFlexibleStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
  initDefaultJourneyPattern,
  swapStopPoints,
}: StopPointsEditorProps) => {
  const keys = useUniqueKeys(pointsInSequence);
  const { formatMessage } = useIntl();
  const [cleanedPointsInSequence, setCleanedPointsInSequence] = useState<
    StopPoint[]
  >([]);

  useEffect(() => {
    if (pointsInSequence?.length === 0) {
      initDefaultJourneyPattern();
    }
  }, []);

  /**
   * Clean-up so that a nsr kind of stop point doesn't contain keys related to flexible one,
   * and a flexible stop point doesn't contain quayRef key related to nsr one.
   * Things need to be cleaned up, so if the stop point reordering happens everything would be okay.
   * Otherwise, would be problems when either swapping empty stop points or changin the mode between nsr-flexible
   */
  useEffect(() => {
    const newPointsInSequence: StopPoint[] = [];
    pointsInSequence.forEach((stopPoint, i) => {
      const stopPointObjectKeys = Object.keys(stopPoint);
      const newStopPoint = {
        ...stopPoint,
      };
      if (
        stopPointObjectKeys.includes('quayRef') &&
        stopPointObjectKeys.includes('flexibleStopPlaceRef')
      ) {
        // Case most likely to occur when opening existing line for the first time
        if (stopPoint.quayRef) {
          delete newStopPoint['flexibleStopPlaceRef'];
          delete newStopPoint['flexibleStopPlace'];
        } else {
          delete newStopPoint['quayRef'];
        }
      } else if (Object.keys(stopPoint).length === 1) {
        // completely newly created one, time to set some things that will be useful later if it gets reordered
        newStopPoint['flexibleStopPlaceRef'] = null;
        newStopPoint['flexibleStopPlace'] = undefined;
      }
      newPointsInSequence.push(newStopPoint);
    });
    setCleanedPointsInSequence(newPointsInSequence);
  }, [pointsInSequence]);

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage({ id: 'editorStopPoints' })}</Heading3>
      <Paragraph>
        {formatMessage({ id: 'stopPointsInfoMixedFlexible' })}
      </Paragraph>
      <div className="stop-point-editor">
        {cleanedPointsInSequence.map((stopPoint, pointIndex) => (
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
            swapStopPoints={swapStopPoints}
          />
        ))}
      </div>
      <AddButton
        onClick={() => addStopPoint()}
        buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
      />
    </section>
  );
};
