import { SecondaryButton, SuccessButton } from '@entur/button';
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
import { TextField } from '@entur/form';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import CopyActionChip from 'components/CopyActionChip';
import { DayTypesEditor } from 'components/DayTypesEditor/DayTypesEditor';
import DeleteActionChip from 'components/DeleteActionChip';
import Notices from 'components/Notices';
import { usePassingTimesEditor } from 'components/PassingTimesEditor';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useConfig } from 'config/ConfigContext';
import { getInit, mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { FlexibleLineType } from 'model/FlexibleLine';
import { filterNetexOperators } from 'model/Organisation';
import ServiceJourney from 'model/ServiceJourney';
import StopPoint from 'model/StopPoint';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppSelector } from '../../app/hooks';
import CopyDialog from './CopyDialog';
import './styles.scss';

type Props = {
  serviceJourney: ServiceJourney;
  stopPoints: StopPoint[];
  spoilPristine: boolean;
  onChange: (serviceJourney: ServiceJourney) => void;
  deleteServiceJourney?: () => void;
  copyServiceJourney?: (serviceJourney: ServiceJourney[]) => void;
  flexibleLineType?: FlexibleLineType;
};

const ServiceJourneyEditor = (props: Props) => {
  const {
    spoilPristine,
    onChange,
    stopPoints,
    serviceJourney,
    deleteServiceJourney,
    copyServiceJourney,
    flexibleLineType,
  } = props;
  const { name, description, privateCode, publicCode, passingTimes } =
    serviceJourney;

  const [operatorSelection, setOperatorSelection] = useState(
    serviceJourney.operatorRef
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCopyDialog, setShowCopyDialog] = useState<boolean>(false);
  const organisations = useAppSelector((state) => state.organisations);
  const { formatMessage } = useIntl();

  const handleOperatorSelectionChange = (
    newOperatorSelection: string | undefined
  ) => {
    onFieldChange('operatorRef', newOperatorSelection || null);
    setOperatorSelection(newOperatorSelection);
  };

  const config = useConfig();

  const operators = filterNetexOperators(
    organisations ?? [],
    config.enableLegacyOrganisationsFilter
  );

  const onFieldChange = <T extends keyof ServiceJourney>(
    field: T,
    value: ServiceJourney[T]
  ) => {
    onChange({ ...serviceJourney, [field]: value });
  };

  const namePristine = usePristine(name, spoilPristine);

  const PassingTimesEditor = usePassingTimesEditor(flexibleLineType);

  return (
    <div className="service-journey-editor">
      <div className="service-journey-editor-form">
        <RequiredInputMarker />
        <div className="input-group">
          <div className="service-journey-inputs">
            <TextField
              className="form-section"
              label={formatMessage({ id: 'generalNameLabel' })}
              {...getErrorFeedback(
                formatMessage({ id: 'nameIsRequired' }),
                !isBlank(name),
                namePristine
              )}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
            />

            <TextField
              label={formatMessage({ id: 'generalDescription' })}
              className="form-section"
              value={description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('description', e.target.value || null)
              }
            />

            <TextField
              label={formatMessage({ id: 'generalPublicCode' })}
              labelTooltip={formatMessage({ id: 'generalPublicCodeTooltip' })}
              className="form-section"
              value={publicCode || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('publicCode', e.target.value || null)
              }
            />

            <TextField
              label={formatMessage({ id: 'generalPrivateCode' })}
              labelTooltip={formatMessage({ id: 'generalPrivateCodeTooltip' })}
              className="form-section"
              value={privateCode || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onFieldChange('privateCode', e.target.value || null);
              }}
            />
          </div>

          <Dropdown
            className="form-section operator-selector"
            label={formatMessage({ id: 'generalOperator' })}
            selectedItem={getInit(
              operators.map((op) => ({ ...op, name: op.name.value })),
              operatorSelection
            )}
            placeholder={formatMessage({ id: 'defaultOption' })}
            items={mapToItems(
              operators.map((op) => ({ ...op, name: op.name.value }))
            )}
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
          <DayTypesEditor
            dayTypes={serviceJourney.dayTypes!}
            onChange={(dayTypes) => {
              onChange({
                ...serviceJourney,
                dayTypes,
              });
            }}
          />
        </section>

        <section className="passing-times-section">
          <PassingTimesEditor
            passingTimes={passingTimes ?? []}
            stopPoints={stopPoints}
            onChange={(pts) => onFieldChange('passingTimes', pts)}
            spoilPristine={spoilPristine}
            flexibleLineType={flexibleLineType}
          />
        </section>
      </div>
      <div className="service-journey-editor-action-chips">
        {deleteServiceJourney && (
          <DeleteActionChip
            className="service-journey-editor-action-chip"
            onClick={() => setShowDeleteDialog(true)}
            title={formatMessage({ id: 'editorDeleteButtonText' })}
          />
        )}
        {copyServiceJourney && (
          <CopyActionChip
            className="service-journey-editor-action-chip"
            title={formatMessage({ id: 'editorCopyButtonText' })}
            onClick={() => setShowCopyDialog(true)}
          />
        )}
      </div>
      {deleteServiceJourney && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title={formatMessage({ id: 'serviceJourneyDeleteTitle' })}
          message={formatMessage({ id: 'serviceJourneydeleteMessage' })}
          buttons={[
            <SecondaryButton key={2} onClick={() => setShowDeleteDialog(false)}>
              {formatMessage({ id: 'no' })}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={deleteServiceJourney}>
              {formatMessage({ id: 'yes' })}
            </SuccessButton>,
          ]}
          onDismiss={() => setShowDeleteDialog(false)}
        />
      )}

      {copyServiceJourney && showCopyDialog && (
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
