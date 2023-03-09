import { Heading3, Paragraph } from '@entur/typography';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { StopPointsEditorProps } from '..';
import React, { useCallback } from 'react';
import StopPoint from 'model/StopPoint';
import { FlexibleAreasOnlyStopPointEditor } from './FlexibleAreasOnlyStopPointEditor';

export const FlexibleAreasOnlyStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  onPointsInSequenceChange,
}: StopPointsEditorProps) => {
  const { formatMessage } = useSelector(selectIntl);

  console.log('FlexibleAreasOnlyStopPointsEditor', {
    pointsInSequence,
  });

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
      <Heading3>{formatMessage('editorStopPointFlexibleAreaOnly')}</Heading3>
      <Paragraph>{formatMessage('stopPointsInfoFlexibleAreaOnly')}</Paragraph>
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
