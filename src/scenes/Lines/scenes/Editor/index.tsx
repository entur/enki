import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFlexibleLineById,
  saveFlexibleLine,
} from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import './styles.scss';
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
import { Network } from 'model/Network';
import { validJourneyPattern } from './JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from './ServiceJourneys/Editor/validate';
import { aboutLineStepIsValid } from 'scenes/Lines/scenes/Editor/validateForm';

type Props = RouteComponentProps<MatchParams> & {
  activeStep: number;
  setActiveStep: (index: number) => void;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  operators: Organisation[];
  networks: Network[];
  lastStep: boolean;
  isEdit: boolean;
};

const FlexibleLineEditor = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const dispatch = useDispatch<any>();

  const goToLines = () => props.history.push('/lines');

  const handleOnSaveClick = () => {
    const valid = aboutLineStepIsValid(props.flexibleLine);

    if (valid) {
      setSaving(true);
      dispatch(saveFlexibleLine(props.flexibleLine))
        .then(() => goToLines())
        .finally(() => setSaving(false));
      dispatch(setSavedChanges(true));
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

  const currentStepIsValid = (currentStep: number) => {
    if (currentStep === 0) return aboutLineStepIsValid(props.flexibleLine);
    else if (currentStep === 1)
      return validJourneyPattern(props.flexibleLine.journeyPatterns);
    else if (currentStep === 2)
      return validServiceJourneys(
        props.flexibleLine.journeyPatterns?.[0].serviceJourneys
      );
    else return currentStep === 3;
  };

  const onNextClicked = () => {
    if (currentStepIsValid(props.activeStep)) {
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
                  networks={props.networks}
                  operators={props.operators}
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
              />
            </section>
          )}

          <NavigationButtons
            editMode={props.isEdit}
            lastStep={props.lastStep}
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
