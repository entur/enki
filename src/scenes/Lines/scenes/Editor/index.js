import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SuccessButton,
  PrimaryButton,
  NegativeButton,
  SecondaryButton
} from '@entur/button';
import { Stepper } from '@entur/menu';
import { FlexibleLine } from 'model';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import {
  deleteFlexibleLineById,
  loadFlexibleLineById,
  saveFlexibleLine
} from 'actions/flexibleLines';
import { loadNetworks } from 'actions/networks';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import OverlayLoader from 'components/OverlayLoader';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import validateForm from './validateForm';
import './styles.scss';
import General from './General';
import { setSavedChanges } from 'actions/editor';
import { withRouter } from 'react-router-dom';
import { selectIntl } from 'i18n';
import { createSelector } from 'reselect';
import messages from './messages';
import { filterNetexOperators } from 'reducers/organisations';

const selectFlexibleLine = createSelector(
  state => state.flexibleLines,
  (_, match) => match,
  (flexibleLines, match) =>
    (match.params.id && flexibleLines?.find(l => l.id === match.params.id)) ||
    new FlexibleLine({
      transportMode: VEHICLE_MODE.BUS,
      transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS
    })
);

function useLoadDependencies(match, history) {
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [
    flexibleStopPlacesIsLoading,
    setFlexibleStopPlacesIsLoading
  ] = useState(true);

  const dispatch = useDispatch();

  const dispatchLoadFlexibleStopPlaces = useCallback(
    () =>
      dispatch(loadFlexibleStopPlaces()).then(() =>
        setFlexibleStopPlacesIsLoading(false)
      ),
    [dispatch]
  );

  const dispatchLoadNetworks = useCallback(
    () => dispatch(loadNetworks()).then(() => setNetworksIsLoading(false)),
    [dispatch]
  );

  const dispatchLoadFlexibleLineById = useCallback(() => {
    if (match.params.id) {
      dispatch(loadFlexibleLineById(match.params.id))
        .catch(() => history.push('/lines'))
        .then(() => setFlexibleLineIsLoading(false));
    } else {
      setFlexibleLineIsLoading(false);
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadFlexibleLineById();
    dispatchLoadFlexibleStopPlaces();
  }, [
    dispatchLoadNetworks,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById
  ]);
  return (
    networksIsLoading || flexibleLineIsLoading || flexibleStopPlacesIsLoading
  );
}

const useFlexibleLine = match => {
  const savedLine = useSelector(state => selectFlexibleLine(state, match));
  const [flexibleLine, setFlexibleLine] = useState(null);
  useEffect(() => {
    setFlexibleLine(savedLine);
  }, [savedLine]);

  const handleNetworkSelectionChange = networkSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange('networkRef', networkSelection)
    );
  };

  const handleOperatorSelectionChange = operatorSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange('operatorRef', operatorSelection)
    );
  };

  const onFieldChange = useCallback(
    (field, value, multi = false) => {
      setFlexibleLine(flexibleLine.withFieldChange(field, value, multi));
    },
    [flexibleLine]
  );

  return {
    handleNetworkSelectionChange,
    handleOperatorSelectionChange,
    onFieldChange,
    flexibleLine
  };
};

