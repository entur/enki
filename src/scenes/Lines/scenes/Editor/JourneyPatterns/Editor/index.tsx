import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { ValidationInfoIcon } from '@entur/icons';
import messages from './messages';
import General from './General';
import { JourneyPattern } from 'model';
import { Paragraph, SubParagraph } from '@entur/typography';
import { isBlank } from 'helpers/forms';
import {
  validateStopPoint,
  validateStopPoints
} from './StopPoints/Editor/validateForm';
import {
  removeElementByIndex,
  replaceElement,
  useUniqueKeys
} from 'helpers/arrays';
import { DIRECTION_TYPE } from 'model/enums';
import StopPointEditor from './StopPoints/Editor';
import StopPoint from 'model/StopPoint';
import AddButton from 'components/AddButton/AddButton';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { colors } from '@entur/tokens';
import './styles.scss';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern, index: number) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  index: number;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[] | null;
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  setIsValidJourneyPattern,
  index,
  flexibleStopPlaces
}: Props & StateProps) => {
  const [directionSelection, setDirectionSelection] = useState<
    DIRECTION_TYPE | undefined
  >(undefined);
  const { pointsInSequence, directionType, serviceJourneys } = journeyPattern;
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setDirectionSelection(directionType);
  }, [directionType]);

  useEffect(() => {
    setIsValidJourneyPattern(
      !isBlank(journeyPattern.name) &&
        validateStopPoints(journeyPattern.pointsInSequence)
    );
  }, [
    journeyPattern.pointsInSequence,
    journeyPattern.name,
    setIsValidJourneyPattern
  ]);

  const onFieldChange = (field: string, value: any) => {
    onSave(journeyPattern.withFieldChange(field, value), index);
  };

  const handleDirectionSelectionChange = (
    directionSelection: DIRECTION_TYPE | undefined
  ) => {
    onFieldChange('directionType', directionSelection);
    setDirectionSelection(directionSelection);
  };

  const deleteStopPoint = (stopPointIndex: number) => {
    const copy = pointsInSequence.slice();
    copy.splice(stopPointIndex, 1);

    const newServiceJourneys = serviceJourneys.map(serviceJourney => ({
      ...serviceJourney,
      passingTimes: serviceJourney.passingTimes
        ? removeElementByIndex(serviceJourney.passingTimes, stopPointIndex)
        : []
    }));

    onSave(
      journeyPattern
        .withFieldChange('pointsInSequence', copy)
        .withFieldChange('serviceJourneys', newServiceJourneys),
      index
    );
  };

  const addStopPoint = () => {
    const newServiceJourneys = serviceJourneys.map(serviceJourney => ({
      ...serviceJourney,
      passingTimes: [...(serviceJourney.passingTimes ?? []), {}]
    }));

    onSave(
      journeyPattern
        .withFieldChange('pointsInSequence', [...pointsInSequence, {}])
        .withFieldChange('serviceJourneys', newServiceJourneys),
      index
    );
  };

  const updateStopPoint = (index: number, stopPlace: StopPoint) => {
    onFieldChange(
      'pointsInSequence',
      replaceElement(pointsInSequence, index, stopPlace)
    );
  };

  const keys = useUniqueKeys(pointsInSequence);

  return (
    <div className="journey-pattern-editor">
      <section>
        <h2>{formatMessage(messages.journeyPattern)}</h2>
        <Paragraph>{formatMessage(messages.enterInformation)}</Paragraph>
        <General
          journeyPattern={journeyPattern}
          directionSelection={directionSelection}
          onFieldChange={onFieldChange}
          handleDirectionSelectionChange={handleDirectionSelectionChange}
        />
      </section>

      <section style={{ marginTop: '5rem' }}>
        <h3>{formatMessage(messages.stopPoints)}</h3>
        <SubParagraph className="stop-point-info">
          <ValidationInfoIcon inline color={colors.validation.sky} />
          {formatMessage(messages.stopPointsInfo)}
        </SubParagraph>
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
            flexibleStopPlaces={flexibleStopPlaces ?? []}
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
  flexibleStopPlaces
});

export default connect(mapStateToProps)(JourneyPatternEditor);
