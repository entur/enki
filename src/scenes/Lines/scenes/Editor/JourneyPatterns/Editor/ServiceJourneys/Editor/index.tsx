import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { DayType } from 'model';
import { SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Tooltip } from '@entur/tooltip';
import { InputGroup, TextField } from '@entur/form';
import PageHeader from 'components/PageHeader';
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

function isNullOrUndefined(dayType: DayType) {
  return dayType !== null || dayType !== undefined;
}

type Props = {
  serviceJourney: any;
  stopPoints: any[];
  onChange: (serviceJourney: any) => void;
  onClose: () => void;
  onSave: () => void;
  isEditMode?: boolean;
};

export default function ServiceJourneyEditor(props: Props) {
  const [operatorSelection, setOperatorSelection] = useState(
    props.serviceJourney.operatorRef
  );
  const [validPassingTimes, setValidPassingTimes] = useState<boolean>(false);
  const organisations = useSelector(
    (state: { organisations: OrganisationState[] }) => state.organisations
  );
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (field: string, value: any, multi: boolean = false) => {
    const { serviceJourney, onChange } = props;
    onChange(serviceJourney.withFieldChange(field, value, multi));
  };

  const handleOperatorSelectionChange = (operatorSelection: any) => {
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
  const validDayTimes = (dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;

  const ToolTipIfError = ({ children }: { children: ReactElement }) =>
    validPassingTimes && validDayTimes ? (
      children
    ) : (
      <Tooltip
        content={formatMessage(
          validPassingTimes
            ? messages.availabilityMustBeFilled
            : messages.passingTimesMustBeFilled
        )}
        placement="bottom-left"
      >
        {children}
      </Tooltip>
    );

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
          <ToolTipIfError>
            <SuccessButton
              disabled={!(validPassingTimes && validDayTimes)}
              onClick={onSave}
            >
              {formatMessage(messages.save)}
            </SuccessButton>
          </ToolTipIfError>
        </div>
      </div>

      <div className="input-group">
        <h2> {formatMessage(messages.general)} </h2>
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
        <h2> {formatMessage(messages.availability)} </h2>

        <DayTypeEditor
          dayType={dayTypes.length > 0 ? dayTypes[0] : undefined}
          onChange={dt =>
            onFieldChange('dayTypes', [dt].filter(isNullOrUndefined))
          }
        />
      </div>

      <div className="input-group">
        <h2> {formatMessage(messages.passingTimes)} </h2>
        <PassingTimesEditor
          passingTimes={passingTimes}
          stopPoints={stopPoints}
          onChange={pts => onFieldChange('passingTimes', pts)}
          setValidPassingTimes={setValidPassingTimes}
        />
      </div>

      <div className="input-group">
        <h2> {formatMessage(messages.booking)} </h2>
        <BookingArrangementEditor
          bookingArrangement={bookingArrangement || undefined}
          onChange={b => onFieldChange('bookingArrangement', b)}
        />
      </div>
    </div>
  );
}
