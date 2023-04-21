import { Heading3, Paragraph } from '@entur/typography';
import StopPoint from 'model/StopPoint';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { FlexibleAreasOnlyStopPointEditor } from './FlexibleAreasOnlyStopPointEditor';

export const FlexibleAreasOnlyStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  onPointsInSequenceChange,
}: StopPointsEditorProps) => {
  const { formatMessage } = useIntl();

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
    [onPointsInSequenceChange]
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
        <FlexibleAreasOnlyStopPointEditor
          stopPoint={pointsInSequence[0]}
          spoilPristine={spoilPristine}
          onChange={onStopPointUpdate}
        />
      </div>
    </section>
  );
};
