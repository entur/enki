import { Chip } from '@mui/material';
import {
  TimePicker,
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
} from '@entur/datepicker';
import {
  Autocomplete,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Typography } from '@mui/material';
import { TimeValue } from '@react-types/datepicker';
import { CalendarDateTime } from '@internationalized/date';
import DurationPicker from 'components/DurationPicker';
import { TimeUnitPickerPosition } from 'components/TimeUnitPicker';
import { getCurrentDateTime } from '../../utils/dates';
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
import './styles.scss';

type Props = {
  onChange: (bookingArrangement: BookingArrangement | undefined) => void;
  bookingArrangement: BookingArrangement;
  spoilPristine: boolean;
  bookingInfoAttachment: BookingInfoAttachment;
};

export default (props: Props) => {
  const intl = useIntl();
  const { formatMessage, locale } = intl;
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

  let latestbookingTimeAsDate: CalendarDateTime | undefined = undefined;
  if (latestBookingTime && latestBookingTime !== '') {
    const currentDateTime = getCurrentDateTime();
    const [hours, minutes] = latestBookingTime.split(':').map(Number);
    latestbookingTimeAsDate = currentDateTime.copy();
    latestbookingTimeAsDate.set({
      hour: hours,
      minute: minutes,
    });
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
    <div className="booking-editor">
      <Typography variant="subtitle1">
        {formatMessage({ id: 'bookingInfoText' })}
      </Typography>
      <Typography variant="caption">
        <i>{formatMessage({ id: 'bookingLabel' })} </i>
      </Typography>

      {bookingInfoAttachmentType && bookingInfoAttachmentName && (
        <section className="booking-contact-info">
          <TextField
            label={bookingInfoAttachmentLabel(bookingInfoAttachmentType)}
            value={bookingInfoAttachmentName}
            disabled
          />
        </section>
      )}

      <section className="booking-contact-info">
        <TextField
          label={formatMessage({ id: 'contactFieldsContactPersonTitle' })}
          defaultValue={bookingContact?.contactPerson ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({
              ...bookingContact,
              contactPerson: e.target.value,
            })
          }
        />

        <TextField
          label={formatMessage({ id: 'contactFieldsEmailTitle' })}
          defaultValue={bookingContact?.email ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...bookingContact, email: e.target.value })
          }
        />

        <TextField
          label={formatMessage({ id: 'contactFieldsPhoneTitle' })}
          defaultValue={bookingContact?.phone ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...bookingContact, phone: e.target.value })
          }
        />

        <TextField
          label={formatMessage({ id: 'contactFieldsUrlTitle' })}
          value={bookingContact?.url ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...bookingContact, url: e.target.value })
          }
        />

        <TextField
          multiline
          rows={4}
          label={formatMessage({ id: 'bookingNoteFieldTitle' })}
          style={{ width: '100%' }}
          value={bookingNote ?? ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...bookingArrangement, bookingNote: e.target.value })
          }
        />

        <Autocomplete
          value={getEnumInit(bookingAccess)}
          options={bookingAccessItems}
          getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
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

        <TextField
          label={formatMessage({ id: 'contactFieldsFurtherDetailsTitle' })}
          value={bookingContact?.furtherDetails || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({
              ...bookingContact,
              furtherDetails: e.target.value,
            })
          }
        />
      </section>

      <section className="booking-time-info">
        <Autocomplete
          disabled={bookingLimitType === BOOKING_LIMIT_TYPE.PERIOD}
          value={getEnumInit(bookWhen)}
          options={purchaseWhenItems}
          getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_e, item) => {
            onBookingLimitTypeChange(
              item?.value ? BOOKING_LIMIT_TYPE.TIME : BOOKING_LIMIT_TYPE.NONE,
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

        <FormControl component="fieldset">
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
              locale={locale}
              disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
              selectedTime={
                latestbookingTimeAsDate ? latestbookingTimeAsDate : null
              }
              onChange={(date: TimeValue | null) => {
                let formattedDate;

                if (date != null) {
                  formattedDate = `${date.hour}:${date.minute}`;
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

        <FormControl component="fieldset">
          <FormLabel>
            {formatMessage({ id: 'bookingMethodSelectionTitle' })}
          </FormLabel>
          <div className="filter-chip-list">
            {Object.values(BOOKING_METHOD).map((v) => (
              <Chip
                key={v}
                label={formatMessage({ id: bookingMethodMessages[v] })}
                variant={bookingMethods?.includes(v) ? 'filled' : 'outlined'}
                color={bookingMethods?.includes(v) ? 'primary' : 'default'}
                onClick={() => onBookingMethodChange(v)}
              />
            ))}
          </div>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel>
            {formatMessage({ id: 'paymentSelectionTitle' })}
          </FormLabel>
          <div className="filter-chip-list">
            {Object.values(PURCHASE_MOMENT).map((v) => (
              <Chip
                key={v}
                label={formatMessage({ id: paymentTimeMessages[v] })}
                variant={buyWhen?.includes(v) ? 'filled' : 'outlined'}
                color={buyWhen?.includes(v) ? 'primary' : 'default'}
                onClick={() => onPurchaseMomentChange(v)}
              />
            ))}
          </div>
        </FormControl>
      </section>
    </div>
  );
};
