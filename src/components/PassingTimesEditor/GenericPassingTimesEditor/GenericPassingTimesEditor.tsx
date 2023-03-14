import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { useIntl } from 'i18n';
import { PassingTimesEditorProps } from '..';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { changeElementAtIndex } from 'helpers/arrays';

export const TimeWindowPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Heading4>{formatMessage('serviceJourneyPassingTimes')}</Heading4>
      <Paragraph>{formatMessage('passingTimesInfo')}</Paragraph>
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={index} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <FixedPassingTimeEditor
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
