import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@entur/component-library';
import { DestinationDisplay, StopPoint } from 'model';
import { hasValue } from 'helpers/forms';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import Header from './Header';
import './styles.scss';
import searchForQuay from './searchForQuay';
import debounce from './debounce';
import { DEFAULT_SELECT_VALUE, TABS } from './constants';
import Form from './Form';
import validateForm from './validateForm';

class StopPointEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL,
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
    let quayRef = this.props.stopPoint.quayRef;
    if (hasValue(quayRef)) {
      let quaySearch = await searchForQuay(quayRef);
      this.setState({ quaySearch });
    } else {
      this.setState({ quaySearch: {} });
    }
  }, 1000);

  render() {
    const { flexibleStopPlaces, stopPoint, isEditMode, isFirst } = this.props;
    const { stopPlaceSelection, activeTab, quaySearch, errors } = this.state;

    if (!stopPoint) {
      return null;
    }

    return (
      <div className="stop-point-editor">
        <Header isEditMode={isEditMode} onSave={this.onSave} />
        <Tabs
          selected={activeTab}
          onChange={activeTab => this.setState({ activeTab })}
        >
          <Tab value={TABS.GENERAL} label="Generelt" className="general-tab">
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
          </Tab>
          <Tab value={TABS.BOOKING} label="Bestilling" className="booking-tab">
            <BookingArrangementEditor
              bookingArrangement={stopPoint.bookingArrangement}
              onChange={b => this.onFieldChange('bookingArrangement', b)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

StopPointEditor.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  stopPoint: PropTypes.instanceOf(StopPoint).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(StopPointEditor);
