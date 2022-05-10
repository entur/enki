import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Dropdown, MultiSelect } from '@entur/dropdown';
import { TextField } from '@entur/form';
import { IconButton, SecondaryButton, SuccessButton } from '@entur/button';
import { QuestionIcon } from '@entur/icons';
import { PassingTimesEditor } from './PassingTimesEditor';
import StopPoint from 'model/StopPoint';
import { isBlank } from 'helpers/forms';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteActionChip from 'components/DeleteActionChip';
import {
  filterNetexOperators,
  OrganisationState,
} from 'reducers/organisations';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { GlobalState } from 'reducers';
import ServiceJourney from 'model/ServiceJourney';
import { Heading4, Paragraph } from '@entur/typography';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import WeekdayPicker from 'components/WeekdayPicker';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import { Tooltip } from '@entur/tooltip';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getInit, mapToItems } from 'helpers/dropdown';
import './styles.scss';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import CopyDialog from './CopyDialog';
import CopyActionChip from 'components/CopyActionChip';
import Notices from 'components/Notices';
import { FeedbackText } from '@entur/form';
import { validateDayTypes } from 'helpers/validation';
import { PassingTimeTypeDrawer } from './PassingTimesEditor/PassingTimeTypeDrawer';
import { DayTypesModal } from 'components/DayTypesModal';
import DayType from 'model/DayType';
import { useQuery } from '@apollo/client';
import { GET_DAY_TYPES } from 'api/uttu/queries';

type DayTypesData = {
  dayTypes: DayType[];
};

