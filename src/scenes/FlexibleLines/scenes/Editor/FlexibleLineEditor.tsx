import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoader from 'components/OverlayLoader';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import General from './General';
import { withRouter } from 'react-router-dom';
import { selectIntl } from 'i18n';
import { Organisation } from 'reducers/organisations';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import ServiceJourneysEditor from './ServiceJourneys';
import { changeElementAtIndex } from 'helpers/arrays';
import FlexibleLine from 'model/FlexibleLine';
import { currentStepIsValid } from 'scenes/FlexibleLines/scenes/Editor/validateForm';
import { Network } from 'model/Network';
import { SmallAlertBox } from '@entur/alert';
import './styles.scss';
import { LINE_STEP } from './steps';

type Props = RouteComponentProps<MatchParams> & {
  activeStep: number;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  networks: Network[];
  operators: Organisation[];
  isEdit: boolean;
  spoilPristine: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isFlexibleLine: boolean;
  steps: LINE_STEP[];
};

const FlexibleLineEditor = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const invalidSteps = props.steps.filter(
    (step, i) =>
      !currentStepIsValid(i, props.flexibleLine, props.isFlexibleLine)
  );

  const otherStepsHasError =
    invalidSteps.length > 0 &&
    !invalidSteps.includes(props.steps[props.activeStep]);

  return (
    <div className="line-editor">
      <OverlayLoader
        className=""
        isLoading={props.isSaving || props.isDeleting}
        text={
          props.isSaving
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
                  spoilPristine={props.spoilPristine}
                  isFlexibleLine={props.isFlexibleLine}
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
                spoilPristine={props.spoilPristine}
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
                spoilPristine={props.spoilPristine}
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
                spoilPristine={props.spoilPristine}
              />
            </section>
          )}

          {otherStepsHasError && props.spoilPristine && props.isEdit && (
            <SmallAlertBox
              className="step-errors"
              variant="error"
              width="fit-content"
            >
              {formatMessage('fixErrorsInTheFollowingSteps')}
              {invalidSteps.join(', ')}
            </SmallAlertBox>
          )}
        </div>
      </OverlayLoader>
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
