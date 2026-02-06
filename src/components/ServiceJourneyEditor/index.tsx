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
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        <RequiredInputMarker />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
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
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={formatMessage({ id: 'generalDescription' })}
              value={description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('description', e.target.value || null)
              }
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Tooltip title={formatMessage({ id: 'generalPublicCodeTooltip' })}>
              <TextField
                label={formatMessage({ id: 'generalPublicCode' })}
                value={publicCode || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('publicCode', e.target.value || null)
                }
                variant="outlined"
              />
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Tooltip title={formatMessage({ id: 'generalPrivateCodeTooltip' })}>
              <TextField
                label={formatMessage({ id: 'generalPrivateCode' })}
                value={privateCode || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onFieldChange('privateCode', e.target.value || null);
                }}
                variant="outlined"
              />
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
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
          </Grid>
        </Grid>

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
        <Box sx={{ mt: 8 }}>
          <DayTypesEditor
            dayTypes={serviceJourney.dayTypes!}
            onChange={(dayTypes) => {
              onChange({
                ...serviceJourney,
                dayTypes,
              });
            }}
          />
        </Box>

        <Box sx={{ mt: 8 }}>
          <PassingTimesEditor
            passingTimes={passingTimes ?? []}
            stopPoints={stopPoints}
            onChange={(pts) => onFieldChange('passingTimes', pts)}
            spoilPristine={spoilPristine}
            flexibleLineType={flexibleLineType}
          />
        </Box>
      </Box>
      <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
        {deleteServiceJourney && (
          <DeleteActionChip
            onClick={() => setShowDeleteDialog(true)}
            title={formatMessage({ id: 'editorDeleteButtonText' })}
          />
        )}
        {copyServiceJourney && (
          <CopyActionChip
            title={formatMessage({ id: 'editorCopyButtonText' })}
            onClick={() => setShowCopyDialog(true)}
          />
        )}
      </Stack>
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
    </Box>
  );
};

export default ServiceJourneyEditor;
