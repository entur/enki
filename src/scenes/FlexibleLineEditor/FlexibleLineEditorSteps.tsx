import React from 'react';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import JourneyPatterns from 'components/JourneyPatterns';
import General from 'components/GeneralLineEditor';
import { withRouter } from 'react-router-dom';
import { Organisation } from 'reducers/organisations';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { changeElementAtIndex } from 'helpers/arrays';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import './styles.scss';
import JourneyPatternEditor from 'components/JourneyPatternEditor';
import ServiceJourneys from 'components/ServiceJourneys';
import ServiceJourneyEditor from 'components/ServiceJourneyEditor';

type Props = RouteComponentProps<MatchParams> & {
  activeStep: number;
  flexibleLine: FlexibleLine;
  changeFlexibleLine: (flexibleLine: FlexibleLine) => void;
  networks: Network[];
  operators: Organisation[];
  spoilPristine: boolean;
};

const FlexibleLineEditor = (props: Props) => {
  return (
    <>
      {props.activeStep === 0 && (
        <>
          <section className="general-line-info">
            <General
              flexibleLine={props.flexibleLine}
              operators={props.operators}
              networks={props.networks}
              flexibleLineChange={props.changeFlexibleLine}
              spoilPristine={props.spoilPristine}
              isFlexibleLine={true}
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
            {(journeyPattern, onSave) => (
              <JourneyPatternEditor
                journeyPattern={journeyPattern}
                onSave={onSave}
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
            serviceJourneys={
              props.flexibleLine.journeyPatterns[0].serviceJourneys
            }
            stopPoints={props.flexibleLine.journeyPatterns[0].pointsInSequence}
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
          >
            {(sj, stopPoints, handleUpdate, handleDelete) => (
              <ServiceJourneyEditor
                serviceJourney={sj}
                stopPoints={stopPoints}
                onChange={handleUpdate}
                spoilPristine={props.spoilPristine}
                deleteServiceJourney={handleDelete}
                flexibleLineType={props.flexibleLine.flexibleLineType}
              />
            )}
          </ServiceJourneys>
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
    </>
  );
};

export default withRouter(FlexibleLineEditor);
