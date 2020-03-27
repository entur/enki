import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import messages from './messages';
import General from './General';
import { Paragraph } from '@entur/typography';
import { isBlank } from 'helpers/forms';
import {
  validateStopPoint,
  validateStopPoints,
} from './StopPoints/Editor/validateForm';
import {
  changeElementAtIndex,
  removeElementByIndex,
  useUniqueKeys,
} from 'helpers/arrays';
import StopPointEditor from './StopPoints/Editor';
import StopPoint from 'model/StopPoint';
import AddButton from 'components/AddButton/AddButton';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import './styles.scss';
import JourneyPattern from 'model/JourneyPattern';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern, index: number) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  index: number;
  spoilPristine: boolean;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  setIsValidJourneyPattern,
  index,
  flexibleStopPlaces,
  spoilPristine,
}: Props & StateProps) => {
  const { pointsInSequence, serviceJourneys } = journeyPattern;
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setIsValidJourneyPattern(
      !isBlank(journeyPattern.name) &&
        validateStopPoints(journeyPattern.pointsInSequence)
    );
  }, [
    journeyPattern.pointsInSequence,
    journeyPattern.name,
    setIsValidJourneyPattern,
  ]);

  const onJourneyPatternChange = (journeyPattern: JourneyPattern) => {
    onSave(journeyPattern, index);
  };

  const deleteStopPoint = (stopPointIndex: number) => {
    const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
      ...serviceJourney,
      passingTimes: serviceJourney.passingTimes
        ? removeElementByIndex(serviceJourney.passingTimes, stopPointIndex)
        : [],
    }));

    onJourneyPatternChange({
      ...journeyPattern,
      serviceJourneys: newServiceJourneys,
      pointsInSequence: removeElementByIndex(
        journeyPattern.pointsInSequence,
        stopPointIndex
      ),
    });
  };

  const addStopPoint = () => {
    const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
      ...serviceJourney,
      passingTimes: [...serviceJourney.passingTimes, {}],
    }));

    onJourneyPatternChange({
      ...journeyPattern,
      pointsInSequence: [...journeyPattern.pointsInSequence, {}],
      serviceJourneys: newServiceJourneys,
    });
  };

  const updateStopPoint = (index: number, stopPlace: StopPoint) =>
    onJourneyPatternChange({
      ...journeyPattern,
      pointsInSequence: changeElementAtIndex(
        journeyPattern.pointsInSequence,
        stopPlace,
        index
      ),
    });

  const keys = useUniqueKeys(pointsInSequence);

  return (
    <div className="journey-pattern-editor">
      <section>
        <h2>{formatMessage(messages.journeyPattern)}</h2>
        <Paragraph>{formatMessage(messages.enterInformation)}</Paragraph>
        <General
          journeyPattern={journeyPattern}
          onFieldChange={onJourneyPatternChange}
          spoilPristine={spoilPristine}
        />
      </section>

      <section style={{ marginTop: '5rem' }}>
        <h3>{formatMessage(messages.stopPoints)}</h3>
        <Paragraph>{formatMessage(messages.stopPointsInfo)}</Paragraph>
        {pointsInSequence.map((stopPoint, index) => (
          <StopPointEditor
            key={keys[index]}
            index={index}
            isFirstStop={index === 0}
            stopPoint={stopPoint}
            errors={validateStopPoint(
              stopPoint,
              index === 0,
              index === pointsInSequence.length - 1
            )}
            deleteStopPoint={
              pointsInSequence.length > 2
                ? () => deleteStopPoint(index)
                : undefined
            }
            stopPointChange={(stopPoint: StopPoint) =>
              updateStopPoint(index, stopPoint)
            }
            flexibleStopPlaces={flexibleStopPlaces}
            spoilPristine={spoilPristine}
          />
        ))}
        <AddButton
          onClick={addStopPoint}
          buttonTitle={formatMessage(messages.addStopPoint)}
        />
      </section>
    </div>
  );
};

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces: flexibleStopPlaces ?? [],
});

export default connect(mapStateToProps)(JourneyPatternEditor);
