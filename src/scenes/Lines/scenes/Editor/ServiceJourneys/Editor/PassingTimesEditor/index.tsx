import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import { ClockIcon } from '@entur/icons';
import StopPoint from 'model/StopPoint';
import PassingTime from 'model/PassingTime';
import { replaceElement } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';

import './styles.scss';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlState } from 'react-intl-redux';
import searchForQuay from 'scenes/Lines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/searchForQuay';

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

const Title = ({ quayRef }: { quayRef: string }): ReactElement => {
  const [title, setTitle] = useState(quayRef);

  useEffect(() => {
    const fetchTitle = async () =>
      await searchForQuay(quayRef).then(response =>
        setTitle(response.stopPlace?.name.value ?? quayRef)
      );
    fetchTitle();
  }, [quayRef]);

  return <div>{title}</div>;
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
    <Dropdown
      items={[...Array(10).keys()].map(i => ({
        value: String(i),
        label: String(i)
      }))}
      onChange={(e: NormalizedDropdownItemType | null) => {
        if (!e?.value) return;
        handleDayOffsetChange(index, field, e.value);
      }}
      className="hourpicker"
      value={tpt[field]?.toString() ?? '0'}
    />
  );

  const padTimePickerInput = (time: string): string | undefined => {
    if (time.length === 0) return undefined;
    return time + ':00';
  };

  const getTimePicker = (tpt: PassingTime, index: number, field: TimeKeys) => {
    const currentValue = tpt[field];

    const shownValue =
      currentValue
        ?.split(':')
        .slice(0, 2)
        .join(':') || undefined;

    return (
      <div>
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFieldChange(index, field, padTimePickerInput(e.target.value))
          }
          prepend={<ClockIcon inline />}
          type="time"
          className="timepicker"
          defaultValue={shownValue}
        />
      </div>
    );
  };

  const renderRow = (sp: StopPoint, i: number) => {
    const passingTime = passingTimes[i];
    const { time, offset } = getPassingTimeKeys(passingTime);

    const getFetchedTitle = (stopPoint: StopPoint): ReactElement =>
      stopPoint.quayRef ? (
        <Title quayRef={stopPoint.quayRef} />
      ) : (
        <div>
          {flexibleStopPlaces?.find(
            stop => stop.id === stopPoint.flexibleStopPlaceRef
          )?.name ?? ''}
        </div>
      );

    return (
      <TableRow key={i}>
        <DataCell>{i}</DataCell>
        <DataCell>{getFetchedTitle(sp)}</DataCell>
        <DataCell>
          <div style={{ display: 'flex' }}>
            {getTimePicker(passingTime, i, time)}
            {getDayOffsetDropdown(passingTime, i, offset)}
          </div>
        </DataCell>
      </TableRow>
    );
  };

  return (
    <>
      {!isValid && (
        <SmallAlertBox variant="error"> {errorMessage} </SmallAlertBox>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Stoppested</HeaderCell>
            <HeaderCell>Passeringstid</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{stopPoints.map((sp, i) => renderRow(sp, i))}</TableBody>
      </Table>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(PassingTimesEditor);
