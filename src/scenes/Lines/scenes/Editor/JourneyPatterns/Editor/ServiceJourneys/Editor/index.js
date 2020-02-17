import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Tooltip } from '@entur/tooltip';
import { InputGroup, TextArea, TextField } from '@entur/form';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';
import PageHeader from 'components/PageHeader';
import { ServiceJourney, StopPoint } from 'model';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import PassingTimesEditor from './PassingTimesEditor';
import DayTypeEditor from './DayTypeEditor';
import { ORGANISATION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
import messages from '../../messages';

import './styles.scss';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

export default function ServiceJourneyEditor(props) {
  const [operatorSelection, setOperatorSelection] = useState(
    props.serviceJourney.operatorRef
  );
  const [validPassingTimes, setValidPassingTimes] = useState(false);
  const organisations = useSelector(state => state.organisations);
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (field, value, multi = false) => {
    const { serviceJourney, onChange } = props;
    onChange(serviceJourney.withFieldChange(field, value, multi));
  };

  const handleOperatorSelectionChange = operatorSelection => {
    onFieldChange(
      'operatorRef',
      operatorSelection !== DEFAULT_SELECT_VALUE ? operatorSelection : undefined
    );
    setOperatorSelection(operatorSelection);
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
    onClose,
    isEditMode
  } = props;

  const operators = organisations.filter(org =>
    org.types.includes(ORGANISATION_TYPE.OPERATOR)
  );

  const isBlankName = isBlank(name);

  const ToolTipIfError = !validPassingTimes ? Tooltip : Fragment;

  return (
    <div className="service-journey-editor">
      <div className="header">
        <PageHeader
          withBackButton
          onBackButtonClick={onClose}
          title={`${
            isEditMode
              ? formatMessage(messages.edit)
              : formatMessage(messages.create)
          } Service Journey`}
        />

        <div className="header-buttons">
          <ToolTipIfError
            content="Du må ha gyldige passeringstider."
            placement="bottom-left"
          >
            <SuccessButton disabled={!validPassingTimes} onClick={onSave}>
              {formatMessage(messages.save)}
            </SuccessButton>
          </ToolTipIfError>
        </div>
      </div>

      <Tabs>
        <TabList>
          <Tab>{formatMessage(messages.general)}</Tab>
          <Tab>{formatMessage(messages.availability)}</Tab>
          <Tab>{formatMessage(messages.passingTimes)}</Tab>
          <Tab>{formatMessage(messages.booking)}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="tab-style">
            <InputGroup
              label={formatMessage(messages.nameLabel)}
              feedback={
                isBlankName ? formatMessage(messages.nameRequired) : undefined
              }
              variant={isBlankName ? 'error' : undefined}
            >
              <TextField
                defaultValue={name}
                onChange={e => onFieldChange('name', e.target.value)}
              />
            </InputGroup>

            <InputGroup
              label={formatMessage(messages.description)}
              className="form-section"
            >
              <TextArea
                defaultValue={description}
                onChange={e => onFieldChange('description', e.target.value)}
              />
            </InputGroup>

            <InputGroup
              label={formatMessage(messages.serviceAvailability)}
              className="form-section"
            >
              <TextField
                defaultValue={privateCode}
                onChange={e => onFieldChange('privateCode', e.target.value)}
              />
            </InputGroup>

            <InputGroup
              label={formatMessage(messages.publicCode)}
              className="form-section"
            >
              <TextField
                defaultValue={publicCode}
                onChange={e => onFieldChange('publicCode', e.target.value)}
              />
            </InputGroup>

            <Dropdown
              className="form-section"
              label={formatMessage(messages.operator)}
              items={[
                { label: DEFAULT_SELECT_LABEL, value: DEFAULT_SELECT_VALUE },
                ...operators.map(({ name, id }) => ({
                  label: name,
                  value: id
                }))
              ]}
              value={operatorSelection}
              onChange={({ value }) => handleOperatorSelectionChange(value)}
            />
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
              setValidPassingTimes={setValidPassingTimes}
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
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};
