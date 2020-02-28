import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { ValidationInfoIcon } from '@entur/icons';
import StopPointsEditor from './StopPoints';
import ServiceJourneysEditor from './ServiceJourneys';
import messages from './messages';

import './styles.scss';
import General from './General';

import { DEFAULT_SELECT_VALUE } from '../../constants';

type Props = {
  journeyPattern: {
    pointsInSequence: any[];
    directionType: string;
    serviceJourneys: any[];
    withFieldChange: (field: string, value: any) => any;
  };
  onSave: (journeyPattern: any, index: number) => void;
  setIsValidServiceJourney: (isValid: boolean) => void;
  index: number;
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  setIsValidServiceJourney,
  index
}: Props) => {
  const [directionSelection, setDirectionSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const { pointsInSequence, directionType, serviceJourneys } = journeyPattern;
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setDirectionSelection(directionType || DEFAULT_SELECT_VALUE);
  }, [directionType]);

  const onFieldChange = (field: string, value: any) => {
    onSave(journeyPattern.withFieldChange(field, value), index);
  };

  const handleDirectionSelectionChange = (directionSelection: any) => {
    const newDirectionValue =
      directionSelection !== DEFAULT_SELECT_VALUE
        ? directionSelection
        : undefined;
    onFieldChange('directionType', newDirectionValue);
    setDirectionSelection(directionSelection);
  };

  const deleteStopPoint = (stopPointIndex: number) => {
    const copy = pointsInSequence.slice();
    copy.splice(stopPointIndex, 1);

    const newServiceJourneys = serviceJourneys.map(sj => {
      const copyOfPassingTimes = sj.passingTimes.slice();
      copyOfPassingTimes.splice(stopPointIndex, 1);

      return sj.withFieldChange('passingTimes', copyOfPassingTimes);
    });

    onSave(
      journeyPattern
        .withFieldChange('pointsInSequence', copy)
        .withFieldChange('serviceJourneys', newServiceJourneys),
      index
    );
  };

  return (
    <div className="journey-pattern-editor">
      <section>
        <h3> {formatMessage(messages.general)} </h3>
        <General
          journeyPattern={journeyPattern}
          directionSelection={directionSelection}
          onFieldChange={onFieldChange}
          handleDirectionSelectionChange={handleDirectionSelectionChange}
        />
      </section>

      <section>
        <h3> {formatMessage(messages.stopPoints)} </h3>
        <p>
          <ValidationInfoIcon inline /> {formatMessage(messages.stopPointsInfo)}{' '}
        </p>
        <StopPointsEditor
          stopPoints={pointsInSequence}
          deleteStopPoint={deleteStopPoint}
          onChange={pis => onFieldChange('pointsInSequence', pis)}
        />
      </section>

      <section>
        <h3> {formatMessage(messages.serviceJourneys)} </h3>
        <p>
          <ValidationInfoIcon inline />{' '}
          {formatMessage(messages.serviceJourneysInfo)}{' '}
        </p>
        <ServiceJourneysEditor
          serviceJourneys={serviceJourneys}
          stopPoints={pointsInSequence}
          onChange={sjs => onFieldChange('serviceJourneys', sjs)}
          setIsValidServiceJourney={setIsValidServiceJourney}
        />
      </section>
    </div>
  );
};

export default JourneyPatternEditor;
