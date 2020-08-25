import React from 'react';
import JourneyPatternsEditor from 'scenes/FlexibleLines/scenes/Editor/JourneyPatterns';
import JourneyPatternEditor from 'scenes/FlexibleLines/scenes/Editor/JourneyPatterns/Editor';
import General from 'scenes/FlexibleLines/scenes/Editor/General';
import { Organisation } from 'reducers/organisations';
import ServiceJourneysEditor from 'scenes/FlexibleLines/scenes/Editor/ServiceJourneys';
import { changeElementAtIndex } from 'helpers/arrays';
import { Network } from 'model/Network';
import Line from 'model/Line';

type Props = {
  activeStep: number;
  line: Line;
  changeLine: (line: Line) => void;
  networks: Network[];
  operators: Organisation[];
  spoilPristine: boolean;
};

const LineEditorSteps = (props: Props) => {
  return (
    <>
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
          >
            {(journeyPattern, index, onSave) => (
              <JourneyPatternEditor
                journeyPattern={journeyPattern}
                index={index}
                onSave={onSave}
                spoilPristine={props.spoilPristine}
                flexibleLineType={undefined}
              />
            )}
          </JourneyPatternsEditor>
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
    </>
  );
};

export default LineEditorSteps;
