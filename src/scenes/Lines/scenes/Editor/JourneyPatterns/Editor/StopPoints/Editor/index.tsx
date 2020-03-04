import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';
import { DestinationDisplay, StopPoint } from 'model';
import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import Header from './Header';
import './styles.scss';
import searchForQuay, { QuaySearch } from './searchForQuay';
import debounce from './debounce';
import { DEFAULT_SELECT_VALUE } from './constants';
import Form from './Form';
import validateForm from './validateForm';
import FlexibleStopPlace from 'model/FlexibleStopPlace';

export type StopPlaceSelectionType = string | null;

type Props = {
  isFirst: boolean;
  stopPoint: StopPoint;
  onChange: (stopPoint: any) => void;
  onClose: () => void;
  onSave: () => void;
  isEditMode: boolean;
  stopPointIndex: number;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

type State = {
  stopPlaceSelection: StopPlaceSelectionType;
  errors: {
    quayRef: any[];
    flexibleStopPlaceRefAndQuayRef: any[];
    frontText: any[];
  };
  quaySearch: QuaySearch | undefined;
};

class StopPointEditor extends Component<Props & StateProps> {
  state: State = {
    stopPlaceSelection:
      this.props.stopPoint.flexibleStopPlaceRef ?? DEFAULT_SELECT_VALUE,
    errors: { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] },
    quaySearch: undefined
  };

  onFieldChange = (field: string, value: any) => {
    const { stopPoint, onChange } = this.props;
    onChange(stopPoint.withFieldChange(field, value));
  };

  handleStopPlaceSelectionChange = (
    stopPlaceSelection: StopPlaceSelectionType
  ) => {
    this.onFieldChange(
      'flexibleStopPlaceRef',
      stopPlaceSelection !== DEFAULT_SELECT_VALUE ? stopPlaceSelection : null
    );
    this.setState({ stopPlaceSelection });
  };

  handleFrontTextChange = (frontText: string) => {
    const { stopPoint } = this.props;
    const destinationDisplay = stopPoint.destinationDisplay
      ? stopPoint.destinationDisplay.withFieldChange('frontText', frontText)
      : new DestinationDisplay({ frontText });
    this.onFieldChange('destinationDisplay', destinationDisplay);
  };

  onSave = async () => {
    let [valid, errors] = await validateForm(
      this.props.stopPoint,
      this.props.stopPointIndex
    );

    this.setState({ errors }, () => {
      if (valid) {
        this.props.onSave();
      }
    });
  };

  debouncedSearchForQuay = debounce(async () => {
    const quayRef = this.props.stopPoint.quayRef;
    if (quayRef === undefined || isBlank(quayRef)) {
      this.setState({ quaySearch: {} });
    } else {
      let quaySearch = await searchForQuay(quayRef);
      this.setState({ quaySearch });
    }
  }, 1000);

  render() {
    const {
      flexibleStopPlaces,
      stopPoint,
      isEditMode,
      isFirst,
      onClose
    } = this.props;

    const firstElementHasFrontText =
      isFirst && isBlank(stopPoint.destinationDisplay?.frontText);
    const stopPlaceAndQuaySearchAreEmpty =
      (this.state.stopPlaceSelection ?? '-1') === '-1' &&
      objectValuesAreEmpty(this.state.quaySearch ?? {});

    return (
      <div className="stop-point-editor">
        <Header
          isEditMode={isEditMode}
          onSave={this.onSave}
          saveDisabled={
            firstElementHasFrontText || stopPlaceAndQuaySearchAreEmpty
          }
          onClose={onClose}
        />
        <Tabs>
          <TabList>
            <Tab>Generelt</Tab>
            <Tab>Bestilling</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form
                frontTextRequired={isFirst}
                flexibleStopPlaces={flexibleStopPlaces}
                stopPlaceSelection={this.state.stopPlaceSelection}
                quaySearch={this.state.quaySearch}
                errors={this.state.errors}
                handleStopPlaceSelectionChange={
                  this.handleStopPlaceSelectionChange
                }
                handleFieldChange={this.onFieldChange}
                debouncedSearchForQuay={this.debouncedSearchForQuay}
                handleFrontTextChange={this.handleFrontTextChange}
                stopPoint={stopPoint}
              />
            </TabPanel>
            <TabPanel>
              <BookingArrangementEditor
                bookingArrangement={stopPoint.bookingArrangement}
                onChange={b => this.onFieldChange('bookingArrangement', b)}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = ({ flexibleStopPlaces }: StateProps) => ({
  flexibleStopPlaces
});

export default connect(mapStateToProps)(StopPointEditor);
