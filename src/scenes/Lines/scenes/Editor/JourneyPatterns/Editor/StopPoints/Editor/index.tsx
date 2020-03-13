import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { DestinationDisplay, StopPoint } from 'model';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from 'scenes/Lines/scenes/Editor/BookingArrangementEditor';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { getIntl } from 'i18n';
import { DeleteIcon } from '@entur/icons';
import './styles.scss';
import searchForQuay, { QuaySearch } from './searchForQuay';
import debounce from './debounce';
import Form from './Form';
import validateForm from './validateForm';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import messages from '../../messages';
import { GlobalState } from 'reducers';

export type StopPlaceSelectionType = string | null;
export type StopPointsFormError = {
  quayRef: any;
  flexibleStopPlaceRefAndQuayRef: any;
  frontText: any;
};

type Props = {
  isFirst: boolean;
  stopPoint: StopPoint;
  onChange: (stopPoint: any) => void;
  deleteStopPoint: () => void;
  setIsValidStopPoints: (isValid: boolean) => void;
  flexibleStopPlaces: FlexibleStopPlace[];
};

type StateProps = {
  intl: any;
};

const StopPointEditor = (props: Props & StateProps) => {
  const {
    flexibleStopPlaces,
    stopPoint,
    isFirst,
    intl,
    onChange,
    setIsValidStopPoints,
    deleteStopPoint
  } = props;

  const [stopPlaceSelection, setStopPlaceSelection] = useState<
    StopPlaceSelectionType
  >(stopPoint.flexibleStopPlaceRef ?? null);
  const [errors, setErrors] = useState<StopPointsFormError>({
    quayRef: [],
    flexibleStopPlaceRefAndQuayRef: [],
    frontText: []
  });
  const [quaySearch, setQuaySearch] = useState<QuaySearch | undefined>(
    undefined
  );
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onFieldChange = (field: string, value: any) => {
    const newStopPoint = stopPoint.withFieldChange(field, value);
    onChange(newStopPoint);
    checkFormErrors(newStopPoint, isFirst);
  };

  const handleStopPlaceSelectionChange = (
    selectedStopPlace: StopPlaceSelectionType
  ) => {
    onFieldChange('flexibleStopPlaceRef', selectedStopPlace);
    setStopPlaceSelection(selectedStopPlace);
  };

  const handleFrontTextChange = (frontText: string) => {
    const destinationDisplay = stopPoint.destinationDisplay
      ? stopPoint.destinationDisplay.withFieldChange('frontText', frontText)
      : new DestinationDisplay({ frontText });
    onFieldChange('destinationDisplay', destinationDisplay);
  };

  const checkFormErrors = (stopPoint: StopPoint, isFirst: boolean) => {
    const [valid, errors] = validateForm(stopPoint, isFirst);

    setErrors(errors);
    setIsValidStopPoints(valid);
  };

  const debouncedSearchForQuay = useCallback(
    debounce(async (quayRef: string) => {
      if (isBlank(quayRef)) return setQuaySearch({});

      const quaySearch = await searchForQuay(quayRef);
      setQuaySearch(quaySearch);
    }, 1000),
    []
  );

  const translations = getIntl({ intl });

  return (
    <div className="stop-point-editor">
      <SecondaryButton
        className="delete-button"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <DeleteIcon inline /> {translations.formatMessage(messages.delete)}
      </SecondaryButton>

      <Form
        frontTextRequired={isFirst}
        flexibleStopPlaces={flexibleStopPlaces}
        stopPlaceSelection={stopPlaceSelection}
        quaySearch={quaySearch}
        errors={errors}
        handleStopPlaceSelectionChange={handleStopPlaceSelectionChange}
        handleFieldChange={onFieldChange}
        debouncedSearchForQuay={debouncedSearchForQuay}
        handleFrontTextChange={handleFrontTextChange}
        stopPoint={stopPoint}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={translations.formatMessage(messages.stopPointDeleteTitle)}
        message={translations.formatMessage(messages.stopPointDeleteMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {translations.formatMessage(messages.no)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={deleteStopPoint}>
            {translations.formatMessage(messages.yes)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = ({ intl }: GlobalState): StateProps => ({
  intl
});

export default connect(mapStateToProps)(StopPointEditor);
