import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';
import { DestinationDisplay, StopPoint } from 'model';
import { isBlank } from 'helpers/forms';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import Header from './Header';
import './styles.scss';
import searchForQuay from './searchForQuay';
import debounce from './debounce';
import { DEFAULT_SELECT_VALUE } from './constants';
import Form from './Form';
import validateForm from './validateForm';

class StopPointEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    errors: { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] },
    quaySearch: {}
  };

  componentDidMount() {
    if (!this.props.stopPoint) {
      return;
    }
    this.setState({
      stopPlaceSelection: this.props.stopPoint.flexibleStopPlaceRef
    });
  }

  onFieldChange = (field, value) => {
    const { stopPoint, onChange } = this.props;
    onChange(stopPoint.withFieldChange(field, value));
  };

  handleStopPlaceSelectionChange = stopPlaceSelection => {
    this.onFieldChange(
      'flexibleStopPlaceRef',
      stopPlaceSelection !== DEFAULT_SELECT_VALUE ? stopPlaceSelection : null
    );
    this.setState({ stopPlaceSelection });
  };

  handleFrontTextChange = frontText => {
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
    if (isBlank(quayRef)) {
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
    const { stopPlaceSelection, quaySearch, errors } = this.state;

    if (!stopPoint) {
      return null;
    }

    return (
      <div className="stop-point-editor">
        <Header
          isEditMode={isEditMode}
          onSave={this.onSave}
          saveDisabled={
            isFirst && isBlank(stopPoint.destinationDisplay?.frontText)
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
                stopPlaceSelection={stopPlaceSelection}
                quaySearch={quaySearch}
                errors={errors}
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

StopPointEditor.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  stopPoint: PropTypes.instanceOf(StopPoint).isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(StopPointEditor);
