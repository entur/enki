import { Heading4, Paragraph } from '@entur/typography';
import { changeElementAtIndex } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { useIntl } from 'react-intl';
import { PassingTimesEditorProps } from '..';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { PassingTimesError } from '../common/PassingTimesError';

export const GenericPassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Heading4>{formatMessage({ id: 'serviceJourneyPassingTimes' })}</Heading4>
      <Paragraph>{formatMessage({ id: 'passingTimesInfo' })}</Paragraph>
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
