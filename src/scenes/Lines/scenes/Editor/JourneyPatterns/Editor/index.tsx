import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { SuccessButton } from '@entur/button';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';
import PageHeader from 'components/PageHeader';
import { JourneyPattern } from 'model';
import StopPointsEditor from './StopPoints';
import ServiceJourneysEditor from './ServiceJourneys';
import messages from './messages';

import './styles.scss';
import General from './General';

import { DEFAULT_SELECT_VALUE } from '../../constants';

type Props = {
  journeyPattern: any;
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
            disabled={journeyPattern.pointsInSequence.length < 2}
          >
            {' '}
            {formatMessage(messages.save)}{' '}
          </SuccessButton>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>{formatMessage(messages.general)}</Tab>
          <Tab>{formatMessage(messages.stopPoints)}</Tab>
          <Tab>{formatMessage(messages.serviceJourneys)}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <General
              journeyPattern={journeyPattern}
              directionSelection={directionSelection}
              onFieldChange={onFieldChange}
              handleDirectionSelectionChange={handleDirectionSelectionChange}
            />
          </TabPanel>
          <TabPanel>
            <StopPointsEditor
              stopPoints={pointsInSequence}
              onChange={pis => onFieldChange('pointsInSequence', pis)}
            />
          </TabPanel>
          <TabPanel>
            <ServiceJourneysEditor
              serviceJourneys={serviceJourneys}
              stopPoints={pointsInSequence}
              onChange={sjs => onFieldChange('serviceJourneys', sjs)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default JourneyPatternEditor;
