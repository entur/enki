import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DestinationDisplay, StopPoint } from 'model';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { getIntl } from 'i18n';
import { DeleteIcon } from '@entur/icons';
import './styles.scss';
import { ExpandableText } from '@entur/expand';
import searchForQuay, { QuaySearch } from './searchForQuay';
import debounce from './debounce';
import { DEFAULT_SELECT_VALUE } from './constants';
import Form from './Form';
import validateForm from './validateForm';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import messages from '../../messages';

export type StopPlaceSelectionType = string | null;

type Props = {
  isFirst: boolean;
  stopPoint: StopPoint;
  onChange: (stopPoint: any) => void;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
  intl: any;
};

type State = {
  stopPlaceSelection: StopPlaceSelectionType;
  errors: {
    quayRef: any[];
    flexibleStopPlaceRefAndQuayRef: any[];
    frontText: any[];
  };
  quaySearch: QuaySearch | undefined;
  isDeleteDialogOpen: boolean;
};

class StopPointEditor extends Component<Props & StateProps> {
  state: State = {
    stopPlaceSelection:
      this.props.stopPoint.flexibleStopPlaceRef ?? DEFAULT_SELECT_VALUE,
    errors: { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] },
    quaySearch: undefined,
    isDeleteDialogOpen: false
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

  // onSave = async () => {
  //   let [valid, errors] = await validateForm(
  //     this.props.stopPoint,
  //     this.props.stopPointIndex
  //   );

  //   this.setState({ errors }, () => {
  //     if (valid) {
  //       this.props.onSave();
  //     }
  //   });
  // };

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
    const translations = getIntl({ intl });

    // const firstElementHasFrontText =
    //   isFirst && isBlank(stopPoint.destinationDisplay?.frontText);
    // const stopPlaceAndQuaySearchAreEmpty =
    //   (this.state.stopPlaceSelection ?? '-1') === '-1' &&
    //   objectValuesAreEmpty(this.state.quaySearch ?? {});

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
          stopPlaceSelection={this.state.stopPlaceSelection}
          quaySearch={this.state.quaySearch}
          errors={this.state.errors}
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
          title={translations.formatMessage(messages.create)}
          message={translations.formatMessage(messages.create)}
          buttons={[
            <SecondaryButton key={2} onClick={() => undefined}>
              {/* {formatMessage(messages.deleteStopPlaceDialogCancelButtonText)} */}
              no
            </SecondaryButton>,
            <SuccessButton key={1} onClick={() => undefined}>
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

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl
});

export default connect(mapStateToProps)(StopPointEditor);
