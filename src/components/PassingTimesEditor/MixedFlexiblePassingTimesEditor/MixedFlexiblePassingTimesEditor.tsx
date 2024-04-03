import { Heading4, Paragraph } from '@entur/typography';
import { changeElementAtIndex } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { useIntl } from 'react-intl';
import { PassingTimesEditorProps } from '..';
import { PassingTimesError } from '../common/PassingTimesError';
import { MixedFlexiblePassingTimeEditor } from './MixedFlexiblePassingTimeEditor';

export const MixedFlexiblePassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Heading4>
        {formatMessage({ id: 'serviceJourneyMixedFlexiblePassingTimes' })}
      </Heading4>
      <Paragraph>
        {formatMessage({ id: 'passingTimesInfoMixedFlexible' })}
      </Paragraph>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={uniqueKeys[index]} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <MixedFlexiblePassingTimeEditor
              passingTime={passingTime}
              stopPoint={stopPoints[index]}
              index={index}
              isLast={index === stopPoints.length - 1}
              onChange={(changedPassingTime) => {
                onChange(
                  changeElementAtIndex(passingTimes, changedPassingTime, index),
                );
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
