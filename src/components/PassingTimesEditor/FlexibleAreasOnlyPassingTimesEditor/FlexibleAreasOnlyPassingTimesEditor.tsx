import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { useIntl } from 'i18n';
import { PassingTimesEditorProps } from '..';
import { FlexibleAreasOnlyPassingTimeEditor } from './FlexibleAreasOnlyPassingTimeEditor';
import PassingTimeTitle from './PassingTimeTitle';

export const FlexibleAreasOnlyPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Heading4>Add FLEXIBLE_AREAS_ONLY header</Heading4>
      <Paragraph>Add FLEXIBLE_AREAS_ONLY description</Paragraph>
      <div className="passing-times-editor">
        <div className="passing-time">
          <PassingTimeTitle stopPoint={stopPoints[0]} />
          <FlexibleAreasOnlyPassingTimeEditor
            passingTime={passingTimes[0]}
            onChange={(changedPassingTime) => {
              onChange([changedPassingTime, changedPassingTime]);
            }}
          />
        </div>
      </div>
    </>
  );
};
