import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { ValidationInfoIcon } from '@entur/icons';
import StopPointsEditor from './StopPoints';
import messages from './messages';

import './styles.scss';
import General from './General';

import { JourneyPattern } from 'model';
import { Paragraph, SubParagraph } from '@entur/typography';
import { isBlank } from 'helpers/forms';
import { validateStopPoints } from './StopPoints/Editor/validateForm';
import { removeElementByIndex } from 'helpers/arrays';
import { DIRECTION_TYPE } from 'model/enums';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern, index: number) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  index: number;
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  setIsValidJourneyPattern,
  index
}: Props) => {
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
        <SubParagraph>
          <ValidationInfoIcon inline />
          {formatMessage(messages.stopPointsInfo)}
        </SubParagraph>
        <StopPointsEditor
          stopPoints={pointsInSequence}
          deleteStopPoint={deleteStopPoint}
          addStopPoint={addStopPoint}
          onChange={pis => onFieldChange('pointsInSequence', pis)}
        />
      </section>
    </div>
  );
};

export default JourneyPatternEditor;
