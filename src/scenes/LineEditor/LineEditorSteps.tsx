import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoader from 'components/OverlayLoader';
import JourneyPatternsEditor from 'scenes/FlexibleLines/scenes/Editor/JourneyPatterns';
import General from 'scenes/FlexibleLines/scenes/Editor/General';
import { selectIntl } from 'i18n';
import { Organisation } from 'reducers/organisations';
import ServiceJourneysEditor from 'scenes/FlexibleLines/scenes/Editor/ServiceJourneys';
import { changeElementAtIndex } from 'helpers/arrays';
import { currentStepIsValid } from './validateForm';
import { Network } from 'model/Network';
import { SmallAlertBox } from '@entur/alert';
import './styles.scss';
import { LINE_STEP } from './constants';
import Line from 'model/Line';

type Props = {
  activeStep: number;
  line: Line;
  changeLine: (line: Line) => void;
  networks: Network[];
  operators: Organisation[];
  isEdit: boolean;
  spoilPristine: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  steps: LINE_STEP[];
};

const LineEditorSteps = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const invalidSteps = props.steps.filter(
    (step, i) => !currentStepIsValid(i, props.line)
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
                  flexibleLine={props.line}
                  operators={props.operators}
                  networks={props.networks}
                  flexibleLineChange={props.changeLine}
                  spoilPristine={props.spoilPristine}
                  isFlexibleLine={false}
                />
              </section>
            </>
          )}

          {props.activeStep === 1 && (
            <section>
              <JourneyPatternsEditor
                journeyPatterns={props.line.journeyPatterns ?? []}
                onChange={(jps) =>
                  props.changeLine({
                    ...props.line,
                    journeyPatterns: jps,
                  })
                }
                flexibleLineType={undefined}
                spoilPristine={props.spoilPristine}
              />
            </section>
          )}

          {props.activeStep === 2 && props.line.journeyPatterns?.[0] && (
            <section>
              <ServiceJourneysEditor
                serviceJourneys={props.line.journeyPatterns[0].serviceJourneys}
                stopPoints={props.line.journeyPatterns[0].pointsInSequence}
                spoilPristine={props.spoilPristine}
                flexibleLineType={undefined}
                onChange={(sjs) =>
                  props.changeLine({
                    ...props.line,
                    journeyPatterns: changeElementAtIndex(
                      props.line.journeyPatterns!,
                      {
                        ...props.line.journeyPatterns![0],
                        serviceJourneys: sjs,
                      },
                      0
                    ),
                  })
                }
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

export default LineEditorSteps;
