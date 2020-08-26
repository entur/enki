import React from 'react';
import JourneyPattern from 'components/JourneyPatterns';
import JourneyPatternEditor from 'scenes/FlexibleLineEditor/JourneyPatternEditor';
import General from 'scenes/FlexibleLineEditor/General';
import { Organisation } from 'reducers/organisations';
import { changeElementAtIndex } from 'helpers/arrays';
import { Network } from 'model/Network';
import Line from 'model/Line';
import ServiceJourneys from 'components/ServiceJourneys';
import ServiceJourneyEditor from 'scenes/FlexibleLineEditor/ServiceJourneyEditor';

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
          <JourneyPattern
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
          </JourneyPattern>
        </section>
      )}

      {props.activeStep === 2 && props.line.journeyPatterns?.[0] && (
        <section>
          <ServiceJourneys
            serviceJourneys={props.line.journeyPatterns[0].serviceJourneys}
            stopPoints={props.line.journeyPatterns[0].pointsInSequence}
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
          >
            {(sj, key, stopPoints, handleUpdate, handleDelete) => (
              <ServiceJourneyEditor
                key={key}
                serviceJourney={sj}
                stopPoints={stopPoints}
                onChange={handleUpdate}
                spoilPristine={props.spoilPristine}
                deleteServiceJourney={handleDelete}
                flexibleLineType={undefined}
              />
            )}
          </ServiceJourneys>
        </section>
      )}
    </>
  );
};

export default LineEditorSteps;
