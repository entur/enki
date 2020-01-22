import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectIntl } from 'i18n';
import { Label, Button } from '@entur/component-library';

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

class ServiceJourneyEditor extends Component {
  state = {
    operatorSelection: DEFAULT_SELECT_VALUE,
    activeTab: 'lol'
  };

  componentDidMount() {
    this.setState({ operatorSelection: this.props.serviceJourney.operatorRef });
  }

  onFieldChange(field, value, multi = false) {
    const { serviceJourney, onChange } = this.props;
    onChange(serviceJourney.withFieldChange(field, value, multi));
  }

  handleOperatorSelectionChange(operatorSelection) {
    this.onFieldChange(
      'operatorRef',
      operatorSelection !== DEFAULT_SELECT_VALUE ? operatorSelection : undefined
    );
    this.setState({ operatorSelection });
  }

  render() {
    const {
      organisations,
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
    } = this.props;
    const { operatorSelection, activeTab } = this.state;
    console.log(selectIntl);

    const operators = organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR)
    );

    const isBlankName = isBlank(name);

    return (
      <div className="service-journey-editor">
        <div className="header">
          <h2>{isEditMode ? 'Rediger' : 'Opprett'} Service Journey</h2>

          <div className="header-buttons">
            <Button variant="success" onClick={onSave}>
              Lagre
            </Button>
          </div>
        </div>

        <Tabs
          selected={activeTab}
          onChange={activeTab => this.setState({ activeTab })}
        >
          <TabList>
            <Tab>{selectIntl.formatMessage(defineMessages.general)}</Tab>
            <Tab>{selectIntl.formatMessage(defineMessages.availability)}</Tab>
            <Tab>{selectIntl.formatMessage(defineMessages.passingTimes)}</Tab>
            <Tab>{selectIntl.formatMessage(defineMessages.booking)}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Label>* Navn</Label>
              <InputGroup
                feedback={isBlankName ? 'Navn må fylles inn.' : undefined}
                variant={isBlankName ? 'error' : undefined}
              >
                <TextField
                  defaultValue={name}
                  onChange={e => this.onFieldChange('name', e.target.value)}
                />
              </InputGroup>

              <Label>Beskrivelse</Label>
              <InputGroup>
                <TextArea
                  type="text"
                  defaultValue={description}
                  onChange={e =>
                    this.onFieldChange('description', e.target.value)
                  }
                />
              </InputGroup>

              <Label>Privat kode</Label>
              <TextField
                type="text"
                defaultValue={privateCode}
                onChange={e =>
                  this.onFieldChange('privateCode', e.target.value)
                }
              />

              <Label>Offentlig kode</Label>
              <TextField
                type="text"
                defaultValue={publicCode}
                onChange={e => this.onFieldChange('publicCode', e.target.value)}
              />

              <Label>Operatør</Label>
              <Dropdown
                items={[
                  { label: DEFAULT_SELECT_LABEL, value: DEFAULT_SELECT_VALUE },
                  ...operators.map(({ name, id }) => ({
                    label: name,
                    value: id
                  }))
                ]}
                value={DEFAULT_SELECT_VALUE}
                onChange={({ value }) =>
                  this.handleOperatorSelectionChange(value)
                }
              />
            </TabPanel>

            <TabPanel>
              <DayTypeEditor
                dayType={dayTypes.length > 0 ? dayTypes[0] : undefined}
                onChange={dt => this.onFieldChange('dayTypes', [dt])}
              />
            </TabPanel>

            <TabPanel>
              <PassingTimesEditor
                passingTimes={passingTimes}
                stopPoints={stopPoints}
                onChange={pts => this.onFieldChange('passingTimes', pts)}
              />
            </TabPanel>

            <TabPanel>
              <BookingArrangementEditor
                bookingArrangement={bookingArrangement || undefined}
                onChange={b => this.onFieldChange('bookingArrangement', b)}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    );
  }
}

ServiceJourneyEditor.propTypes = {
  serviceJourney: PropTypes.instanceOf(ServiceJourney).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

const mapStateToProps = ({ organisations }) => ({ organisations });

export default connect(mapStateToProps)(ServiceJourneyEditor);
