import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFlexibleLineById,
  saveFlexibleLine,
} from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import BookingArrangementEditor, {
  bookingArrangementIsValid,
} from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import General from './General';
import { setSavedChanges } from 'actions/editor';
import { withRouter } from 'react-router-dom';
import { selectIntl } from 'i18n';
import { Organisation } from 'reducers/organisations';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import ServiceJourneysEditor from './ServiceJourneys';
import { changeElementAtIndex } from 'helpers/arrays';
import NavigationButtons from './NavigationButtons';
import FlexibleLine from 'model/FlexibleLine';
import { validJourneyPattern } from './JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from './ServiceJourneys/Editor/validate';
import { aboutLineStepIsValid } from 'scenes/Lines/scenes/Editor/validateForm';
import { Network } from 'model/Network';
import { SmallAlertBox } from '@entur/alert';
import './styles.scss';

type Props = RouteComponentProps<MatchParams> & {
  activeStep: number;
  setActiveStep: (index: number) => void;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  networks: Network[];
  operators: Organisation[];
  steps: string[];
  isEdit: boolean;
};

const FlexibleLineEditor = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const dispatch = useDispatch<any>();

  const goToLines = () => props.history.push('/lines');

  const currentStepIsValid = (
    currentStep: number,
    flexibleLine: FlexibleLine
  ) => {
    if (currentStep === 0) return aboutLineStepIsValid(flexibleLine);
    else if (currentStep === 1)
      return validJourneyPattern(flexibleLine.journeyPatterns);
    else if (currentStep === 2)
      return validServiceJourneys(
        flexibleLine.journeyPatterns?.[0].serviceJourneys
      );
    else if (currentStep === 3)
      return bookingArrangementIsValid(flexibleLine.bookingArrangement ?? {});
    else return false;
  };

  const invalidSteps = props.steps.filter(
    (step, i) => !currentStepIsValid(i, props.flexibleLine)
  );

  const otherStepsHasError =
    invalidSteps.length > 0 &&
    !invalidSteps.includes(props.steps[props.activeStep]);

  const handleOnSaveClick = () => {
    const valid = invalidSteps.length === 0;

    setNextClicked(true);
    if (valid) {
      setSaving(true);
      dispatch(saveFlexibleLine(props.flexibleLine))
        .then(() => !props.isEdit && goToLines())
        .finally(() => setSaving(false));
      dispatch(setSavedChanges(true));
      setNextClicked(false);
    }
  };

  const handleDelete = () => {
    if (props.flexibleLine.id) {
      setDeleting(true);
      dispatch(deleteFlexibleLineById(props.flexibleLine.id)).then(() =>
        goToLines()
      );
    }
  };

  const onNextClicked = () => {
    if (currentStepIsValid(props.activeStep, props.flexibleLine)) {
      props.setActiveStep(props.activeStep + 1);
      setNextClicked(false);
    } else {
      setNextClicked(true);
    }
  };

  return (
    <div className="line-editor">
      <OverlayLoader
        className=""
        isLoading={isSaving || isDeleting}
        text={
          isSaving
            ? formatMessage('editorSaveLineLoadingText')
            : formatMessage('editorDeleteLineLoadingText')
        }
      >
        <div className="editor-pages">
          {props.activeStep === 0 && (
            <>
              <section className="general-line-info">
                <General
                  flexibleLine={props.flexibleLine}
                  operators={props.operators}
                  networks={props.networks}
                  flexibleLineChange={props.changeFlexibleLine}
                  spoilPristine={nextClicked}
                />
              </section>
            </>
          )}

          {props.activeStep === 1 && (
            <section>
              <JourneyPatternsEditor
                journeyPatterns={props.flexibleLine.journeyPatterns ?? []}
                onChange={(jps) =>
                  props.changeFlexibleLine({
                    ...props.flexibleLine,
                    journeyPatterns: jps,
                  })
                }
                flexibleLineType={props.flexibleLine.flexibleLineType}
                spoilPristine={nextClicked}
              />
            </section>
          )}

          {props.activeStep === 2 && props.flexibleLine.journeyPatterns?.[0] && (
            <section>
              <ServiceJourneysEditor
                serviceJourneys={
                  props.flexibleLine.journeyPatterns[0].serviceJourneys
                }
                stopPoints={
                  props.flexibleLine.journeyPatterns[0].pointsInSequence
                }
                spoilPristine={nextClicked}
                flexibleLineType={props.flexibleLine.flexibleLineType}
                onChange={(sjs) =>
                  props.changeFlexibleLine({
                    ...props.flexibleLine,
                    journeyPatterns: changeElementAtIndex(
                      props.flexibleLine.journeyPatterns!,
                      {
                        ...props.flexibleLine.journeyPatterns![0],
                        serviceJourneys: sjs,
                      },
                      0
                    ),
                  })
                }
              />
            </section>
          )}

          {props.activeStep === 3 && (
            <section>
              <BookingArrangementEditor
                bookingArrangement={props.flexibleLine.bookingArrangement ?? {}}
                onChange={(b) =>
                  props.changeFlexibleLine({
                    ...props.flexibleLine,
                    bookingArrangement: b,
                  })
                }
                spoilPristine={nextClicked}
              />
            </section>
          )}

          {otherStepsHasError && nextClicked && props.isEdit && (
            <SmallAlertBox
              className="step-errors"
              variant="error"
              width="fit-content"
            >
              {formatMessage('fixErrorsInTheFollowingSteps')}
              {invalidSteps.join(', ')}
            </SmallAlertBox>
          )}

          <NavigationButtons
            editMode={props.isEdit}
            lastStep={props.activeStep === props.steps.length - 1}
            onDelete={handleDelete}
            onSave={handleOnSaveClick}
            onNext={onNextClicked}
          />
        </div>
      </OverlayLoader>
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
