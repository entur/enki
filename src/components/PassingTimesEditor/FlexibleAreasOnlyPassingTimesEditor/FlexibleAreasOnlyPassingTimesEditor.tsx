import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { PassingTimesEditorProps } from '..';
import { TimeWindowPassingTimeEditor } from '../TimeWindowPassingTimeEditor/TimeWindowPassingTimeEditor';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';

export const FlexibleAreasOnlyPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <>
      <Heading4>{formatMessage('serviceJourneyBusinessHours')}</Heading4>
      <Paragraph>
        {formatMessage('passingTimesInfoFlexibleAreasOnly')}
      </Paragraph>
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
