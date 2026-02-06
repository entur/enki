import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  fromDate,
  getLocalTimeZone,
  now,
  parseTime,
  Time,
} from '@internationalized/date';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import DurationPicker from 'components/DurationPicker';
import * as duration from 'duration-fns';
import { createUuid } from 'helpers/generators';
import { isAfter, isBefore } from 'validation';
import cloneDeep from 'lodash.clonedeep';
import PassingTime from 'model/PassingTime';
import ServiceJourney from 'model/ServiceJourney';
import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

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
  dateObj.setSeconds(parseInt(seconds || '0'));
  dateObj.setMilliseconds(0);
  return dateObj;
};

const offsetPassingTime = (
  oldTime: string,
  oldDayOffset: number,
  offset: number,
  timeKey: string,
  dayOffsetKey: string,
) => {
  if (!oldTime) return undefined;
  const oldTimeAsDate = fromDate(toDate(oldTime), getLocalTimeZone());
  const newTimeAsDate = fromDate(toDate(oldTime), getLocalTimeZone()).add({
    minutes: offset,
  });
  const offsetDays =
    newTimeAsDate.calendar.toJulianDay(newTimeAsDate) -
    oldTimeAsDate.calendar.toJulianDay(oldTimeAsDate);

  return {
    [timeKey]: newTimeAsDate.toDate().toTimeString().split(' ')[0],
    [dayOffsetKey]: oldDayOffset + offsetDays,
  };
};

const offsetPassingTimes = (
  passingTimes: PassingTime[],
  offsetInMinutes: number,
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
          'arrivalDayOffset',
        ),
        ...offsetPassingTime(
          departureTime!,
          departureDayOffset!,
          offsetInMinutes,
          'departureTime',
          'departureDayOffset',
        ),
      };
    },
  );
};

const addDays = (time: Time, days: number) => {
  return now(getLocalTimeZone()).set(time).add({ days });
};

export const copyServiceJourney = (
  serviceJourney: ServiceJourney,
  newServiceJourneys: ServiceJourney[],
  nameTemplate: string,
  departureTime: string,
  dayOffset: number,
  untilTime: string,
  untilDayOffset: number,
  repeatDuration: duration.Duration,
): ServiceJourney[] => {
  const departure = parseTime(departureTime);
  const until = parseTime(untilTime);

  // Compare times including day offset
  const departureDateTime = addDays(departure, dayOffset);
  const untilDateTime = addDays(until, untilDayOffset);

  if (departureDateTime.compare(untilDateTime) >= 0) {
    return newServiceJourneys;
  }

  const { id, passingTimes, dayTypesRefs, ...copyableServiceJourney } =
    serviceJourney;

  const minutesOffset = duration.toMinutes(repeatDuration);

  const newPassingTimes = offsetPassingTimes(
    passingTimes.map(({ id, ...pt }) => pt),
    minutesOffset,
  );

  const newServiceJourney = {
    ...cloneDeep(copyableServiceJourney),
    id: `new_${createUuid()}`,
    name: nameTemplate.replace(
      '<% number %>',
      (newServiceJourneys.length + 1).toString(),
    ),
    dayTypesRefs,
    passingTimes: newPassingTimes,
  };
  newServiceJourneys.push(newServiceJourney);

  // Calculate next departure time
  const nextDeparture = departure.add({ minutes: minutesOffset });
  const nextDayOffset =
    dayOffset + (nextDeparture.hour < departure.hour ? 1 : 0);

  return copyServiceJourney(
    newServiceJourney,
    newServiceJourneys,
    nameTemplate,
    nextDeparture.toString(),
    nextDayOffset,
    untilTime,
    untilDayOffset,
    repeatDuration,
  );
};

