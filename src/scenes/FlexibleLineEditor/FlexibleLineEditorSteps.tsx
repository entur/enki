import React from 'react';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatterns from 'components/JourneyPatterns';
import General from './General';
import { withRouter } from 'react-router-dom';
import { Organisation } from 'reducers/organisations';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import ServiceJourneysEditor from './ServiceJourneys';
import { changeElementAtIndex } from 'helpers/arrays';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import './styles.scss';
import JourneyPatternEditor from './JourneyPatternEditor';

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
            {(journeyPattern, index, onSave) => (
              <JourneyPatternEditor
                journeyPattern={journeyPattern}
                onSave={onSave}
                index={index}
                spoilPristine={props.spoilPristine}
                flexibleLineType={props.flexibleLine.flexibleLineType}
              />
            )}
          </JourneyPatterns>
        </section>
      )}

      {props.activeStep === 2 && props.flexibleLine.journeyPatterns?.[0] && (
        <section>
          <ServiceJourneysEditor
            serviceJourneys={
              props.flexibleLine.journeyPatterns[0].serviceJourneys
            }
            stopPoints={props.flexibleLine.journeyPatterns[0].pointsInSequence}
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
    </>
  );
};

export default withRouter(FlexibleLineEditor);
