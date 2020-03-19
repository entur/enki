import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { ClockIcon } from '@entur/icons';
import StopPoint from 'model/StopPoint';
import PassingTime from 'model/PassingTime';
import { replaceElement } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlState } from 'react-intl-redux';
import messages from './messages';
import { selectIntl } from 'i18n';
import PassingTimeTitle from './PassingTimeTitle';
import './styles.scss';

type TimeKeys = keyof Pick<
  PassingTime,
  | 'departureTime'
  | 'arrivalTime'
  | 'earliestDepartureTime'
  | 'latestArrivalTime'
>;
type OffsetKeys = keyof Pick<
  PassingTime,
  | 'departureDayOffset'
  | 'arrivalDayOffset'
  | 'earliestDepartureDayOffset'
  | 'latestArrivalDayOffset'
>;
const passingTimesKeys: {
  time: TimeKeys;
  offset: OffsetKeys;
}[] = [
  { time: 'departureTime', offset: 'departureDayOffset' },
  { time: 'latestArrivalTime', offset: 'latestArrivalDayOffset' },
  { time: 'arrivalTime', offset: 'arrivalDayOffset' },
  { time: 'earliestDepartureTime', offset: 'earliestDepartureDayOffset' }
];

const getPassingTimeKeys = (
  passingTime: PassingTime
): { time: TimeKeys; offset: OffsetKeys } => {
  const keys = passingTimesKeys.find(({ time }) => passingTime[time]);

  if (!keys) return { time: 'departureTime', offset: 'departureDayOffset' };
  return keys;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
  intl: IntlState;
};

type Props = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
};

const PassingTimesEditor = (props: Props & StateProps) => {
  const {
    stopPoints,
    passingTimes,
    intl,
    onChange,
    flexibleStopPlaces
  } = props;
  const { isValid, errorMessage } = validateTimes(passingTimes, intl);
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (
    index: number,
    field: keyof PassingTime,
    value: PassingTime[keyof PassingTime]
  ) => {
    const passingTime = { ...passingTimes[index], [field]: value };
    const { time, offset } = getPassingTimeKeys(passingTime);
    const newPassingTime: PassingTime = {
      departureTime: passingTime[time],
      arrivalTime: passingTime[time],
      departureDayOffset: passingTime[offset],
      arrivalDayOffset: passingTime[offset]
    };
    const newPassingTimes = replaceElement(passingTimes, index, newPassingTime);

    onChange(newPassingTimes);
  };

  const handleDayOffsetChange = (
    index: number,
    field: OffsetKeys,
    value: string
  ) => {
    const parsedValue = parseInt(value);
    onFieldChange(index, field, parsedValue !== 0 ? value : undefined);
  };

  const getDayOffsetDropdown = (
    tpt: PassingTime,
    index: number,
    field: OffsetKeys
  ) => (
    <InputGroup
      label={formatMessage(messages.dayTimeOffset)}
      className="dayoffset"
    >
      <Dropdown
        items={[...Array(10).keys()].map(i => ({
          value: String(i),
          label: String(i)
        }))}
        onChange={(e: NormalizedDropdownItemType | null) => {
          if (!e?.value) return;
          handleDayOffsetChange(index, field, e.value);
        }}
        value={tpt[field]?.toString() ?? '0'}
      />
    </InputGroup>
  );

  const padTimePickerInput = (time: string): string | undefined => {
    if (time.length === 0) return undefined;
    return time + ':00';
  };

  const getTimePicker = (tpt: PassingTime, index: number, field: TimeKeys) => {
    const currentValue = tpt[field];

    const shownValue = currentValue
      ?.split(':')
      .slice(0, 2)
      .join(':');

    return (
      <InputGroup
        label={formatMessage(messages.passingTime)}
        className="timepicker"
      >
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFieldChange(index, field, padTimePickerInput(e.target.value))
          }
          prepend={<ClockIcon inline />}
          type="time"
          defaultValue={shownValue}
        />
      </InputGroup>
    );
  };

  return (
    <>
      {!isValid && (
        <SmallAlertBox variant="error"> {errorMessage} </SmallAlertBox>
      )}
      <div className="passing-times-editor">
        {stopPoints.map((stopPoint, index) => {
          const passingTime = passingTimes[index];
          const { time, offset } = getPassingTimeKeys(passingTime);
          return (
            <div className="passing-time">
              <div className="time-number">{index + 1}</div>
              <PassingTimeTitle
                flexibleStopPlaces={flexibleStopPlaces}
                stopPoint={stopPoint}
              />
              {getTimePicker(passingTime, index, time)}
              {getDayOffsetDropdown(passingTime, index, offset)}
            </div>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(PassingTimesEditor);
