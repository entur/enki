import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { Label } from '@entur/typography';
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
import { PassingTime, StopPoint } from 'model';
import { replaceElement } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';

import './styles.scss';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlState } from 'react-intl-redux';

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
  intl: IntlState;
};

type Props = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
  setValidPassingTimes: (isTrue: boolean) => void;
};

const PassingTimesEditor = (props: Props & StateProps) => {
  const {
    stopPoints,
    passingTimes,
    intl,
    onChange,
    setValidPassingTimes
  } = props;
  const { isValid, errorMessage } = validateTimes(
    stopPoints,
    passingTimes,
    intl
  );

  useEffect(() => {
    setValidPassingTimes(isValid);
  }, [setValidPassingTimes, isValid]);

  const onFieldChange = (index: number, field: string, value: any) => {
    const newPt = passingTimes[index]
      ? passingTimes[index].withFieldChange(field, value)
      : new PassingTime({ [field]: value });
    const newPts = replaceElement(passingTimes, index, newPt);

    onChange(newPts);
  };

  const handleDayOffsetChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const parsedValue = parseInt(value);
    onFieldChange(index, field, parsedValue !== 0 ? value : undefined);
  };

  const getDayOffsetDropDown = (tpt: any, index: number, field: string) => (
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
      value={tpt && tpt[field] ? tpt[field].toString() : String(0)}
    />
  );

  const padTimePickerInput = (time: string): string | undefined => {
    if (time.length === 0) return undefined;
    return time + ':00';
  };

  const getTimePicker = (tpt: any, index: number, field: string) => {
    const currentValue = tpt && tpt[field];

    const shownValue =
      currentValue
        ?.split(':')
        .slice(0, 2)
        .join(':') || undefined;

    return (
      <TextField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFieldChange(index, field, padTimePickerInput(e.target.value))
        }
        prepend={<ClockIcon inline />}
        type="time"
        className="timepicker"
        defaultValue={shownValue}
      />
    );
  };

  const renderRow = (sp: StopPoint, i: number) => {
    const { flexibleStopPlaces, passingTimes } = props;
    const stopPlace = flexibleStopPlaces.find(
      fsp => fsp.id === sp.flexibleStopPlaceRef
    );

    const stopPlaceName = stopPlace?.name ?? sp.quayRef;
    const tpt = passingTimes[i];

    return (
      <TableRow key={i}>
        <DataCell>{i}</DataCell>
        <DataCell>{stopPlaceName}</DataCell>
        <DataCell>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Label>Tidligst</Label>
              <div style={{ display: 'flex' }}>
                <div>{getTimePicker(tpt, i, 'earliestDepartureTime')}</div>
                <div>
                  {getDayOffsetDropDown(tpt, i, 'earliestDepartureDayOffset')}
                </div>
              </div>
            </div>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{getTimePicker(tpt, i, 'arrivalTime')}</div>
                <div>{getDayOffsetDropDown(tpt, i, 'arrivalDayOffset')}</div>
              </div>
            </div>
          </div>
        </DataCell>
        <DataCell>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{getTimePicker(tpt, i, 'departureTime')}</div>
                <div>{getDayOffsetDropDown(tpt, i, 'departureDayOffset')}</div>
              </div>
            </div>
            <div>
              <Label>Senest</Label>
              <div style={{ display: 'flex' }}>
                <div>{getTimePicker(tpt, i, 'latestArrivalTime')}</div>
                <div>
                  {getDayOffsetDropDown(tpt, i, 'latestArrivalDayOffset')}
                </div>
              </div>
            </div>
          </div>
        </DataCell>
      </TableRow>
    );
  };

  const renderRows = () => {
    const { stopPoints } = props;
    return stopPoints.map((sp, i) => renderRow(sp, i));
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
            <HeaderCell>Ankomst</HeaderCell>
            <HeaderCell>Avgang</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(PassingTimesEditor);
