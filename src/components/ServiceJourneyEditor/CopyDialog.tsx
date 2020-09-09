import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal } from '@entur/modal';
import { LeadParagraph, Label } from '@entur/typography';
import { TextField, InputGroup, RadioGroup, Radio } from '@entur/form';
import { ButtonGroup, Button } from '@entur/button';
import { TimePicker } from '@entur/datepicker';
import { ClockIcon } from '@entur/icons';
import ServiceJourney from 'model/ServiceJourney';
import { clone } from 'ramda';
import PassingTime from 'model/PassingTime';
import DurationPicker from 'components/DurationPicker';
import {
  addDays,
  isAfter,
  differenceInMinutes,
  addMinutes,
  differenceInCalendarDays,
  isBefore,
} from 'date-fns';
import * as duration from 'duration-fns';

type Props = {
  open: boolean;
  serviceJourney: ServiceJourney;
  onSave: (serviceJourneys: ServiceJourney[]) => void;
  onDismiss: () => void;
};

type ValidationError = {
  untilTimeIsNotAfterInitialTime?: string;
};

enum CopyMethod {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

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

  if (isAfter(departure, addDays(toDate(untilTime), untilDayOffset))) {
    return newServiceJourneys;
  } else {
    const lastActualDeparture = addDays(
      toDate(serviceJourney.passingTimes[0].departureTime!),
      serviceJourney.passingTimes[0].departureDayOffset!
    );
    const newPassingTimes = offsetPassingTimes(
      serviceJourney.passingTimes,
      differenceInMinutes(departure, lastActualDeparture)
    );
    const newServiceJourney = {
      ...clone(serviceJourney),
      name: nameTemplate.replace(
        '<% time %>',
        `${departureTime.slice(0, -3)} +${dayOffset}`
      ),
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
  const [nameTemplate, setNameTemplate] = useState<string>(
    `${serviceJourney.name} (<% time %>)`
  );
  const [initialDepartureTime, setInitialDepartureTime] = useState<string>(
    serviceJourney.passingTimes[0].departureTime!
  );
  const [initialDayOffset, setInitialDayOffset] = useState<number>(
    serviceJourney.passingTimes[0].departureDayOffset!
  );
  const [repeatDuration, setRepeatDuration] = useState<string>('PT1H');
  const [untilTime, setUntilTime] = useState<string>(
    serviceJourney.passingTimes[0].departureTime!
  );
  const [untilDayOffset, setUntilDayOffset] = useState<number>(0);

  const [validationError, setValidationError] = useState<ValidationError>({});

  const [copyMethod, setCopyMethod] = useState<CopyMethod>(CopyMethod.SINGLE);

  useEffect(() => {
    const initialDeparture = addDays(
      toDate(initialDepartureTime),
      initialDayOffset
    );
    const until = addDays(toDate(untilTime), untilDayOffset);

    if (isBefore(until, initialDeparture)) {
      setValidationError({
        ...validationError,
        untilTimeIsNotAfterInitialTime:
          "Until time can't be before initial time",
      });
    } else {
      const { untilTimeIsNotAfterInitialTime, ...rest } = validationError;
      setValidationError({
        ...rest,
      });
    }
  }, [initialDepartureTime, initialDayOffset, untilTime, untilDayOffset]);

  useEffect(() => {
    if (copyMethod === CopyMethod.SINGLE) {
      setUntilTime(initialDepartureTime);
      setUntilDayOffset(initialDayOffset);
    }
  }, [
    copyMethod,
    initialDepartureTime,
    initialDayOffset,
    setUntilTime,
    setUntilDayOffset,
  ]);

  const save = () => {
    // if (!validationError.) {

    // } else {
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
    // }
  };

  return (
    <Modal
      open={open}
      size="large"
      title="Copy Service Journey"
      onDismiss={onDismiss}
    >
      <LeadParagraph>
        Create one or more copies of the selected service journey. Set the
        departure time and day offset (relative to the original) of the first
        copy. If you select "multiple", choose an interval and a latest
        departure time. As many copies as possible will be created within the
        allowed parameters.
      </LeadParagraph>
      <InputGroup label="Name template">
        <TextField
          value={nameTemplate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameTemplate(e.target.value)
          }
        />
      </InputGroup>
      <InputGroup
        label="Set departure time and day offset of (first) copy"
        className="timepicker"
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
        <TextField
          type="number"
          value={initialDayOffset}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInitialDayOffset(parseInt(e.target.value))
          }
        />
      </InputGroup>
      <RadioGroup
        label="Copy strategy"
        name="copy_method"
        value={copyMethod}
        onChange={(e) => setCopyMethod(e.target.value as CopyMethod)}
      >
        <Radio value={CopyMethod.SINGLE}>Single</Radio>
        <Radio value={CopyMethod.MULTIPLE}>Multiple</Radio>
      </RadioGroup>
      {copyMethod === CopyMethod.MULTIPLE && (
        <>
          <Label>Choose an interval</Label>
          <DurationPicker
            onChange={(duration) => {
              setRepeatDuration(duration!);
            }}
            duration={repeatDuration}
            showSeconds={false}
            showMinutes
            showHours
            showDays={false}
            showMonths={false}
            showYears={false}
          />
          <InputGroup
            label="Set latest possible departure time and day offset"
            variant={
              validationError.untilTimeIsNotAfterInitialTime
                ? 'error'
                : undefined
            }
            feedback={validationError.untilTimeIsNotAfterInitialTime}
          >
            <TimePicker
              onChange={(date: Date | null) => {
                const time = date?.toTimeString().split(' ')[0];
                setUntilTime(time!);
              }}
              prepend={<ClockIcon inline />}
              selectedTime={toDate(untilTime!)}
            />
            <TextField
              type="number"
              value={untilDayOffset}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUntilDayOffset(parseInt(e.target.value))
              }
            />
          </InputGroup>
        </>
      )}

      <ButtonGroup>
        <Button variant="negative" onClick={() => onDismiss()}>
          Cancel
        </Button>
        <Button variant="success" onClick={() => save()}>
          Save
        </Button>
      </ButtonGroup>
    </Modal>
  );
};
