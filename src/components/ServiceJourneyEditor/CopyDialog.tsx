import React, { useState, ChangeEvent } from 'react';
import { Modal } from '@entur/modal';
import { LeadParagraph } from '@entur/typography';
import { RadioGroup, Radio, TextField, InputGroup } from '@entur/form';
import { ButtonGroup, Button } from '@entur/button';
import { TimePicker } from '@entur/datepicker';
import { ClockIcon } from '@entur/icons';
import ServiceJourney from 'model/ServiceJourney';
import { clone } from 'ramda';
import PassingTime from 'model/PassingTime';
import {
  differenceInMinutes,
  addMinutes,
  differenceInCalendarDays,
} from 'date-fns/esm';

type Props = {
  open: boolean;
  serviceJourney: ServiceJourney;
  onSave: (serviceJourney: ServiceJourney) => void;
};

// enum CopyMethod {
//   DUPLICATE = 'DUPLICATE',
//   MODIFY_DEPARTURE_TIME = 'MODIFY_DEPARTURE_TIME',
//   GENERATE_DEPARTURES = 'GENERATE_DEPARTURES'
// }

const toDate = (date: string): Date => {
  //if (!date) return;
  const [hours, minutes, seconds] = date.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(parseInt(seconds));

  return dateObj;
};

const createClone = (serviceJourney: ServiceJourney) => {
  const copy = clone(serviceJourney);
  copy.name = `${serviceJourney.name} (copy)`;
  return copy;
};

/*
  arrivalTime?: string;
  arrivalDayOffset?: number;
  departureTime?: string;
  departureDayOffset?: number;
  latestArrivalTime?: string;
  latestArrivalDayOffset?: number;
  earliestDepartureTime?: string;
  earliestDepartureDayOffset?: number;
*/

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
  newDepartureTime: string
) => {
  const oldDeparture = toDate(passingTimes[0].departureTime!);
  const newDeparture = toDate(newDepartureTime);
  const offset = differenceInMinutes(newDeparture!, oldDeparture!);

  //const time = date?.toTimeString().split(' ')[0];

  // passingTimes[0].departureTime = newDepartureTime;
  // return passingTimes;

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
          offset,
          'arrivalTime',
          'arrivalDayOffset'
        ),
        ...offsetPassingTime(
          departureTime!,
          departureDayOffset!,
          offset,
          'departureTime',
          'departureDayOffset'
        ),
      };
    }
  );
};

export default ({ open, serviceJourney, onSave }: Props) => {
  // const [copyMethod, setCopyMethod] = useState<CopyMethod>(CopyMethod.DUPLICATE);
  // const [name, setName] = useState<string | undefined>(`${serviceJourney.name} (copy)`);
  // const [departureTime, setDepartureTime] = useState(serviceJourney.passingTimes[0].departureTime)

  const [copy, setCopy] = useState<ServiceJourney>(createClone(serviceJourney));

  const setName = (name: string) => {
    setCopy({ ...copy, name });
  };

  const setDepartureTime = (time: string) => {
    setCopy({
      ...copy,
      passingTimes: offsetPassingTimes(serviceJourney.passingTimes, time),
    });
  };

  console.log(copy);

  return (
    <Modal open={open} size="large" title="Copy Service Journey">
      <LeadParagraph>Say something useful here.</LeadParagraph>
      {/* <RadioGroup
        name="copy-method"
        title="Choose how to copy"
        value={copyMethod}
        onChange={e => setCopyMethod(e.target.value as CopyMethod)}
      >
        <Radio value={CopyMethod.DUPLICATE}>Simple copy</Radio>
        <Radio disabled value={CopyMethod.MODIFY_DEPARTURE_TIME}>Modify departure time</Radio>
        <Radio disabled value={CopyMethod.GENERATE_DEPARTURES}>Generate departures</Radio>
      </RadioGroup> */}
      <InputGroup label="Name">
        <TextField
          value={copy.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
      </InputGroup>
      <InputGroup label="Set departure time" className="timepicker">
        <TimePicker
          onChange={(date: Date | null) => {
            const time = date?.toTimeString().split(' ')[0];
            console.log(time);

            // setName(`${serviceJourney.name} (${time})`)
            setDepartureTime(time!);
            // onChange(
            //   changeElementAtIndex(
            //     passingTimes,
            //     {
            //       ...passingTimes[index],
            //       departureTime: date,
            //       arrivalTime: date,
            //     },
            //     index
            //   )
            // );
          }}
          prepend={<ClockIcon inline />}
          selectedTime={toDate(copy.passingTimes[0].departureTime!)}
        />
      </InputGroup>
      Create a new departure every [N] [minutes, hours], until [time]
      <ButtonGroup>
        <Button variant="negative">Cancel</Button>
        <Button variant="success" onClick={() => onSave(copy)}>
          Save
        </Button>
      </ButtonGroup>
    </Modal>
  );
};
