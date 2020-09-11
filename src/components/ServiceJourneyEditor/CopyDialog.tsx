import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal } from '@entur/modal';
import { Label } from '@entur/typography';
import { TextField, InputGroup, Switch, FeedbackText } from '@entur/form';
import { ButtonGroup, Button } from '@entur/button';
import { TimePicker } from '@entur/datepicker';
import { ClockIcon } from '@entur/icons';
import ServiceJourney from 'model/ServiceJourney';
import { clone } from 'ramda';
import PassingTime from 'model/PassingTime';
import DurationPicker from 'components/DurationPicker';
import {
  addDays,
  differenceInMinutes,
  addMinutes,
  differenceInCalendarDays,
} from 'date-fns';
import * as duration from 'duration-fns';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { isBefore, isAfter } from 'helpers/validation';

type Props = {
  open: boolean;
  serviceJourney: ServiceJourney;
  onSave: (serviceJourneys: ServiceJourney[]) => void;
  onDismiss: () => void;
};

type ValidationError = {
  untilTimeIsNotAfterInitialTime?: string;
};

const toDate = (date: string): Date => {
  const [hours, minutes, seconds] = date.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(parseInt(seconds));
  return dateObj;
};

const offsetPassingTime = (
  oldTime: string,
  oldDayOffset: number,
  offset: number,
  timeKey: string,
  dayOffsetKey: string
) => {
  const newTime = addMinutes(toDate(oldTime), offset);
  const offsetDays = differenceInCalendarDays(newTime, toDate(oldTime));

  return {
    [timeKey]: newTime.toTimeString().split(' ')[0],
    [dayOffsetKey]: oldDayOffset + offsetDays,
  };
};

const offsetPassingTimes = (
  passingTimes: PassingTime[],
  offsetInMinutes: number
) => {
  return passingTimes.map(
    ({
      arrivalTime,
      arrivalDayOffset,
      departureTime,
      departureDayOffset,
      ...rest
    }) => {
      return {
        ...rest,
        ...offsetPassingTime(
          arrivalTime!,
          arrivalDayOffset!,
          offsetInMinutes,
          'arrivalTime',
          'arrivalDayOffset'
        ),
        ...offsetPassingTime(
          departureTime!,
          departureDayOffset!,
          offsetInMinutes,
          'departureTime',
          'departureDayOffset'
        ),
      };
    }
  );
};

const copyServiceJourney = (
  serviceJourney: ServiceJourney,
  newServiceJourneys: ServiceJourney[],
  nameTemplate: string,
  departureTime: string,
  dayOffset: number,
  untilTime: string,
  untilDayOffset: number,
  repeatDuration: Duration
): ServiceJourney[] => {
  const departure = addDays(toDate(departureTime), dayOffset);

  if (isAfter(departureTime, dayOffset, untilTime, untilDayOffset)) {
    return newServiceJourneys;
  } else {
    const lastActualDeparture = addDays(
      toDate(serviceJourney.passingTimes[0].departureTime!),
      serviceJourney.passingTimes[0].departureDayOffset!
    );

    const {
      id,
      passingTimes,
      dayTypes,
      ...copyableServiceJourney
    } = serviceJourney;

    const newPassingTimes = offsetPassingTimes(
      passingTimes.map(({ id, ...pt }) => pt),
      differenceInMinutes(departure, lastActualDeparture)
    );

    const newDayTypes = dayTypes?.map(({ id, ...dt }) => dt);

    const newServiceJourney = {
      ...clone(copyableServiceJourney),
      name: nameTemplate.replace(
        '<% time %>',
        `${departureTime.slice(0, -3)} +${dayOffset}`
      ),
      dayTypes: newDayTypes,
      passingTimes: newPassingTimes,
    };
    newServiceJourneys.push(newServiceJourney);
    const nextDeparture = addMinutes(
      departure,
      duration.toMinutes(repeatDuration)
    );
    const nextDepartureTime = nextDeparture?.toTimeString().split(' ')[0];
    const nextDayOffset = differenceInCalendarDays(
      nextDeparture,
      toDate(departureTime)
    );
    return copyServiceJourney(
      newServiceJourney,
      newServiceJourneys,
      nameTemplate,
      nextDepartureTime,
      nextDayOffset,
      untilTime,
      untilDayOffset,
      repeatDuration
    );
  }
};

