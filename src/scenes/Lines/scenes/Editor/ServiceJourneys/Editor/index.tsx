import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import PassingTimesEditor from './PassingTimesEditor';
import DayTypeEditor from './DayTypeEditor';
import StopPoint from 'model/StopPoint';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import messages from '../messages';
import {
  filterNetexOperators,
  OrganisationState
} from 'reducers/organisations';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { GlobalState } from 'reducers';
import ServiceJourney from 'model/ServiceJourney';
import { Paragraph } from '@entur/typography';
import ScrollToTop from 'components/ScrollToTop';
import './styles.scss';

type Props = {
  serviceJourney: ServiceJourney;
  stopPoints: StopPoint[];
  onChange: (serviceJourney: any) => void;
  deleteServiceJourney?: (index: number) => void;
};

const ServiceJourneyEditor = (props: Props) => {
  const {
    serviceJourney: {
      name,
      description,
      privateCode,
      publicCode,
      passingTimes,
      dayTypes
    },
    onChange,
    stopPoints,
    serviceJourney,
    deleteServiceJourney
  } = props;

  const [operatorSelection, setOperatorSelection] = useState(
    serviceJourney.operatorRef
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const organisations = useSelector<GlobalState, OrganisationState>(
    state => state.organisations
  );
  const { formatMessage } = useSelector(selectIntl);

  const handleOperatorSelectionChange = (
    operatorSelection: string | undefined
  ) => {
    onFieldChange('operatorRef', operatorSelection);
    setOperatorSelection(operatorSelection);
  };

  const operators = filterNetexOperators(organisations ?? []);

  const isBlankName = isBlank(name);

  const onFieldChange = (field: keyof ServiceJourney, value: any) => {
    onChange({ ...serviceJourney, [field]: value });
  };

  return (
    <ScrollToTop>
      <div className="service-journey-editor">
        <div className="service-journey-editor-form">
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

              <InputGroup
                label={formatMessage(messages.privateCode)}
                labelTooltip={formatMessage(messages.privateCodeTooltip)}
                className="form-section"
              >
                <TextField
                  defaultValue={privateCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('privateCode', e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup
                label={formatMessage(messages.publicCode)}
                labelTooltip={formatMessage(messages.publicCodeTooltip)}
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
                ...operators.map(({ name, id }) => ({
                  label: name,
                  value: id
                }))
              ]}
              value={operatorSelection}
              onChange={(e: NormalizedDropdownItemType | null) =>
                handleOperatorSelectionChange(e?.value)
              }
            />
          </div>

          <div className="input-group">
            <h4>{formatMessage(messages.availability)}</h4>

            <DayTypeEditor
              dayType={
                dayTypes?.[0] ?? { daysOfWeek: [], dayTypeAssignments: [] }
              }
              onChange={dt => onFieldChange('dayTypes', [dt])}
            />
          </div>

          <h4>{formatMessage(messages.passingTimes)}</h4>
          <Paragraph>{formatMessage(messages.passingTimesInfo)}</Paragraph>
          <PassingTimesEditor
            passingTimes={passingTimes ?? []}
            stopPoints={stopPoints}
            onChange={pts => onFieldChange('passingTimes', pts)}
          />
        </div>

        {deleteServiceJourney && (
          <SecondaryButton
            className="delete-button"
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon inline /> {formatMessage(messages.delete)}
          </SecondaryButton>
        )}

        {showDeleteDialog && deleteServiceJourney && (
          <ConfirmDialog
            isOpen={showDeleteDialog}
            title={formatMessage(messages.deleteTitle)}
            message={formatMessage(messages.deleteMessage)}
            buttons={[
              <SecondaryButton
                key={2}
                onClick={() => setShowDeleteDialog(false)}
              >
                {formatMessage(messages.no)}
              </SecondaryButton>,
              <SuccessButton key={1} onClick={deleteServiceJourney}>
                {formatMessage(messages.yes)}
              </SuccessButton>
            ]}
            onDismiss={() => setShowDeleteDialog(false)}
          />
        )}
      </div>
    </ScrollToTop>
  );
};

export default ServiceJourneyEditor;
