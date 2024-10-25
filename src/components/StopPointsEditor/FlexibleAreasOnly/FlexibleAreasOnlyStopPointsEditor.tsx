import { Heading3, Paragraph } from '@entur/typography';
import StopPoint from 'model/StopPoint';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { FlexibleAreasOnlyStopPointEditor } from './FlexibleAreasOnlyStopPointEditor';

export const FlexibleAreasOnlyStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  onPointsInSequenceChange,
  initDefaultJourneyPattern,
}: StopPointsEditorProps) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (pointsInSequence?.length === 0) {
      initDefaultJourneyPattern();
    }
  }, []);

  const onStopPointUpdate = useCallback(
    (updatedStopPoint: StopPoint) => {
      onPointsInSequenceChange([
        {
          ...updatedStopPoint,
          forAlighting: false,
          forBoarding: true,
        },
        {
          ...updatedStopPoint,
          forAlighting: true,
          forBoarding: false,
          destinationDisplay: undefined,
        },
      ]);
    },
    [onPointsInSequenceChange],
  );

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>
        {formatMessage({ id: 'editorStopPointFlexibleAreaOnly' })}
      </Heading3>
      <Paragraph>
        {formatMessage({ id: 'stopPointsInfoFlexibleAreaOnly' })}
      </Paragraph>
      <div className="stop-point-editor">
        {pointsInSequence[0] && (
          <FlexibleAreasOnlyStopPointEditor
            stopPoint={pointsInSequence[0]}
            spoilPristine={spoilPristine}
            onChange={onStopPointUpdate}
          />
        )}
      </div>
    </section>
  );
};
