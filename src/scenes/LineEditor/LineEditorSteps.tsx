import General from 'components/GeneralLineEditor';
import JourneyPatternEditor from 'components/JourneyPatternEditor';
import JourneyPatterns from 'components/JourneyPatterns';
import ServiceJourneyEditor from 'components/ServiceJourneyEditor';
import ServiceJourneys from 'components/ServiceJourneys';
import Line from 'model/Line';
import { Network } from 'model/Network';
import { Organisation } from 'model/Organisation';
import { Branding } from '../../model/Branding';
import {
  TAXI_SUBMODE,
  VEHICLE_MODE,
  VEHICLE_SUBMODE_LINK,
} from '../../model/enums';

type Props = {
  activeStep: number;
  line: Line;
  changeLine: (line: Line) => void;
  networks: Network[];
  brandings: Branding[];
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
              line={props.line}
              operators={props.operators}
              networks={props.networks}
              brandings={props.brandings}
              onChange={props.changeLine}
              spoilPristine={props.spoilPristine}
            />
          </section>
        </>
      )}

      {props.activeStep === 1 && (
        <section>
          <JourneyPatterns
            journeyPatterns={props.line.journeyPatterns ?? []}
            onChange={(jps) =>
              props.changeLine({
                ...props.line,
                journeyPatterns: jps,
              })
            }
          >
            {(
              journeyPattern,
              validateJourneyPatternName,
              onSave,
              onCopy,
              onDelete,
            ) => (
              <JourneyPatternEditor
                journeyPattern={journeyPattern}
                onSave={onSave}
                onDelete={onDelete}
                spoilPristine={props.spoilPristine}
                transportMode={
                  VEHICLE_MODE.TAXI == props.line.transportMode &&
                  TAXI_SUBMODE.WATER_TAXI == props.line.transportSubmode
                    ? VEHICLE_MODE.WATER
                    : [VEHICLE_MODE.COACH, VEHICLE_MODE.TAXI].includes(
                          props.line.transportMode!,
                        )
                      ? VEHICLE_MODE.BUS
                      : props.line.transportMode
                }
                onCopy={onCopy}
                validateJourneyPatternName={validateJourneyPatternName}
              />
            )}
          </JourneyPatterns>
        </section>
      )}

      {props.activeStep === 2 && props.line.journeyPatterns?.[0] && (
        <section>
          <ServiceJourneys
            journeyPatterns={props.line.journeyPatterns}
            onChange={(journeyPatterns) =>
              props.changeLine({
                ...props.line,
                journeyPatterns,
              })
            }
          >
            {(sj, stopPoints, handleUpdate, handleDelete, handleCopy) => (
              <ServiceJourneyEditor
                serviceJourney={sj}
                stopPoints={stopPoints}
                onChange={handleUpdate}
                spoilPristine={props.spoilPristine}
                deleteServiceJourney={handleDelete}
                copyServiceJourney={handleCopy}
              />
            )}
          </ServiceJourneys>
        </section>
      )}
    </>
  );
};

export default LineEditorSteps;
