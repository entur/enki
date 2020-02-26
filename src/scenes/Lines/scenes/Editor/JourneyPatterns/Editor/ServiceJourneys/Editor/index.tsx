import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { ExpandableText } from '@entur/expand';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import PassingTimesEditor from './PassingTimesEditor';
import DayTypeEditor from './DayTypeEditor';
import { ORGANISATION_TYPE } from 'model/enums';
import { isBlank } from 'helpers/forms';
import messages from '../../messages';
import { OrganisationState } from 'reducers/organisations';

import './styles.scss';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

type Props = {
  serviceJourney: any;
  stopPoints: any[];
  onChange: (serviceJourney: any) => void;
  setIsValidServiceJourney: (isValid: boolean) => void;
};

export default function ServiceJourneyEditor(props: Props) {
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
    setIsValidServiceJourney,
    onChange,
    stopPoints,
    serviceJourney
  } = props;

  const [operatorSelection, setOperatorSelection] = useState(
    serviceJourney.operatorRef
  );
  const [validPassingTimes, setValidPassingTimes] = useState<boolean>(false);
  const organisations = useSelector(
    (state: { organisations: OrganisationState[] }) => state.organisations
  );
  const { formatMessage } = useSelector(selectIntl);

  const handleOperatorSelectionChange = (operatorSelection: any) => {
    onFieldChange(
      'operatorRef',
      operatorSelection !== DEFAULT_SELECT_VALUE ? operatorSelection : undefined
    );
    setOperatorSelection(operatorSelection);
  };

  const operators = organisations.filter(org =>
    org.types.includes(ORGANISATION_TYPE.OPERATOR)
  );

  const isBlankName = isBlank(name);
  const validDayTimes = (dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;

  const onFieldChange = (field: string, value: any, multi: boolean = false) => {
    onChange(serviceJourney.withFieldChange(field, value, multi));
    setIsValidServiceJourney(validPassingTimes && validDayTimes);
  };

  return (
    <div className="service-journey-editor">
      <div className="input-group">
        <div className="input-fields">
          <InputGroup
            className="form-section"
            label={formatMessage(messages.nameLabel)}
            feedback={
              isBlankName ? formatMessage(messages.nameRequired) : undefined
            }
            variant={isBlankName ? 'error' : undefined}
          >
            <TextField
              defaultValue={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
            />
          </InputGroup>

          <InputGroup
            label={formatMessage(messages.description)}
            className="form-section"
          >
            <TextField
              defaultValue={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('description', e.target.value)
              }
            />
          </InputGroup>

          <InputGroup label={'Private code'} className="form-section">
            <TextField
              defaultValue={privateCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('privateCode', e.target.value)
              }
            />
          </InputGroup>

          <InputGroup
            label={formatMessage(messages.publicCode)}
            className="form-section"
          >
            <TextField
              defaultValue={publicCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('publicCode', e.target.value)
              }
            />
          </InputGroup>
        </div>

        <Dropdown
          className="form-section operator-selector"
          label={formatMessage(messages.operator)}
          items={[
            { label: DEFAULT_SELECT_LABEL, value: DEFAULT_SELECT_VALUE },
            ...operators.map(({ name, id }) => ({
              label: name,
              value: id
            }))
          ]}
          value={operatorSelection}
          onChange={({ value }: any) => handleOperatorSelectionChange(value)}
        />
      </div>

      <div className="input-group">
        <h4> {formatMessage(messages.availability)} </h4>

        <DayTypeEditor
          dayType={dayTypes.length > 0 ? dayTypes[0] : undefined}
          onChange={dt => onFieldChange('dayTypes', [dt])}
        />
      </div>

      <h4> {formatMessage(messages.passingTimes)} </h4>
      <PassingTimesEditor
        passingTimes={passingTimes}
        stopPoints={stopPoints}
        onChange={pts => onFieldChange('passingTimes', pts)}
        setValidPassingTimes={setValidPassingTimes}
      />

      <ExpandableText title={formatMessage(messages.booking)}>
        <BookingArrangementEditor
          bookingArrangement={bookingArrangement || undefined}
          onChange={b => onFieldChange('bookingArrangement', b)}
        />
      </ExpandableText>
    </div>
  );
}
