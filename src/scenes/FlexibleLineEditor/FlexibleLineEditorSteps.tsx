import React from 'react';
import JourneyPatterns from 'components/JourneyPatterns';
import General from 'components/GeneralLineEditor';
import { withRouter } from 'react-router-dom';
import { Organisation } from 'reducers/organisations';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import './styles.scss';
import JourneyPatternEditor from 'components/JourneyPatternEditor';
import ServiceJourneys from 'components/ServiceJourneys';
import ServiceJourneyEditor from 'components/ServiceJourneyEditor';
import JourneyPattern from 'model/JourneyPattern';
import ServiceJourney from 'model/ServiceJourney';

type Props = RouteComponentProps<MatchParams> & {
  activeStep: number;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  networks: Network[];
  operators: Organisation[];
  spoilPristine: boolean;
};

const FlexibleLineEditor = (props: Props) => {
  const onFlexibleLineTypeChange = (
    newFlexibleLineType: string | undefined
  ) => {
    if (newFlexibleLineType !== 'flexibleAreasOnly') {
      return props.changeFlexibleLine({
        ...props.flexibleLine,
        flexibleLineType: newFlexibleLineType,
      });
    }

    const journeyPatterns = props.flexibleLine.journeyPatterns ?? [];

    props.changeFlexibleLine({
      ...props.flexibleLine,
      journeyPatterns: journeyPatterns.map(
        (journeyPattern: JourneyPattern) => ({
          ...journeyPattern,
          serviceJourneys: journeyPattern.serviceJourneys.map(
            (serviceJourney: ServiceJourney) => ({
              ...serviceJourney,
              passingTimes: [{}, {}],
            })
          ),
          pointsInSequence: [{}, {}],
        })
      ),
      flexibleLineType: newFlexibleLineType,
    });
  };

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
              onFlexibleLineTypeChange={onFlexibleLineTypeChange}
              spoilPristine={props.spoilPristine}
            />
          </section>
        </>
      )}

      {props.activeStep === 1 && (
        <section>
          <JourneyPatterns
            journeyPatterns={props.flexibleLine.journeyPatterns ?? []}
            onChange={(jps) =>
              props.changeFlexibleLine({
                ...props.flexibleLine,
                journeyPatterns: jps,
              })
            }
          >
            {(journeyPattern, onSave, onDelete) => (
              <JourneyPatternEditor
                journeyPattern={journeyPattern}
                onSave={onSave}
                onDelete={onDelete}
                spoilPristine={props.spoilPristine}
                flexibleLineType={props.flexibleLine.flexibleLineType}
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
                  props.flexibleLine.flexibleLineType === 'fixed'
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

export default withRouter(FlexibleLineEditor);
