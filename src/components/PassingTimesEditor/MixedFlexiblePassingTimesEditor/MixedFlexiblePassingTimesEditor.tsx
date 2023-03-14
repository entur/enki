import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { useIntl } from 'i18n';
import { PassingTimesEditorProps } from '..';
import { changeElementAtIndex } from 'helpers/arrays';
import { MixedFlexiblePassingTimeEditor } from './MixedFlexiblePassingTimeEditor';

export const MixedFlexiblePassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Heading4>Add MIXED_FLEXIBLE header</Heading4>
      <Paragraph>Add MIXED_FLEXIBLE description</Paragraph>
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={index} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <MixedFlexiblePassingTimeEditor
              passingTime={passingTime}
              stopPoint={stopPoints[index]}
              index={index}
              isLast={index === stopPoints.length - 1}
              onChange={(changedPassingTime) => {
                onChange(
                  changeElementAtIndex(passingTimes, changedPassingTime, index)
                );
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