export default ({ open, serviceJourney, onSave, onDismiss }: Props) => {
  const defaultDepartureTime =
    serviceJourney.passingTimes[0].departureTime || '00:00:00';
  const defaultDayOffset =
    serviceJourney.passingTimes[0].departureDayOffset || 0;

  const [nameTemplate, setNameTemplate] = useState<string>(
    `${serviceJourney.name || 'New'} (<% number %>)`,
  );
  const [initialDepartureTime, setInitialDepartureTime] =
    useState<string>(defaultDepartureTime);
  const [initialDayOffset, setInitialDayOffset] =
    useState<number>(defaultDayOffset);
  const [repeatDuration, setRepeatDuration] = useState<string>('PT1H');
  const [untilTime, setUntilTime] = useState<string>(defaultDepartureTime);
  const [untilDayOffset, setUntilDayOffset] =
    useState<number>(defaultDayOffset);

  const [validationError, setValidationError] = useState<ValidationError>({});

  const [multiple, setMultiple] = useState<boolean>(false);

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (
      isBefore(
        untilTime,
        untilDayOffset,
        initialDepartureTime,
        initialDayOffset,
      )
    ) {
      setValidationError({
        ...validationError,
        untilTimeIsNotAfterInitialTime: formatMessage({
          id: 'copyServiceJourneyDialogValidationUntilTimeBeforeInitialTimeError',
        }),
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
        duration.parse(repeatDuration),
      ),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      maxWidth="sm"
      fullWidth
      className="copy-dialog"
    >
      <DialogTitle>
        {formatMessage({ id: 'copyServiceJourneyDialogTitle' })}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={formatMessage({
            id: 'copyServiceJourneyDialogNameTemplateLabel',
          })}
          className="copy-dialog-wide-element"
          value={nameTemplate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameTemplate(e.target.value)
          }
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        />

        <div className="copy-dialog-section">
          <div className="copy-dialog-inputs">
            <div className="copy-dialog-timepicker">
              <TimePicker
                label={formatMessage({
                  id: 'copyServiceJourneyDialogDepartureTimeLabel',
                })}
                value={toDate(initialDepartureTime)}
                onChange={(date: Date | null) => {
                  if (date != null) {
                    const time = date.toTimeString().split(' ')[0];
                    if (time) {
                      setInitialDepartureTime(time);
                    }
                  }
                }}
              />
            </div>
            <DayOffsetDropdown
              value={initialDayOffset}
              onChange={(value) => setInitialDayOffset(value!)}
            />
          </div>
        </div>
        <div className="copy-dialog-section">
          <FormControlLabel
            control={
              <Switch
                checked={multiple}
                onChange={() => setMultiple(!multiple)}
              />
            }
            label={formatMessage({
              id: 'copyServiceJourneyDialogMultipleSwitchLabel',
            })}
          />
        </div>
        {multiple && (
          <>
            <div className="copy-dialog-section">
              <Typography variant="body2" sx={{ mb: 1 }}>
                {formatMessage({
                  id: 'copyServiceJourneyDialogIntervalLabel',
                })}
              </Typography>
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
                <div className="copy-dialog-timepicker">
                  <TimePicker
                    label={formatMessage({
                      id: 'copyServiceJourneyDialogLatestPossibleDepartureTimelabel',
                    })}
                    value={toDate(untilTime)}
                    onChange={(date: Date | null) => {
                      if (date != null) {
                        const time = date.toTimeString().split(' ')[0];
                        if (time) {
                          setUntilTime(time);
                        }
                      }
                    }}
                  />
                </div>
                <DayOffsetDropdown
                  value={untilDayOffset}
                  onChange={(value) => setUntilDayOffset(value!)}
                />
              </div>
              {validationError.untilTimeIsNotAfterInitialTime && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {validationError.untilTimeIsNotAfterInitialTime}
                </Typography>
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => onDismiss()}>
          {formatMessage({ id: 'copyServiceJourneyDialogCancelButtonText' })}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => save()}
          disabled={Object.keys(validationError).length > 0}
        >
          {formatMessage({ id: 'copyServiceJourneyDialogSaveButtonText' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
