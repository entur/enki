import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TimePicker } from '@entur/datepicker';
import { InputGroup } from '@entur/form';
import { ClockIcon, NightIcon } from '@entur/icons';
import StopPoint from 'model/StopPoint';
import PassingTime from 'model/PassingTime';
import { changeElementAtIndex } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlState } from 'react-intl-redux';
import { selectIntl } from 'i18n';
import PassingTimeTitle from './PassingTimeTitle';
import './styles.scss';
import { getErrorFeedback } from 'helpers/errorHandling';
import FlexibleAreasPassingTime from './FlexibleAreasPassingTime';
import { getEnumInit, mapEnumToItems } from 'helpers/dropdown';
import DayOffsetDropdown from 'components/DayOffsetDropdown';

const toDate = (date: string | undefined): Date | undefined => {
  if (!date) return;
  const [hours, minutes, seconds] = date.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(parseInt(seconds));

  return dateObj;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
  intl: IntlState;
};

type Props = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
  spoilPristine: boolean;
  flexibleLineType: string | undefined;
};

const PassingTimesEditor = (props: Props & StateProps) => {
  const {
    stopPoints,
    passingTimes,
    intl,
    onChange,
    flexibleStopPlaces,
    spoilPristine,
    flexibleLineType,
  } = props;
  const { isValid, errorMessage } = validateTimes(passingTimes, intl);
  const { formatMessage } = useSelector(selectIntl);

  const getDayOffsetDropdown = (passingTime: PassingTime, index: number) => (
    <DayOffsetDropdown
      initialValue={passingTime.departureDayOffset}
      onChange={(value) =>
        onChange(
          changeElementAtIndex(
            passingTimes,
            {
              ...passingTimes[index],
              departureDayOffset: value,
              arrivalDayOffset: value,
            },
            index
          )
        )
      }
    />
  );

  const getTimePicker = (
    passingTime: PassingTime,
    index: number,
    label: string
  ) => {
    return (
      <InputGroup label={label} className="timepicker">
        <TimePicker
          onChange={(e: Date | null) => {
            const date = e?.toTimeString().split(' ')[0];

            onChange(
              changeElementAtIndex(
                passingTimes,
                {
                  ...passingTimes[index],
                  departureTime: date,
                  arrivalTime: date,
                },
                index
              )
            );
          }}
          prepend={<ClockIcon inline />}
          selectedTime={toDate(passingTime.departureTime)}
        />
      </InputGroup>
    );
  };

  const error = getErrorFeedback(errorMessage, isValid, !spoilPristine);

  return (
    <>
      {error.feedback && (
        <SmallAlertBox variant="error">{error.feedback}</SmallAlertBox>
      )}
      <div className="passing-times-editor">
        {flexibleLineType === 'flexibleAreasOnly' ? (
          <FlexibleAreasPassingTime
            flexibleStopPlaces={flexibleStopPlaces}
            stopPoints={stopPoints}
          >
            {getTimePicker(
              passingTimes[0],
              0,
              formatMessage('dayTypeEditorFromDate')
            )}
            {getTimePicker(
              passingTimes[1],
              1,
              formatMessage('dayTypeEditorToDate')
            )}
          </FlexibleAreasPassingTime>
        ) : (
          passingTimes.map((passingTime, index) => (
            <div key={index} className="passing-time">
              <div className="time-number">{index + 1}</div>
              <PassingTimeTitle
                flexibleStopPlaces={flexibleStopPlaces}
                stopPoint={stopPoints[index]}
              />
              {getTimePicker(
                passingTime,
                index,
                formatMessage('passingTimesPassingTime')
              )}
              {getDayOffsetDropdown(passingTime, index)}
            </div>
          ))
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl,
});

export default connect(mapStateToProps)(PassingTimesEditor);
