import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Button } from '@entur/component-library';
import { SuccessButton } from '@entur/button';

import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextArea, TextField } from '@entur/form';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';
import { ServiceJourney, StopPoint } from 'model';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import PassingTimesEditor from './PassingTimesEditor';
import DayTypeEditor from './DayTypeEditor';
import { ORGANISATION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
import defineMessages from './messages';

import './styles.scss';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

export default function ServiceJourneyEditor(props) {
  const [operatorSelection, setOperatorSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const organisations = useSelector(state => state.organisations);
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    setOperatorSelection({
      operatorSelection: props.serviceJourney.operatorRef
    });
  }, []);

  const onFieldChange = (field, value, multi = false) => {
    const { serviceJourney, onChange } = props;
    onChange(serviceJourney.withFieldChange(field, value, multi));
  };

  const handleOperatorSelectionChange = operatorSelection => {
    onFieldChange(
      'operatorRef',
      operatorSelection !== DEFAULT_SELECT_VALUE ? operatorSelection : undefined
    );
    setOperatorSelection({ operatorSelection });
  };

  const {
    serviceJourney: {
      name,
      description,
      privateCode,
      publicCode,
      bookingArrangement,
      passingTimes,
      dayTypes
    },
    stopPoints,
    onSave,
    isEditMode
  } = props;

  const operators = organisations.filter(org =>
    org.types.includes(ORGANISATION_TYPE.OPERATOR)
  );

  const isBlankName = isBlank(name);

  return (
    <div className="service-journey-editor">
      <div className="header">
        <h2>{isEditMode ? 'Rediger' : 'Opprett'} Service Journey</h2>

        <div className="header-buttons">
          <SuccessButton onClick={onSave}>Lagre</SuccessButton>
        </div>
      </div>

      <Tabs>
        <TabList>
          <Tab>{formatMessage(defineMessages.general)}</Tab>
          <Tab>{formatMessage(defineMessages.availability)}</Tab>
          <Tab>{formatMessage(defineMessages.passingTimes)}</Tab>
          <Tab>{formatMessage(defineMessages.booking)}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <InputGroup
              label="* Navn"
              feedback={isBlankName ? 'Navn må fylles inn.' : undefined}
              variant={isBlankName ? 'error' : undefined}
            >
              <TextField
                defaultValue={name}
                onChange={e => onFieldChange('name', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Beskrivelse" className="form-section">
              <TextArea
                type="text"
                defaultValue={description}
                onChange={e => onFieldChange('description', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Tilgjengelighet" className="form-section">
              <TextField
                type="text"
                defaultValue={privateCode}
                onChange={e => onFieldChange('privateCode', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Offentlig kode" className="form-section">
              <TextField
                type="text"
                defaultValue={publicCode}
                onChange={e => onFieldChange('publicCode', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Operatør" className="form-section">
              <Dropdown
                items={[
                  { label: DEFAULT_SELECT_LABEL, value: DEFAULT_SELECT_VALUE },
                  ...operators.map(({ name, id }) => ({
                    label: name,
                    value: id
                  }))
                ]}
                value={DEFAULT_SELECT_VALUE}
                onChange={({ value }) => handleOperatorSelectionChange(value)}
              />
            </InputGroup>
          </TabPanel>

          <TabPanel>
            <DayTypeEditor
              dayType={dayTypes.length > 0 ? dayTypes[0] : undefined}
              onChange={dt => onFieldChange('dayTypes', [dt])}
            />
          </TabPanel>

          <TabPanel>
            <PassingTimesEditor
              passingTimes={passingTimes}
              stopPoints={stopPoints}
              onChange={pts => onFieldChange('passingTimes', pts)}
            />
          </TabPanel>

          <TabPanel>
            <BookingArrangementEditor
              bookingArrangement={bookingArrangement || undefined}
              onChange={b => onFieldChange('bookingArrangement', b)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

ServiceJourneyEditor.propTypes = {
  serviceJourney: PropTypes.instanceOf(ServiceJourney).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};