type Props = {
  serviceJourney: ServiceJourney;
  stopPoints: StopPoint[];
  spoilPristine: boolean;
  onChange: (serviceJourney: ServiceJourney) => void;
  deleteServiceJourney?: (index: number) => void;
  copyServiceJourney?: (serviceJourney: ServiceJourney[]) => void;
  flexibleLineType?: string;
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
    copyServiceJourney,
    flexibleLineType,
  } = props;

  const { data: allDayTypesData } = useQuery<DayTypesData>(GET_DAY_TYPES);

  const [operatorSelection, setOperatorSelection] = useState(
    serviceJourney.operatorRef
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCopyDialog, setShowCopyDialog] = useState<boolean>(false);
  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const { formatMessage } = useSelector(selectIntl);

  const [openPassingTimeTypeDrawer, setOpenPassingTimeTypeDrawer] =
    useState(false);

  const handleOperatorSelectionChange = (
    newOperatorSelection: string | undefined
  ) => {
    onFieldChange('operatorRef', newOperatorSelection || null);
    setOperatorSelection(newOperatorSelection);
  };

  const operators = filterNetexOperators(organisations ?? []);

  const onFieldChange = <T extends keyof ServiceJourney>(
    field: T,
    value: ServiceJourney[T]
  ) => {
    onChange({ ...serviceJourney, [field]: value });
  };

  const [openDayTypeModal, setOpenDayTypeModal] = useState(false);

  const namePristine = usePristine(name, spoilPristine);
  const dayTypesPristine = usePristine(dayTypes, spoilPristine);
  const dayTypesFeedback = getErrorFeedback(
    formatMessage('dayTypesValidationError'),
    validateDayTypes(dayTypes),
    dayTypesPristine
  );

  return (
    <div className="service-journey-editor">
      <PassingTimeTypeDrawer
        open={openPassingTimeTypeDrawer}
        title="Passing times"
        onDismiss={() => {
          setOpenPassingTimeTypeDrawer(false);
        }}
      />
      <div className="service-journey-editor-form">
        <RequiredInputMarker />
        <div className="input-group">
          <div className="service-journey-inputs">
            <TextField
              className="form-section"
              label={formatMessage('generalNameLabel')}
              {...getErrorFeedback(
                formatMessage('nameIsRequired'),
                !isBlank(name),
                namePristine
              )}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
            />

            <TextField
              label={formatMessage('generalDescription')}
              className="form-section"
              value={description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('description', e.target.value || null)
              }
            />

            <TextField
              label={formatMessage('generalPublicCode')}
              labelTooltip={formatMessage('generalPublicCodeTooltip')}
              className="form-section"
              value={publicCode || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('publicCode', e.target.value || null)
              }
            />

            <TextField
              label={formatMessage('generalPrivateCode')}
              labelTooltip={formatMessage('generalPrivateCodeTooltip')}
              className="form-section"
              value={privateCode || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onFieldChange('privateCode', e.target.value || null);
              }}
            />
          </div>

          <Dropdown
            className="form-section operator-selector"
            label={formatMessage('generalOperator')}
            initialSelectedItem={getInit(operators, operatorSelection)}
            placeholder={formatMessage('defaultOption')}
            items={mapToItems(operators)}
            clearable
            onChange={(e: NormalizedDropdownItemType | null) =>
              handleOperatorSelectionChange(e?.value)
            }
          />
        </div>

        <Notices
          notices={serviceJourney.notices}
          setNotices={(notices) => {
            onChange({
              ...serviceJourney,
              notices,
            });
          }}
          formatMessage={formatMessage}
        />

        {flexibleLineType && (
          <BookingArrangementEditor
            trim
            bookingArrangement={serviceJourney.bookingArrangement}
            bookingInfoAttachment={{
              type: BookingInfoAttachmentType.SERVICE_JOURNEY,
              name: serviceJourney.name!,
            }}
            spoilPristine={spoilPristine}
            onChange={(bookingArrangement) => {
              onChange({
                ...serviceJourney,
                bookingArrangement,
              });
            }}
            onRemove={() => {
              onChange({
                ...serviceJourney,
                bookingArrangement: null,
              });
            }}
          />
        )}
        <section className="day-type-section">
          <MultiSelect
            label="Select day types for this service journey"
            items={() => allDayTypesData?.dayTypes.map((dt) => dt.id!) || []}
            selectedItems={dayTypes?.map((dt) => ({
              label: dt.name || dt.id!,
              value: dt.id!,
            }))}
            onSelectedItemsChange={(items) => {
              const selectedIds = items.selectedItems?.map(
                (item) => item.value
              );
              onChange({
                ...serviceJourney,
                dayTypes: allDayTypesData?.dayTypes.filter((dt) =>
                  selectedIds?.includes(dt.id!)
                ),
              });
            }}
          />
          <SecondaryButton onClick={() => setOpenDayTypeModal(true)}>
            Edit day types
          </SecondaryButton>
          <DayTypesModal
            open={openDayTypeModal}
            setOpen={setOpenDayTypeModal}
            dayTypes={allDayTypesData?.dayTypes!}
          />
        </section>

        <section className="passing-times-section">
          <Heading4>{formatMessage('serviceJourneyPassingTimes')}</Heading4>
          <Paragraph>
            {formatMessage('passingTimesInfo')}
            <IconButton
              style={{ display: 'inline-block' }}
              onClick={() => setOpenPassingTimeTypeDrawer(true)}
            >
              <QuestionIcon />
            </IconButton>
          </Paragraph>
          <PassingTimesEditor
            passingTimes={passingTimes ?? []}
            stopPoints={stopPoints}
            onChange={(pts) => onFieldChange('passingTimes', pts)}
            spoilPristine={spoilPristine}
          />
        </section>
      </div>
      <div className="service-journey-editor-action-chips">
        {deleteServiceJourney && (
          <DeleteActionChip
            className="service-journey-editor-action-chip"
            onClick={() => setShowDeleteDialog(true)}
            title={formatMessage('editorDeleteButtonText')}
          />
        )}
        {copyServiceJourney && (
          <CopyActionChip
            className="service-journey-editor-action-chip"
            title={formatMessage('editorCopyButtonText')}
            onClick={() => setShowCopyDialog(true)}
          />
        )}
      </div>
      {deleteServiceJourney && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title={formatMessage('serviceJourneyDeleteTitle')}
          message={formatMessage('serviceJourneydeleteMessage')}
          buttons={[
            <SecondaryButton key={2} onClick={() => setShowDeleteDialog(false)}>
              {formatMessage('no')}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={deleteServiceJourney}>
              {formatMessage('yes')}
            </SuccessButton>,
          ]}
          onDismiss={() => setShowDeleteDialog(false)}
        />
      )}

      {copyServiceJourney && (
        <CopyDialog
          open={showCopyDialog}
          serviceJourney={serviceJourney}
          onSave={(serviceJourneys) => {
            copyServiceJourney(serviceJourneys);
            setShowCopyDialog(false);
          }}
          onDismiss={() => setShowCopyDialog(false)}
        />
      )}
    </div>
  );
};

export default ServiceJourneyEditor;
