import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DestinationDisplay, StopPoint } from 'model';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { getIntl } from 'i18n';
import { DeleteIcon } from '@entur/icons';
import './styles.scss';
import searchForQuay from './searchForQuay';
import { ExpandableText } from '@entur/expand';
import debounce from './debounce';
import { DEFAULT_SELECT_VALUE } from './constants';
import Form from './Form';
import validateForm from './validateForm';
import messages from '../../messages';

class StopPointEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    errors: { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] },
    quaySearch: {},
    isDeleteDialogOpen: false
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
    const { flexibleStopPlaces, stopPoint, isFirst, intl } = this.props;
    const { stopPlaceSelection, quaySearch, errors } = this.state;
    const translations = getIntl({ intl });

    if (!stopPoint) {
      return null;
    }

    return (
      <div className="stop-point-editor">
        <SecondaryButton
          className="delete-button"
          onClick={() =>
            this.setState({ ...this.state, isDeleteDialogOpen: true })
          }
        >
          <DeleteIcon inline /> {translations.formatMessage(messages.delete)}
        </SecondaryButton>

        <Form
          frontTextRequired={isFirst}
          flexibleStopPlaces={flexibleStopPlaces}
          stopPlaceSelection={stopPlaceSelection}
          quaySearch={quaySearch}
          errors={errors}
          handleStopPlaceSelectionChange={this.handleStopPlaceSelectionChange}
          handleFieldChange={this.onFieldChange}
          debouncedSearchForQuay={this.debouncedSearchForQuay}
          handleFrontTextChange={this.handleFrontTextChange}
          stopPoint={stopPoint}
        />

        <ExpandableText title="Bestilling">
          {' '}
          {/* TODO: Translate */}
          <BookingArrangementEditor
            bookingArrangement={stopPoint.bookingArrangement}
            onChange={b => this.onFieldChange('bookingArrangement', b)}
          />
        </ExpandableText>

        <ConfirmDialog
          isOpen={this.state.isDeleteDialogOpen}
          title={formatMessage(messages.deleteStopPlaceDialogTitle)}
          message={formatMessage(messages.deleteStopPlaceDialogMessage)}
          buttons={[
            <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
              {/* {formatMessage(messages.deleteStopPlaceDialogCancelButtonText)} */}
              no
            </SecondaryButton>,
            <SuccessButton key={1} onClick={handleDelete}>
              {/* {formatMessage(messages.deleteStopPlaceDialogConfirmButtonText)} */}
              yes
            </SuccessButton>
          ]}
          onDismiss={() =>
            this.setState({ ...this.state, isDeleteDialogOpen: false })
          }
        />
      </div>
    );
  }
}

StopPointEditor.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  stopPoint: PropTypes.instanceOf(StopPoint).isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces, intl }) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(StopPointEditor);
