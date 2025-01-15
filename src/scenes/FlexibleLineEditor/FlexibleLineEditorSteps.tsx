import General from 'components/GeneralLineEditor';
import JourneyPatternEditor from 'components/JourneyPatternEditor';
import JourneyPatterns from 'components/JourneyPatterns';
import ServiceJourneyEditor from 'components/ServiceJourneyEditor';
import ServiceJourneys from 'components/ServiceJourneys';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import { Network } from 'model/Network';
import { Organisation } from 'model/Organisation';
import './styles.scss';

type Props = {
  activeStep: number;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  networks: Network[];
  operators: Organisation[];
  spoilPristine: boolean;
};

const FlexibleLineEditor = (props: Props) => {
  const journeyPatterns = props.flexibleLine.journeyPatterns ?? [];
  return (
    <>
      {props.activeStep === 0 && (
        <>
          <section className="general-line-info">
            <General
              line={props.flexibleLine}
              operators={props.operators}
              networks={props.networks}
              onChange={props.changeFlexibleLine}
              spoilPristine={props.spoilPristine}
            />
          </section>
        </>
      )}

      {props.activeStep === 1 && (
        <section>
          <JourneyPatterns
            journeyPatterns={journeyPatterns}
            onChange={(jps) =>
              props.changeFlexibleLine({
                ...props.flexibleLine,
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
                validateJourneyPatternName={validateJourneyPatternName}
                onSave={onSave}
                onDelete={onDelete}
                onCopy={onCopy}
                spoilPristine={props.spoilPristine}
                flexibleLineType={props.flexibleLine.flexibleLineType}
                transportMode={props.flexibleLine.transportMode}
              />
            )}
          </JourneyPatterns>
        </section>
      )}

      {props.activeStep === 2 && props.flexibleLine.journeyPatterns?.[0] && (
        <section>
          <ServiceJourneys
            journeyPatterns={props.flexibleLine.journeyPatterns}
            onChange={(journeyPatterns) =>
              props.changeFlexibleLine({
                ...props.flexibleLine,
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
                copyServiceJourney={
                  props.flexibleLine.flexibleLineType === FlexibleLineType.FIXED
                    ? handleCopy
                    : undefined
                }
                flexibleLineType={props.flexibleLine.flexibleLineType}
              />
            )}
          </ServiceJourneys>
        </section>
      )}
    </>
  );
};

export default FlexibleLineEditor;
