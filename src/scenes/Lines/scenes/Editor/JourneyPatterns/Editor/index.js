import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
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

const JourneyPatternEditor = ({
  journeyPattern,
  isEditMode,
  onSave,
  onChange,
  onClose
}) => {
  const [directionSelection, setDirectionSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const { pointsInSequence, directionType, serviceJourneys } = journeyPattern;
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setDirectionSelection(directionType || DEFAULT_SELECT_VALUE);
  }, [directionType]);

  const onFieldChange = (field, value) => {
    onChange(journeyPattern.withFieldChange(field, value));
  };

  const handleDirectionSelectionChange = directionSelection => {
    const newDirectionValue =
      directionSelection !== DEFAULT_SELECT_VALUE
        ? directionSelection
        : undefined;
    this.onFieldChange('directionType', newDirectionValue);
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
          <SuccessButton onClick={onSave}>
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
              onFieldChange={onFieldChange.bind(this)}
              handleDirectionSelectionChange={handleDirectionSelectionChange.bind(
                this
              )}
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

JourneyPatternEditor.defaultProps = {
  journeyPattern: PropTypes.instanceOf(JourneyPattern).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

export default JourneyPatternEditor;
