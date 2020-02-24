import React, { Component } from 'react';
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
import { PassingTime } from 'model';
import { replaceElement } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from './validateForm';

import './styles.scss';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';

type Props = {
  passingTimes: any[];
  stopPoints: any[];
  flexibleStopPlaces: { id: string; name: string }[];
  onChange: (pts: any[]) => void;
  setValidPassingTimes: (isTrue: boolean) => void;
  intl: any;
};

class PassingTimesEditor extends Component<Props> {
  state = {
    isValid: true,
    errorMessage: ''
  };

  componentDidMount() {
    const { passingTimes, setValidPassingTimes, intl } = this.props;
    const { isValid } = validateTimes(passingTimes, { intl });
    setValidPassingTimes(isValid);
  }

  componentDidUpdate(prevProps: Props) {
    const { passingTimes, setValidPassingTimes, intl } = this.props;
    const { isValid, errorMessage } = validateTimes(passingTimes, { intl });
    if (this.props !== prevProps) {
      this.setState({ isValid, errorMessage });
    }
    setValidPassingTimes(isValid);
  }

  onFieldChange(index: number, field: string, value: any) {
    const { passingTimes, onChange } = this.props;
    const newPt = passingTimes[index]
      ? passingTimes[index].withFieldChange(field, value)
      : new PassingTime({ [field]: value });
    const newPts = replaceElement(passingTimes, index, newPt);

    onChange(newPts);
  }

  handleDayOffsetChange(index: number, field: string, value: string) {
    const parsedValue = parseInt(value);
    this.onFieldChange(index, field, parsedValue !== 0 ? value : undefined);
  }

  getDayOffsetDropDown = (tpt: any, index: number, field: string) => (
    <Dropdown
      items={[...Array(10).keys()].map(i => ({
        value: String(i),
        label: String(i)
      }))}
      onChange={(e: NormalizedDropdownItemType | null) => {
        if (!e?.value) return;
        this.handleDayOffsetChange(index, field, e.value);
      }}
      className="hourpicker"
      value={tpt && tpt[field] ? tpt[field].toString() : String(0)}
    />
  );

  padTimePickerInput = (time: string): string | undefined => {
    if (time.length === 0) return undefined;
    return time + ':00';
  };

  getTimePicker = (tpt: any, index: number, field: string) => {
    const currentValue = tpt && tpt[field];

    const shownValue =
      currentValue
        ?.split(':')
        .slice(0, 2)
        .join(':') || undefined;

    return (
      <TextField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          this.onFieldChange(
            index,
            field,
            this.padTimePickerInput(e.target.value)
          )
        }
        prepend={<ClockIcon inline />}
        type="time"
        className="timepicker"
        value={shownValue}
      />
    );
  };

  renderRow = (sp: any, i: number) => {
    const { flexibleStopPlaces, passingTimes } = this.props;
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
                <div>{this.getTimePicker(tpt, i, 'earliestDepartureTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(
                    tpt,
                    i,
                    'earliestDepartureDayOffset'
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'departureTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'departureDayOffset')}
                </div>
              </div>
            </div>
          </div>
        </DataCell>
        <DataCell>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Label>Normalt</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'arrivalTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'arrivalDayOffset')}
                </div>
              </div>
            </div>
            <div>
              <Label>Senest</Label>
              <div style={{ display: 'flex' }}>
                <div>{this.getTimePicker(tpt, i, 'latestArrivalTime')}</div>
                <div>
                  {this.getDayOffsetDropDown(tpt, i, 'latestArrivalDayOffset')}
                </div>
              </div>
            </div>
          </div>
        </DataCell>
      </TableRow>
    );
  };

  renderRows = () => {
    const { stopPoints } = this.props;
    return stopPoints.map((sp, i) => this.renderRow(sp, i));
  };

  render() {
    const { isValid, errorMessage } = this.state;
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
          <TableBody>{this.renderRows()}</TableBody>
        </Table>
      </>
    );
  }
}

const mapStateToProps = ({
  flexibleStopPlaces,
  intl
}: {
  flexibleStopPlaces: any[];
  intl: any;
}) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(PassingTimesEditor);
