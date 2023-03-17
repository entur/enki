import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { PassingTimesEditorProps } from '..';
import { changeElementAtIndex } from 'helpers/arrays';
import { MixedFlexiblePassingTimeEditor } from './MixedFlexiblePassingTimeEditor';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';

export const MixedFlexiblePassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <>
      <Heading4>
        {formatMessage('serviceJourneyMixedFlexiblePassingTimes')}
      </Heading4>
      <Paragraph>{formatMessage('passingTimesInfoMixedFlexible')}</Paragraph>
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
