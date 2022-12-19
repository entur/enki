import React, { useMemo } from 'react';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { validateTimes } from 'helpers/validation';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { getErrorFeedback } from 'helpers/errorHandling';
import { SmallAlertBox } from '@entur/alert';
import PassingTimeTitle from './PassingTimeTitle';
import './styles.scss';
import { PassingTimeEditor } from './PassingTimeEditor';
import { changeElementAtIndex } from 'helpers/arrays';

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

type Props = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
  spoilPristine: boolean;
  showFlexible: boolean;
};

export const PassingTimesEditor = (props: Props) => {
  const { stopPoints, passingTimes, onChange, spoilPristine } = props;

  const intl = useSelector(selectIntl);

  const { flexibleStopPlaces } = useSelector(
    ({ flexibleStopPlaces }: StateProps) => ({
      flexibleStopPlaces,
    })
  );

  const { isValid, errorMessage } = useMemo(() => {
    return validateTimes(passingTimes, intl);
  }, [passingTimes, intl]);

  const error = useMemo(() => {
    return getErrorFeedback(errorMessage, isValid, !spoilPristine);
  }, [errorMessage, isValid, spoilPristine]);

  return (
    <>
      {error?.feedback && (
        <SmallAlertBox variant="error">{error.feedback}</SmallAlertBox>
      )}
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={index} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <PassingTimeTitle
              flexibleStopPlaces={flexibleStopPlaces}
              stopPoint={stopPoints[index]}
            />
            <PassingTimeEditor
              passingTime={passingTime}
              index={index}
              isLast={index === stopPoints.length - 1}
              onChange={(changedPassingTime) => {
                onChange(
                  changeElementAtIndex(passingTimes, changedPassingTime, index)
                );
              }}
              showFlexible={props.showFlexible}
            />
          </div>
        ))}
      </div>
    </>
  );
};
