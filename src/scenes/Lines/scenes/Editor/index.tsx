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
import messages from './messages';
import {
  filterNetexOperators,
  OrganisationState
} from 'reducers/organisations';
import { GlobalState } from 'reducers';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { isBlank } from 'helpers/forms';
import ServiceJourneysEditor from 'scenes/Lines/scenes/Editor/ServiceJourneys';
import { FlexibleLinesState } from 'reducers/flexibleLines';

const useLoadDependencies = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [
    flexibleStopPlacesIsLoading,
    setFlexibleStopPlacesIsLoading
  ] = useState(true);

  const dispatch = useDispatch<any>();

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
};

const getFlexibleLineFromPath = (
  flexibleLines: FlexibleLinesState,
  match: { params: MatchParams }
) =>
  flexibleLines?.find(flexibleLine => flexibleLine.id === match.params.id) ??
  new FlexibleLine({
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS
  });

const useFlexibleLine = (
  match: { params: MatchParams },
  loadDependencies: boolean
) => {
  const [flexibleLine, setFlexibleLine] = useState<FlexibleLine>(
    new FlexibleLine({
      transportMode: VEHICLE_MODE.BUS,
      transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS
    })
  );

  const flexibleLines = useSelector<GlobalState, FlexibleLinesState>(
    state => state.flexibleLines
  );

  useEffect(() => {
    setFlexibleLine(getFlexibleLineFromPath(flexibleLines, match));
  }, [loadDependencies, flexibleLines, match]);

  const handleNetworkSelectionChange = (networkSelection: string) => {
    setFlexibleLine(
      flexibleLine.withFieldChange('networkRef', networkSelection)
    );
  };

  const handleOperatorSelectionChange = (operatorSelection: string) => {
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

const FlexibleLineEditor = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector(selectIntl);
  const organisations = useSelector<GlobalState, OrganisationState>(
    state => state.organisations
  );
  const networks = useSelector((state: GlobalState) => state.networks);
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);
  const FLEXIBLE_LINE_STEPS = [
    formatMessage(messages.stepperAbout),
    formatMessage(messages.stepperJourneyPattern),
    formatMessage(messages.stepperServiceJourney),
    formatMessage(messages.stepperBooking)
  ];

  const isLoadingDependencies = useLoadDependencies({
    match: match,
    history: history
  } as RouteComponentProps<MatchParams>);

  const {
    handleNetworkSelectionChange,
    handleOperatorSelectionChange,
    onFieldChange,
    flexibleLine
  } = useFlexibleLine(match, isLoadingDependencies);

  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState(validateForm(flexibleLine));
  const [isValidServiceJourney, setIsValidServiceJourney] = useState(true);
  const [isValidJourneyPattern, setIsValidJourneyPattern] = useState(true);

  useEffect(() => {
    setErrors(validateForm(flexibleLine));
  }, [flexibleLine]);

  const goToLines = () => history.push('/lines');

  const dispatch = useDispatch<any>();

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

  const operators = filterNetexOperators(organisations ?? []);
  const isLoadingLine = !flexibleLine;
  const isEdit = !isBlank(match.params.id);
  const isDeleteDisabled = isLoadingLine || isLoadingDependencies || isDeleting;

  const onStepClicked = (stepIndexClicked: number, isInEditMode: boolean) => {
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
          className=""
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.saveLineLoadingText)
              : formatMessage(messages.deleteLineLoadingText)
          }
        >
          <div className="editor-pages">
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
                  setIsValidJourneyPattern={setIsValidJourneyPattern}
                />

                <PrimaryButton
                  onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                  disabled={!isValidJourneyPattern}
                  className="next-button"
                >
                  {formatMessage(messages.saveAndContinue)}
                </PrimaryButton>
              </section>
            )}

            {activeStepperIndex === 2 && (
              <section>
                <ServiceJourneysEditor
                  serviceJourneys={
                    flexibleLine.journeyPatterns[0].serviceJourneys
                  }
                  stopPoints={flexibleLine.journeyPatterns[0].pointsInSequence}
                  onChange={sjs => {
                    const newJourneyPattern = flexibleLine.journeyPatterns[0].withFieldChange(
                      'serviceJourneys',
                      sjs
                    );
                    onFieldChange('journeyPatterns', [newJourneyPattern]);
                  }}
                  setIsValidServiceJourney={setIsValidServiceJourney}
                />

                <PrimaryButton
                  onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                  disabled={!isValidServiceJourney}
                  className="next-button"
                >
                  {formatMessage(messages.saveAndContinue)}
                </PrimaryButton>
              </section>
            )}

            {activeStepperIndex === 3 && (
              <section>
                <BookingArrangementEditor
                  bookingArrangement={flexibleLine.bookingArrangement ?? {}}
                  onChange={b => onFieldChange('bookingArrangement', b)}
                />
              </section>
            )}
          </div>
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
                disabled={!isValidServiceJourney || !isValidJourneyPattern}
              >
                {formatMessage(messages.saveButtonText)}
              </PrimaryButton>
            </div>
          )}
        </OverlayLoader>
      ) : (
        <Loading
          className=""
          children={null}
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
