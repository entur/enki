import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { PassingTimesEditorProps } from '..';
import { TimeWindowPassingTimeEditor } from '../TimeWindowPassingTimeEditor/TimeWindowPassingTimeEditor';

export const FlexibleAreasOnlyPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  return (
    <>
      <Heading4>Add FLEXIBLE_AREAS_ONLY header</Heading4>
      <Paragraph>Add FLEXIBLE_AREAS_ONLY description</Paragraph>
      <div className="passing-times-editor">
        <div className="passing-time">
          <TimeWindowPassingTimeEditor
            passingTime={passingTimes[0]}
            stopPoint={stopPoints[0]}
            onChange={(changedPassingTime) => {
              onChange([changedPassingTime, changedPassingTime]);
            }}
          />
        </div>
      </div>
    </>
  );
};
