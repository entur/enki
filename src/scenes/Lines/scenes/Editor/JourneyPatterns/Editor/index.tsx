import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import General from './General';
import {
  Paragraph,
  Heading2,
  LeadParagraph,
  Heading3,
} from '@entur/typography';
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
import FlexibleAreasOnlyEditor from './StopPoints/Editor/FlexibleAreasOnlyEditor';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern, index: number) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  index: number;
  spoilPristine: boolean;
  flexibleLineType: string | undefined;
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
  flexibleLineType,
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
    flexibleLineType,
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

  const updateStopPoints = (stopPoints: StopPoint[]) => {
    onJourneyPatternChange({
      ...journeyPattern,
      pointsInSequence: stopPoints,
      serviceJourneys: serviceJourneys.map((serviceJourney) => {
        const [firstTime, secondTime] = serviceJourney.passingTimes;
        return { ...serviceJourney, passingTimes: [firstTime, secondTime] };
      }),
    });
  };

  const keys = useUniqueKeys(pointsInSequence);

  return (
    <div className="journey-pattern-editor">
      <section>
        <Heading2>{formatMessage('editorJourneyPatternsTabLabel')}</Heading2>
        <LeadParagraph>{formatMessage('editorFillInformation')}</LeadParagraph>
        <General
          journeyPattern={journeyPattern}
          onFieldChange={onJourneyPatternChange}
          spoilPristine={spoilPristine}
        />
      </section>

      <section style={{ marginTop: '5rem' }}>
        <Heading3>{formatMessage('editorStopPoints')}</Heading3>
        <Paragraph>{formatMessage('stopPointsInfo')}</Paragraph>
        {flexibleLineType === 'flexibleAreasOnly' ? (
          <FlexibleAreasOnlyEditor
            stopPoints={pointsInSequence}
            updateStopPoints={updateStopPoints}
            flexibleStopPlaces={flexibleStopPlaces}
            spoilPristine={spoilPristine}
          />
        ) : (
          pointsInSequence.map((stopPoint, index) => (
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
              flexibleLineType={flexibleLineType}
            />
          ))
        )}
        {flexibleLineType !== 'flexibleAreasOnly' && (
          <AddButton
            onClick={addStopPoint}
            buttonTitle={formatMessage('editorAddStopPoint')}
          />
        )}
      </section>
    </div>
  );
};

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces: flexibleStopPlaces ?? [],
});

export default connect(mapStateToProps)(JourneyPatternEditor);