const FlexibleLineEditor = ({ match, history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const organisations = useSelector(({ organisations }) => organisations);
  const networks = useSelector(({ networks }) => networks);
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);
  const FLEXIBLE_LINE_STEPS = [
    formatMessage(messages.stepperAbout),
    formatMessage(messages.stepperJourneyPattern),
    formatMessage(messages.stepperBooking)
  ];

  const {
    handleNetworkSelectionChange,
    handleOperatorSelectionChange,
    onFieldChange,
    flexibleLine
  } = useFlexibleLine(match);

  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState(validateForm(flexibleLine));
  const [isValidServiceJourney, setIsValidServiceJourney] = useState(true);
  const [isValidStopPoints, setIsValidStopPoints] = useState(true);

  useEffect(() => {
    setErrors(validateForm(flexibleLine));
  }, [flexibleLine]);

  const goToLines = () => history.push('/lines');

  const dispatch = useDispatch();
  const isLoadingDependencies = useLoadDependencies(match, history);

  const handleOnSaveClick = () => {
    const valid = validateForm(flexibleLine).isValid;

    if (valid && isValidServiceJourney) {
      setSaving(true);
      dispatch(saveFlexibleLine(flexibleLine))
        .then(() => goToLines())
        .finally(() => setSaving(false));
      dispatch(setSavedChanges(true));
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteFlexibleLineById(flexibleLine.id)).then(() => goToLines());
  };

  const operators = filterNetexOperators(organisations);
  const isLoadingLine = !flexibleLine;
  const isEdit = match.params.id;
  const isDeleteDisabled = isLoadingLine || isLoadingDependencies || isDeleting;

  const onStepClicked = (stepIndexClicked, isInEditMode) => {
    const allowPreviousStepClick = activeStepperIndex > stepIndexClicked;
    if (isInEditMode || allowPreviousStepClick) {
      setActiveStepperIndex(stepIndexClicked);
    }
  };

  return (
    <div className="line-editor">
      <div className="header">
        <PageHeader
          withBackButton
          onBackButtonClick={
            activeStepperIndex === 0
              ? () => goToLines()
              : () => setActiveStepperIndex(activeStepperIndex - 1)
          }
          backButtonTitle={
            activeStepperIndex === 0
              ? formatMessage(messages.linesMenuItemLabel)
              : FLEXIBLE_LINE_STEPS[activeStepperIndex - 1]
          }
        />
        <Stepper
          steps={FLEXIBLE_LINE_STEPS}
          activeIndex={activeStepperIndex}
          onStepClick={index => onStepClicked(index, isEdit)}
        />
      </div>

      {!isLoadingLine && !isLoadingDependencies ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.saveLineLoadingText)
              : formatMessage(messages.deleteLineLoadingText)
          }
        >
          {activeStepperIndex === 0 && (
            <section className="general-line-info">
              <General
                flexibleLine={flexibleLine}
                networks={networks}
                operators={operators}
                errors={errors}
                networkSelection={flexibleLine.networkRef}
                operatorSelection={flexibleLine.operatorRef}
                handleFieldChange={onFieldChange}
                handleNetworkSelectionChange={handleNetworkSelectionChange}
                handleOperatorSelectionChange={handleOperatorSelectionChange}
              />

              <PrimaryButton
                onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                disabled={!errors.isValid}
                className="next-button"
              >
                {formatMessage(messages.saveAndContinue)}
              </PrimaryButton>
            </section>
          )}

          {activeStepperIndex === 1 && (
            <section>
              <JourneyPatternsEditor
                journeyPatterns={flexibleLine.journeyPatterns}
                onChange={jps => onFieldChange('journeyPatterns', jps)}
                setIsValidServiceJourney={setIsValidServiceJourney}
                setIsValidStopPoints={setIsValidStopPoints}
              />

              <PrimaryButton
                onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                disabled={!isValidStopPoints || !isValidServiceJourney}
                className="next-button"
              >
                {formatMessage(messages.saveAndContinue)}
              </PrimaryButton>
            </section>
          )}

          {activeStepperIndex === 2 && (
            <section>
              <BookingArrangementEditor
                bookingArrangement={flexibleLine.bookingArrangement ?? {}}
                onChange={b => onFieldChange('bookingArrangement', b)}
              />
            </section>
          )}

          {activeStepperIndex === FLEXIBLE_LINE_STEPS.length - 1 && (
            <div className="buttons">
              {isEdit && (
                <NegativeButton
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleteDisabled}
                >
                  {formatMessage(messages.deleteButtonText)}
                </NegativeButton>
              )}
              <PrimaryButton
                onClick={handleOnSaveClick}
                disabled={!isValidServiceJourney || !isValidStopPoints}
              >
                {formatMessage(messages.saveButtonText)}
              </PrimaryButton>
            </div>
          )}
        </OverlayLoader>
      ) : (
        <Loading
          text={
            isLoadingLine
              ? formatMessage(messages.loadingLineText)
              : formatMessage(messages.loadingNetworkAndStopsText)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.deleteConfirmationDialogTitle)}
        message={formatMessage(messages.deleteConfirmationDialogMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.deleteConfirmationDialogCancelButtonText)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage(messages.deleteConfirmationDialogConfirmButtonText)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
