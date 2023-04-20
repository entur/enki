import { useState, ChangeEvent } from 'react';
import './styles.scss';
import BookingArrangement from 'model/BookingArrangement';
import { addOrRemove } from 'helpers/arrays';
import {
  BOOKING_ACCESS,
  BOOKING_METHOD,
  bookingMethodMessages,
  paymentTimeMessages,
  PURCHASE_MOMENT,
  PURCHASE_WHEN,
  BOOKING_LIMIT_TYPE,
} from 'model/enums';
import { LeadParagraph, Label } from '@entur/typography';
import { RadioGroup, Radio, TextArea, TextField, Fieldset } from '@entur/form';
import Contact from 'model/Contact';
import { Dropdown } from '@entur/dropdown';
import { FilterChip } from '@entur/chip';
import { getEnumInit, mapEnumToItems } from 'helpers/dropdown';
import DurationPicker from 'components/DurationPicker';
import { TimeUnitPickerPosition } from 'components/TimeUnitPicker';
import { BookingInfoAttachment, bookingInfoAttachmentLabel } from './constants';
import {
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
  TimePicker,
} from '@entur/datepicker';
import { format } from 'date-fns';
import { TimeValue } from '@react-types/datepicker';
import { useIntl } from 'react-intl';

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

  let latestbookingTimeAsDate: Date | undefined = undefined;
  if (latestBookingTime && latestBookingTime !== '') {
    latestbookingTimeAsDate = new Date();
    latestbookingTimeAsDate.setHours(parseInt(latestBookingTime.split(':')[0]));
    latestbookingTimeAsDate.setMinutes(
      parseInt(latestBookingTime.split(':')[1])
    );
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
      : BOOKING_LIMIT_TYPE.NONE
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

  return (
    <div className="booking-editor">
      <LeadParagraph>{formatMessage({ id: 'bookingInfoText' })}</LeadParagraph>
      <Label>
        <i>{formatMessage({ id: 'bookingLabel' })} </i>
      </Label>

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

        <TextArea
          label={formatMessage({ id: 'bookingNoteFieldTitle' })}
          labelTooltip={formatMessage({ id: 'bookingNoteTooltip' })}
          style={{ width: '100%' }}
          value={bookingNote ?? ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...bookingArrangement, bookingNote: e.target.value })
          }
        />

        <Dropdown
          label={formatMessage({ id: 'bookingAccessSelectionTitle' })}
          initialSelectedItem={getEnumInit(bookingAccess)}
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={mapEnumToItems(BOOKING_ACCESS)}
          clearable
          onChange={(e) =>
            onChange({
              ...bookingArrangement,
              bookingAccess: e?.value as BOOKING_ACCESS,
            })
          }
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
        <Dropdown
          disabled={bookingLimitType === BOOKING_LIMIT_TYPE.PERIOD}
          label={formatMessage({ id: 'bookingTimeSelectionTitle' })}
          selectedItem={getEnumInit(bookWhen)}
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={mapEnumToItems(PURCHASE_WHEN)}
          clearable
          onChange={(e) => {
            onBookingLimitTypeChange(
              e?.value ? BOOKING_LIMIT_TYPE.TIME : BOOKING_LIMIT_TYPE.NONE
            );
            onChange({
              ...bookingArrangement,
              bookWhen: e?.value as PURCHASE_WHEN,
            });
          }}
        />

        <RadioGroup
          name="booking-limit-type"
          label={formatMessage({ id: 'bookingLimitFieldsHeaderLabel' })}
          onChange={(e) =>
            onBookingLimitTypeChange(e?.target?.value as BOOKING_LIMIT_TYPE)
          }
          value={bookingLimitType}
        >
          <Radio value={BOOKING_LIMIT_TYPE.NONE}>
            {formatMessage({ id: 'bookingLimitTypeNoneRadioButtonLabel' })}
          </Radio>

          <Radio value={BOOKING_LIMIT_TYPE.TIME}>
            {formatMessage({
              id: 'bookingLimitFieldsBookingLimitTypeTimeRadioButtonLabel',
            })}
          </Radio>

          <TimePicker
            label=""
            locale={locale}
            disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
            selectedTime={
              latestbookingTimeAsDate
                ? nativeDateToTimeValue(latestbookingTimeAsDate)
                : null
            }
            onChange={(date: TimeValue | null) => {
              let formattedDate;

              if (date != null) {
                formattedDate = format(
                  timeOrDateValueToNativeDate(date),
                  'HH:mm'
                );
              }

              onLatestBookingTimeChange(formattedDate);
            }}
          />

          <Radio value={BOOKING_LIMIT_TYPE.PERIOD}>
            {formatMessage({
              id: 'bookingLimitFieldsBookingLimitTypePeriodRadioButtonLabel',
            })}
          </Radio>

          <DurationPicker
            duration={minimumBookingPeriod}
            resetOnZero
            disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
            position={TimeUnitPickerPosition.ABOVE}
            showYears={false}
            showMonths={false}
            onChange={(period?: string) => onMinimumBookingPeriodChange(period)}
          />
        </RadioGroup>

        <Fieldset label={formatMessage({ id: 'bookingMethodSelectionTitle' })}>
          <div className="filter-chip-list">
            {Object.values(BOOKING_METHOD).map((v) => (
              <FilterChip
                value={v}
                key={v}
                checked={bookingMethods?.includes(v)}
                onClick={() => onBookingMethodChange(v)}
              >
                {formatMessage({ id: bookingMethodMessages[v] })}
              </FilterChip>
            ))}
          </div>
        </Fieldset>

        <Fieldset label={formatMessage({ id: 'paymentSelectionTitle' })}>
          <div className="filter-chip-list">
            {Object.values(PURCHASE_MOMENT).map((v) => (
              <FilterChip
                value={v}
                key={v}
                checked={buyWhen?.includes(v)}
                onClick={() => onPurchaseMomentChange(v)}
              >
                {formatMessage({ id: paymentTimeMessages[v] })}
              </FilterChip>
            ))}
          </div>
        </Fieldset>
      </section>
    </div>
  );
};