export default ({ open, serviceJourney, onSave, onDismiss }: Props) => {
  const defaultDepartureTime =
    serviceJourney.passingTimes[0].departureTime || '00:00:00';
  const defaultDayOffset =
    serviceJourney.passingTimes[0].departureDayOffset || 0;

  const [nameTemplate, setNameTemplate] = useState<string>(
    `${serviceJourney.name || 'New'} (<% time %>)`
  );
  const [initialDepartureTime, setInitialDepartureTime] = useState<string>(
    defaultDepartureTime
  );
  const [initialDayOffset, setInitialDayOffset] = useState<number>(
    defaultDayOffset
  );
  const [repeatDuration, setRepeatDuration] = useState<string>('PT1H');
  const [untilTime, setUntilTime] = useState<string>(defaultDepartureTime);
  const [untilDayOffset, setUntilDayOffset] = useState<number>(
    defaultDayOffset
  );

  const [validationError, setValidationError] = useState<ValidationError>({});

  const [multiple, setMultiple] = useState<boolean>(false);

  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    if (
      isBefore(
        untilTime,
        untilDayOffset,
        initialDepartureTime,
        initialDayOffset
      )
    ) {
      setValidationError({
        ...validationError,
        untilTimeIsNotAfterInitialTime: formatMessage(
          'copyServiceJourneyDialogValidationUntilTimeBeforeInitialTimeError'
        ),
      });
    } else {
      const { untilTimeIsNotAfterInitialTime, ...rest } = validationError;
      setValidationError({
        ...rest,
      });
    }
    // eslint-disable-next-line
  }, [initialDepartureTime, initialDayOffset, untilTime, untilDayOffset]);

  useEffect(() => {
    if (!multiple) {
      setUntilTime(initialDepartureTime);
      setUntilDayOffset(initialDayOffset);
    }
  }, [multiple, initialDepartureTime, initialDayOffset]);

  const save = () => {
    onSave(
      copyServiceJourney(
        serviceJourney,
        [],
        nameTemplate,
        initialDepartureTime,
        initialDayOffset,
        untilTime,
        untilDayOffset,
        duration.parse(repeatDuration)
      )
    );
  };

  return (
    <Modal
      open={open}
      size="small"
      title={formatMessage('copyServiceJourneyDialogTitle')}
      onDismiss={onDismiss}
      className="copy-dialog"
    >
      <InputGroup
        label={formatMessage('copyServiceJourneyDialogNameTemplateLabel')}
        className="copy-dialog-wide-element"
      >
        <TextField
          value={nameTemplate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameTemplate(e.target.value)
          }
        />
      </InputGroup>

      <div className="copy-dialog-section">
        <div className="copy-dialog-inputs">
          <InputGroup
            label={formatMessage('copyServiceJourneyDialogDepartureTimeLabel')}
            className="copy-dialog-timepicker"
          >
            <TimePicker
              onChange={(date: Date | null) => {
                const time = date?.toTimeString().split(' ')[0];
                setNameTemplate(`${serviceJourney.name} (<% time %>)`);
                setInitialDepartureTime(time!);
              }}
              prepend={<ClockIcon inline />}
              selectedTime={toDate(initialDepartureTime)}
            />
          </InputGroup>
          <DayOffsetDropdown
            initialValue={initialDayOffset}
            onChange={(value) => setInitialDayOffset(value!)}
          />
        </div>
      </div>
      <div className="copy-dialog-section">
        <Label>Create multiple copies</Label>
        <Switch checked={multiple} onChange={() => setMultiple(!multiple)} />
      </div>
      {multiple && (
        <>
          <div className="copy-dialog-section">
            <Label>Choose an interval</Label>
            <DurationPicker
              className="copy-dialog-wide-element"
              onChange={(newRepeatDuration) => {
                setRepeatDuration(newRepeatDuration!);
              }}
              duration={repeatDuration}
              showSeconds={false}
              showMinutes
              showHours
              showDays={false}
              showMonths={false}
              showYears={false}
            />
          </div>
          <div className="copy-dialog-section">
            <div className="copy-dialog-inputs">
              <InputGroup
                className="copy-dialog-timepicker"
                label={formatMessage(
                  'copyServiceJourneyDialogLatestPossibleDepartureTimelabel'
                )}
              >
                <TimePicker
                  onChange={(date: Date | null) => {
                    const time = date?.toTimeString().split(' ')[0];
                    setUntilTime(time!);
                  }}
                  prepend={<ClockIcon inline />}
                  selectedTime={toDate(untilTime)}
                />
              </InputGroup>
              <DayOffsetDropdown
                initialValue={untilDayOffset}
                onChange={(value) => setUntilDayOffset(value!)}
              />
            </div>
            {validationError.untilTimeIsNotAfterInitialTime && (
              <FeedbackText variant="error">
                {validationError.untilTimeIsNotAfterInitialTime}
              </FeedbackText>
            )}
          </div>
        </>
      )}

      <div className="copy-dialog-section">
        <ButtonGroup>
          <Button variant="negative" onClick={() => onDismiss()}>
            {formatMessage('copyServiceJourneyDialogCancelButtonText')}
          </Button>
          <Button
            variant="success"
            onClick={() => save()}
            disabled={Object.keys(validationError).length > 0}
          >
            {formatMessage('copyServiceJourneyDialogSaveButtonText')}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};
