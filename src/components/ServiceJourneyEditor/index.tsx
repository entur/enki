import { Autocomplete, Button, TextField, Tooltip } from '@mui/material';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import CopyActionChip from 'components/CopyActionChip';
import { DayTypesEditor } from 'components/DayTypesEditor/DayTypesEditor';
import DeleteActionChip from 'components/DeleteActionChip';
import Notices from 'components/Notices';
import { usePassingTimesEditor } from 'components/PassingTimesEditor';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { FlexibleLineType } from 'model/FlexibleLine';
import { filterNetexOperators } from 'model/Organisation';
import ServiceJourney from 'model/ServiceJourney';
import StopPoint from 'model/StopPoint';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppSelector } from '../../store/hooks';
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
    serviceJourney.operatorRef,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCopyDialog, setShowCopyDialog] = useState<boolean>(false);
  const organisations = useAppSelector((state) => state.organisations);
  const { formatMessage } = useIntl();

  const handleOperatorSelectionChange = (
    newOperatorSelection: string | undefined,
  ) => {
    onFieldChange('operatorRef', newOperatorSelection || null);
    setOperatorSelection(newOperatorSelection);
  };

  const operators = filterNetexOperators(organisations ?? []);

  const onFieldChange = <T extends keyof ServiceJourney>(
    field: T,
    value: ServiceJourney[T],
  ) => {
    onChange({ ...serviceJourney, [field]: value });
  };

  const namePristine = usePristine(name, spoilPristine);

  const PassingTimesEditor = usePassingTimesEditor(flexibleLineType);

  const operatorOptions = operators.map((op) => ({
    value: op.id ?? '',
    label: op.name.value ?? '',
  }));

  const selectedOperator =
    operatorOptions.find((op) => op.value === operatorSelection) ?? null;

  return (
    <div className="service-journey-editor">
      <div className="service-journey-editor-form">
        <RequiredInputMarker />
        <div className="input-group">
          <div className="service-journey-inputs">
            <TextField
              className="form-section"
              label={formatMessage({ id: 'generalNameLabel' })}
              {...getMuiErrorProps(
                formatMessage({ id: 'nameIsRequired' }),
                !isBlank(name),
                namePristine,
              )}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('name', e.target.value)
              }
              variant="outlined"
            />

            <TextField
              label={formatMessage({ id: 'generalDescription' })}
              className="form-section"
              value={description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('description', e.target.value || null)
              }
              variant="outlined"
            />

            <Tooltip title={formatMessage({ id: 'generalPublicCodeTooltip' })}>
              <TextField
                label={formatMessage({ id: 'generalPublicCode' })}
                className="form-section"
                value={publicCode || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('publicCode', e.target.value || null)
                }
                variant="outlined"
              />
            </Tooltip>

            <Tooltip title={formatMessage({ id: 'generalPrivateCodeTooltip' })}>
              <TextField
                label={formatMessage({ id: 'generalPrivateCode' })}
                className="form-section"
                value={privateCode || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onFieldChange('privateCode', e.target.value || null);
                }}
                variant="outlined"
              />
            </Tooltip>
          </div>

          <Autocomplete
            className="form-section operator-selector"
            options={operatorOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={selectedOperator}
            onChange={(_event, newValue) =>
              handleOperatorSelectionChange(newValue?.value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: 'generalOperator' })}
                placeholder={formatMessage({ id: 'defaultOption' })}
                variant="outlined"
              />
            )}
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
            <Button
              variant="outlined"
              key={2}
              onClick={() => setShowDeleteDialog(false)}
            >
              {formatMessage({ id: 'no' })}
            </Button>,
            <Button
              variant="contained"
              color="success"
              key={1}
              onClick={deleteServiceJourney}
            >
              {formatMessage({ id: 'yes' })}
            </Button>,
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
