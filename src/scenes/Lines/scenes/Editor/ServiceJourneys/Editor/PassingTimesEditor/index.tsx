import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { ClockIcon } from '@entur/icons';
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
    <Dropdown
      label={formatMessage('passingTimesDayTimeOffset')}
      labelTooltip={formatMessage('passingTimesDayTimeOffsetTooltip')}
      value={passingTime.departureDayOffset?.toString() ?? '0'}
      items={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((i) => ({
        value: i,
        label: i,
      }))}
      onChange={(e) =>
        onChange(
          changeElementAtIndex(
            passingTimes,
            {
              ...passingTimes[index],
              departureDayOffset: e?.value as number | undefined,
              arrivalDayOffset: e?.value as number | undefined,
            },
            index
          )
        )
      }
    />
  );

  const padTimePickerInput = (time: string): string | undefined => {
    if (time.length === 0) return undefined;
    return time + ':00';
  };

  const getTimePicker = (
    passingTime: PassingTime,
    index: number,
    label: string
  ) => {
    const shownValue = passingTime.departureTime
      ?.split(':')
      .slice(0, 2)
      .join(':');

    return (
      <InputGroup label={label} className="timepicker">
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(
              changeElementAtIndex(
                passingTimes,
                {
                  ...passingTimes[index],
                  departureTime: padTimePickerInput(e.target.value),
                  arrivalTime: padTimePickerInput(e.target.value),
                },
                index
              )
            )
          }
          prepend={<ClockIcon inline />}
          type="time"
          defaultValue={shownValue}
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
