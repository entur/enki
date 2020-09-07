import React, { useState, ChangeEvent } from 'react';
import { Modal } from '@entur/modal';
import { LeadParagraph } from '@entur/typography';
import { TextField, InputGroup } from '@entur/form';
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
} from 'date-fns';
import * as duration from 'duration-fns';

type Props = {
  open: boolean;
  serviceJourney: ServiceJourney;
  onSave: (serviceJourneys: ServiceJourney[]) => void;
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

export default ({ open, serviceJourney, onSave }: Props) => {
  const [nameTemplate, setNameTemplate] = useState<string>(
    `${serviceJourney.name} (<% time %>)`
  );
  const [initialDepartureTime, setInitialDepartureTime] = useState<string>(
    serviceJourney.passingTimes[0].departureTime!
  );
  const [initialDayOffset, setInitialDayOffset] = useState<number>(
    serviceJourney.passingTimes[0].departureDayOffset!
  );
  const [repeatDuration, setRepeatDuration] = useState<string>('');
  const [untilTime, setUntilTime] = useState<string>(
    serviceJourney.passingTimes[0].departureTime!
  );
  const [untilDayOffset, setUntilDayOffset] = useState<number>(0);

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
    <Modal open={open} size="large" title="Copy Service Journey">
      <LeadParagraph>Say something useful here.</LeadParagraph>
      <InputGroup label="Name">
        <TextField
          value={nameTemplate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameTemplate(e.target.value)
          }
        />
      </InputGroup>
      <InputGroup label="Set initial departure time" className="timepicker">
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
      <InputGroup label="Set initial day offset">
        <TextField
          type="number"
          value={initialDayOffset}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInitialDayOffset(parseInt(e.target.value))
          }
        />
      </InputGroup>
      Create new departures starting at initial departure time, repeating every
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
      until
      <TimePicker
        onChange={(date: Date | null) => {
          const time = date?.toTimeString().split(' ')[0];
          setUntilTime(time!);
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(untilTime!)}
      />
      <InputGroup label="Until day offset">
        <TextField
          type="number"
          value={untilDayOffset}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUntilDayOffset(parseInt(e.target.value))
          }
        />
      </InputGroup>
      <ButtonGroup>
        <Button variant="negative">Cancel</Button>
        <Button variant="success" onClick={() => save()}>
          Save
        </Button>
      </ButtonGroup>
    </Modal>
  );
};
