import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { SecondaryButton, SuccessButton, TertiaryButton } from '@entur/button';
import { DeleteIcon, QuestionIcon } from '@entur/icons';
import PassingTimesEditor from './PassingTimesEditor';
import StopPoint from 'model/StopPoint';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import {
  filterNetexOperators,
  OrganisationState,
} from 'reducers/organisations';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { GlobalState } from 'reducers';
import ServiceJourney from 'model/ServiceJourney';
import { Heading4, Paragraph } from '@entur/typography';
import ScrollToTop from 'components/ScrollToTop';
import './styles.scss';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import WeekdayPicker from 'components/WeekdayPicker';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import { Tooltip } from '@entur/tooltip';

type Props = {
  serviceJourney: ServiceJourney;
  stopPoints: StopPoint[];
  spoilPristine: boolean;
  onChange: (serviceJourney: ServiceJourney) => void;
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
      dayTypes,
    },
    spoilPristine,
    onChange,
    stopPoints,
    serviceJourney,
    deleteServiceJourney,
  } = props;

  const [operatorSelection, setOperatorSelection] = useState(
    serviceJourney.operatorRef
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const { formatMessage } = useSelector(selectIntl);

  const handleOperatorSelectionChange = (
    operatorSelection: string | undefined
  ) => {
    onFieldChange('operatorRef', operatorSelection);
    setOperatorSelection(operatorSelection);
  };

  const operators = filterNetexOperators(organisations ?? []);

  const onFieldChange = (field: keyof ServiceJourney, value: any) => {
    onChange({ ...serviceJourney, [field]: value });
  };

  const namePristine = usePristine(name, spoilPristine);

  return (
    <ScrollToTop>
      <div className="service-journey-editor">
        <div className="service-journey-editor-form">
          <div className="input-group">
            <div className="input-fields">
              <InputGroup
                className="form-section"
                label={formatMessage('generalNameLabel')}
                {...getErrorFeedback(
                  formatMessage('nameIsRequired'),
                  !isBlank(name),
                  namePristine
                )}
              >
                <TextField
                  defaultValue={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('name', e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup
                label={formatMessage('generalDescription')}
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
                label={formatMessage('generalPrivateCode')}
                labelTooltip={formatMessage('generalPrivateCodeTooltip')}
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
                label={formatMessage('generalPublicCode')}
                labelTooltip={formatMessage('generalPublicCodeTooltip')}
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
              label={formatMessage('generalOperator')}
              items={[
                ...operators.map(({ name, id }) => ({
                  label: name,
                  value: id,
                })),
              ]}
              value={operatorSelection}
              onChange={(e: NormalizedDropdownItemType | null) =>
                handleOperatorSelectionChange(e?.value)
              }
            />
          </div>

          <section className="weekday-section">
            <Heading4>{formatMessage('dayTypeEditorWeekdays')}</Heading4>
            <WeekdayPicker
              days={dayTypes?.[0].daysOfWeek ?? []}
              onChange={(dow) =>
                onChange({
                  ...serviceJourney,
                  dayTypes: [
                    { ...serviceJourney.dayTypes?.[0]!, daysOfWeek: dow },
                  ],
                })
              }
              spoilPristine={spoilPristine}
            />
          </section>

          <section className="day-type-section">
            <Heading4>
              {formatMessage('dayTypeEditorDateAvailability')}
              <Tooltip
                content={formatMessage('dayTypeEditorDateTooltip')}
                placement="right"
              >
                <span className="question-icon">
                  <QuestionIcon />
                </span>
              </Tooltip>
            </Heading4>
            <DayTypeAssignmentsEditor
              dayTypeAssignments={
                dayTypes?.[0].dayTypeAssignments?.length
                  ? dayTypes[0].dayTypeAssignments
                  : [newDayTypeAssignment()]
              }
              onChange={(dta) =>
                onChange({
                  ...serviceJourney,
                  dayTypes: [
                    {
                      ...serviceJourney.dayTypes?.[0]!,
                      dayTypeAssignments: dta,
                    },
                  ],
                })
              }
            />
          </section>

          <section className="passing-times-section">
            <h4>{formatMessage('serviceJourneyPassingTimes')}</h4>
            <Paragraph>{formatMessage('passingTimesInfo')}</Paragraph>
            <PassingTimesEditor
              passingTimes={passingTimes ?? []}
              stopPoints={stopPoints}
              onChange={(pts) => onFieldChange('passingTimes', pts)}
              spoilPristine={spoilPristine}
            />
          </section>
        </div>

        {deleteServiceJourney && (
          <TertiaryButton
            className="delete-button"
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon inline /> {formatMessage('editorDeleteButtonText')}
          </TertiaryButton>
        )}

        {showDeleteDialog && deleteServiceJourney && (
          <ConfirmDialog
            isOpen={showDeleteDialog}
            title={formatMessage('deleteTitle')}
            message={formatMessage('deleteMessage')}
            buttons={[
              <SecondaryButton
                key={2}
                onClick={() => setShowDeleteDialog(false)}
              >
                {formatMessage('tableNo')}
              </SecondaryButton>,
              <SuccessButton key={1} onClick={deleteServiceJourney}>
                {formatMessage('tableYes')}
              </SuccessButton>,
            ]}
            onDismiss={() => setShowDeleteDialog(false)}
          />
        )}
      </div>
    </ScrollToTop>
  );
};

export default ServiceJourneyEditor;
