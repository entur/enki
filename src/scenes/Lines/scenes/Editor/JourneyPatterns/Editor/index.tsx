import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { SuccessButton } from '@entur/button';
import { ValidationInfoIcon } from '@entur/icons';
import PageHeader from 'components/PageHeader';
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
  isEditMode: boolean;
  onSave: () => void;
  onChange: any;
  onClose: () => void;
};

const JourneyPatternEditor = ({
  journeyPattern,
  isEditMode,
  onSave,
  onChange,
  onClose
}: Props) => {
  const [directionSelection, setDirectionSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const [isValidServiceJourney, setIsValidServiceJourney] = useState<boolean>(
    true
  );
  const { pointsInSequence, directionType, serviceJourneys } = journeyPattern;
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setDirectionSelection(directionType || DEFAULT_SELECT_VALUE);
  }, [directionType]);

  const onFieldChange = (field: string, value: any) => {
    onChange(journeyPattern.withFieldChange(field, value));
  };

  const handleDirectionSelectionChange = (directionSelection: any) => {
    const newDirectionValue =
      directionSelection !== DEFAULT_SELECT_VALUE
        ? directionSelection
        : undefined;
    onFieldChange('directionType', newDirectionValue);
    setDirectionSelection(directionSelection);
  };

  const deleteStopPoint = (index: number) => {
    const copy = pointsInSequence.slice();
    copy.splice(index, 1);

    const newServiceJourneys = serviceJourneys.map(sj => {
      const copyOfPassingTimes = sj.passingTimes.slice();
      copyOfPassingTimes.splice(index, 1);

      return sj.withFieldChange('passingTimes', copyOfPassingTimes);
    });

    onChange(
      journeyPattern
        .withFieldChange('pointsInSequence', copy)
        .withFieldChange('serviceJourneys', newServiceJourneys)
    );
  };

  return (
    <div className="journey-pattern-editor">
      <div className="header">
        <PageHeader
          withBackButton
          onBackButtonClick={onClose}
          title={`${
            isEditMode
              ? formatMessage(messages.edit)
              : formatMessage(messages.create)
          }
            Journey Pattern`}
        />

        <div className="header-buttons">
          <SuccessButton
            onClick={onSave}
            disabled={
              !isValidServiceJourney ||
              journeyPattern.pointsInSequence.length < 2
            }
          >
            {formatMessage(messages.save)}
          </SuccessButton>
        </div>
      </div>
      <section>
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
