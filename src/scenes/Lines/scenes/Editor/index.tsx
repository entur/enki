import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  NegativeButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton
} from '@entur/button';
import { Stepper } from '@entur/menu';
import {
  deleteFlexibleLineById,
  saveFlexibleLine
} from 'actions/flexibleLines';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import OverlayLoader from 'components/OverlayLoader';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import validateForm from './validateForm';
import './styles.scss';
import General from 'scenes/Lines/scenes/Editor/General';
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
import {
  useFlexibleLine,
  useLoadDependencies
} from 'scenes/Lines/scenes/Editor/hooks';
import { changeElementAtIndex } from 'helpers/arrays';

const FlexibleLineEditor = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector(selectIntl);
  const networks = useSelector((state: GlobalState) => state.networks);
  const organisations = useSelector<GlobalState, OrganisationState>(
    state => state.organisations
  );
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

  const { onFieldChange, flexibleLine } = useFlexibleLine(
    match,
    isLoadingDependencies
  );

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
    if (flexibleLine.id) {
      setDeleteDialogOpen(false);
      setDeleting(true);
      dispatch(deleteFlexibleLineById(flexibleLine.id)).then(() => goToLines());
    }
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
                  networks={networks ?? []}
                  operators={operators}
                  errors={errors}
                  flexibleLineChange={onFieldChange}
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
                  journeyPatterns={flexibleLine.journeyPatterns ?? []}
                  onChange={jps =>
                    onFieldChange({ ...flexibleLine, journeyPatterns: jps })
                  }
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

            {activeStepperIndex === 2 && flexibleLine.journeyPatterns?.[0] && (
              <section>
                <ServiceJourneysEditor
                  serviceJourneys={
                    flexibleLine.journeyPatterns[0].serviceJourneys
                  }
                  stopPoints={flexibleLine.journeyPatterns[0].pointsInSequence}
                  setIsValidServiceJourney={setIsValidServiceJourney}
                  onChange={sjs =>
                    onFieldChange({
                      ...flexibleLine,
                      journeyPatterns: changeElementAtIndex(
                        flexibleLine.journeyPatterns!,
                        {
                          ...flexibleLine.journeyPatterns![0],
                          serviceJourneys: sjs
                        },
                        0
                      )
                    })
                  }
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
                  onChange={b =>
                    onFieldChange({ ...flexibleLine, bookingArrangement: b })
                  }
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
