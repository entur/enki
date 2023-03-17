import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { useIntl } from 'i18n';
import { PassingTimesEditorProps } from '..';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { changeElementAtIndex } from 'helpers/arrays';
import { PassingTimesError } from '../common/PassingTimesError';
import useUniqueKeys from 'hooks/useUniqueKeys';

export const TimeWindowPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Heading4>{formatMessage('serviceJourneyPassingTimes')}</Heading4>
      <Paragraph>{formatMessage('passingTimesInfo')}</Paragraph>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={uniqueKeys[index]} className="passing-time">
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
