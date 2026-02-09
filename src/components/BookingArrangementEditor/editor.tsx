import {
  Autocomplete,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DurationPicker from 'components/DurationPicker';
import { TimeUnitPickerPosition } from 'components/TimeUnitPicker';

import { addOrRemove } from 'helpers/arrays';
import {
  getEnumInit,
  mapEnumToItems,
  NormalizedDropdownItemType,
} from 'helpers/dropdown';
import BookingArrangement from 'model/BookingArrangement';
import Contact from 'model/Contact';
import {
  BOOKING_ACCESS,
  BOOKING_LIMIT_TYPE,
  BOOKING_METHOD,
  PURCHASE_MOMENT,
  PURCHASE_WHEN,
  bookingMethodMessages,
  paymentTimeMessages,
} from 'model/enums';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { BookingInfoAttachment, bookingInfoAttachmentLabel } from './constants';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

type Props = {
  onChange: (bookingArrangement: BookingArrangement | undefined) => void;
  bookingArrangement: BookingArrangement;
  spoilPristine: boolean;
  bookingInfoAttachment: BookingInfoAttachment;
};

export default (props: Props) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    bookingArrangement,
    onChange,
    bookingInfoAttachment: {
      type: bookingInfoAttachmentType,
      name: bookingInfoAttachmentName,
    },
  } = props;
  const {
    bookingContact,
    bookingMethods,
    bookWhen,
    buyWhen,
    bookingAccess,
    bookingNote,
    latestBookingTime = '',
    minimumBookingPeriod,
  } = bookingArrangement;

  let latestbookingTimeAsDate: Date | null = null;
  if (latestBookingTime && latestBookingTime !== '') {
    const [hours, minutes] = latestBookingTime.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    latestbookingTimeAsDate = d;
  }

  const onContactChange = (contact: Contact) =>
    onChange({
      ...bookingArrangement,
      bookingContact: contact,
    });

  const onPurchaseMomentChange = (moment: PURCHASE_MOMENT) =>
    onChange({
      ...bookingArrangement,
      buyWhen: addOrRemove(moment, buyWhen ?? []),
    });

  const onBookingMethodChange = (method: BOOKING_METHOD) =>
    onChange({
      ...bookingArrangement,
      bookingMethods: addOrRemove(method, bookingMethods ?? []),
    });

  const [bookingLimitType, setBookingLimitType] = useState(
    minimumBookingPeriod
      ? BOOKING_LIMIT_TYPE.PERIOD
      : latestBookingTime
        ? BOOKING_LIMIT_TYPE.TIME
        : BOOKING_LIMIT_TYPE.NONE,
  );

  const onBookingLimitTypeChange = (type: BOOKING_LIMIT_TYPE) => {
    onChange({
      ...bookingArrangement,
      latestBookingTime: undefined,
      minimumBookingPeriod: undefined,
      bookWhen:
        type === BOOKING_LIMIT_TYPE.PERIOD
          ? undefined
          : bookingArrangement.bookWhen,
    });
    setBookingLimitType(type);
  };

  const onLatestBookingTimeChange = (time: string | undefined) =>
    onChange({
      ...bookingArrangement,
      latestBookingTime: time,
    });

  const onMinimumBookingPeriodChange = (period?: string) =>
    onChange({
      ...bookingArrangement,
      minimumBookingPeriod: period,
    });

  const bookingAccessItems = mapEnumToItems(BOOKING_ACCESS);
  const purchaseWhenItems = mapEnumToItems(PURCHASE_WHEN);

  return (
    <Box>
      <Typography variant="subtitle1">
        {formatMessage({ id: 'bookingInfoText' })}
      </Typography>
      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
        {formatMessage({ id: 'bookingLabel' })}{' '}
      </Typography>

      {bookingInfoAttachmentType && bookingInfoAttachmentName && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={bookingInfoAttachmentLabel(bookingInfoAttachmentType)}
              value={bookingInfoAttachmentName}
              disabled
              fullWidth
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={formatMessage({ id: 'contactFieldsContactPersonTitle' })}
            defaultValue={bookingContact?.contactPerson ?? ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onContactChange({
                ...bookingContact,
                contactPerson: e.target.value,
              })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={formatMessage({ id: 'contactFieldsEmailTitle' })}
            defaultValue={bookingContact?.email ?? ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onContactChange({ ...bookingContact, email: e.target.value })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={formatMessage({ id: 'contactFieldsPhoneTitle' })}
            defaultValue={bookingContact?.phone ?? ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onContactChange({ ...bookingContact, phone: e.target.value })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={formatMessage({ id: 'contactFieldsUrlTitle' })}
            value={bookingContact?.url ?? ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onContactChange({ ...bookingContact, url: e.target.value })
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            multiline
            rows={4}
            label={formatMessage({ id: 'bookingNoteFieldTitle' })}
            fullWidth
            value={bookingNote ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChange({ ...bookingArrangement, bookingNote: e.target.value })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            fullWidth
            value={getEnumInit(bookingAccess)}
            options={bookingAccessItems}
            getOptionLabel={(option: NormalizedDropdownItemType) =>
              option.label
            }
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_e, item) =>
              onChange({
                ...bookingArrangement,
                bookingAccess: item?.value as BOOKING_ACCESS,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: 'bookingAccessSelectionTitle' })}
                placeholder={formatMessage({ id: 'defaultOption' })}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={formatMessage({ id: 'contactFieldsFurtherDetailsTitle' })}
            value={bookingContact?.furtherDetails || ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onContactChange({
                ...bookingContact,
                furtherDetails: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              disabled={bookingLimitType === BOOKING_LIMIT_TYPE.PERIOD}
              value={getEnumInit(bookWhen)}
              options={purchaseWhenItems}
              getOptionLabel={(option: NormalizedDropdownItemType) =>
                option.label
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(_e, item) => {
                onBookingLimitTypeChange(
                  item?.value
                    ? BOOKING_LIMIT_TYPE.TIME
                    : BOOKING_LIMIT_TYPE.NONE,
                );
                onChange({
                  ...bookingArrangement,
                  bookWhen: item?.value as PURCHASE_WHEN,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={formatMessage({ id: 'bookingTimeSelectionTitle' })}
                  placeholder={formatMessage({ id: 'defaultOption' })}
                />
              )}
            />
          </Grid>
        </Grid>

        <FormControl component="fieldset" sx={{ mt: 3 }}>
          <FormLabel>
            {formatMessage({ id: 'bookingLimitFieldsHeaderLabel' })}
          </FormLabel>
          <RadioGroup
            name="booking-limit-type"
            onChange={(e) =>
              onBookingLimitTypeChange(e?.target?.value as BOOKING_LIMIT_TYPE)
            }
            value={bookingLimitType}
          >
            <FormControlLabel
              value={BOOKING_LIMIT_TYPE.NONE}
              control={<Radio />}
              label={formatMessage({
                id: 'bookingLimitTypeNoneRadioButtonLabel',
              })}
            />

            <FormControlLabel
              value={BOOKING_LIMIT_TYPE.TIME}
              control={<Radio />}
              label={formatMessage({
                id: 'bookingLimitFieldsBookingLimitTypeTimeRadioButtonLabel',
              })}
            />

            <TimePicker
              label=""
              disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
              value={latestbookingTimeAsDate}
              onChange={(date: Date | null) => {
                let formattedDate;

                if (date != null) {
                  formattedDate = `${date.getHours()}:${date.getMinutes()}`;
                }

                onLatestBookingTimeChange(formattedDate);
              }}
            />

            <FormControlLabel
              value={BOOKING_LIMIT_TYPE.PERIOD}
              control={<Radio />}
              label={formatMessage({
                id: 'bookingLimitFieldsBookingLimitTypePeriodRadioButtonLabel',
              })}
            />

            <DurationPicker
              duration={minimumBookingPeriod}
              resetOnZero
              disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
              position={TimeUnitPickerPosition.ABOVE}
              showYears={false}
              showMonths={false}
              onChange={(period?: string) =>
                onMinimumBookingPeriodChange(period)
              }
            />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 3 }}>
          <FormLabel>
            {formatMessage({ id: 'bookingMethodSelectionTitle' })}
          </FormLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.values(BOOKING_METHOD).map((v) => (
              <Chip
                key={v}
                label={formatMessage({ id: bookingMethodMessages[v] })}
                variant={bookingMethods?.includes(v) ? 'filled' : 'outlined'}
                color={bookingMethods?.includes(v) ? 'primary' : 'default'}
                onClick={() => onBookingMethodChange(v)}
              />
            ))}
          </Box>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 3 }}>
          <FormLabel>
            {formatMessage({ id: 'paymentSelectionTitle' })}
          </FormLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.values(PURCHASE_MOMENT).map((v) => (
              <Chip
                key={v}
                label={formatMessage({ id: paymentTimeMessages[v] })}
                variant={buyWhen?.includes(v) ? 'filled' : 'outlined'}
                color={buyWhen?.includes(v) ? 'primary' : 'default'}
                onClick={() => onPurchaseMomentChange(v)}
              />
            ))}
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};
