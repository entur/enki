import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import ScrollToTop from 'components/ScrollToTop';
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
import { Heading1, LeadParagraph, Label } from '@entur/typography';
import {
  RadioGroup,
  Radio,
  InputGroup,
  TextArea,
  TextField,
} from '@entur/form';
import Contact from 'model/Contact';
import { Dropdown } from '@entur/dropdown';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { FilterChip } from '@entur/chip';
import { getEnumInit, mapEnumToItems } from 'helpers/dropdown';
import DurationPicker from 'components/DurationPicker';

type Props = {
  onChange: (bookingArrangement: BookingArrangement | undefined) => void;
  bookingArrangement: BookingArrangement;
  spoilPristine: boolean;
};

const BookingArrangementEditor = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { bookingArrangement, onChange } = props;
  const {
    bookingContact,
    bookingMethods,
    bookWhen,
    buyWhen,
    bookingAccess,
    bookingNote,
    latestBookingTime,
    minimumBookingPeriod,
  } = bookingArrangement;

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
    BOOKING_LIMIT_TYPE.TIME
  );

  const onLatestBookingTimeChange = (time: string) =>
    onChange({
      ...bookingArrangement,
      minimumBookingPeriod: undefined,
      latestBookingTime: time,
    });

  const onMinimumBookingPeriodChange = (period: string) =>
    onChange({
      ...bookingArrangement,
      latestBookingTime: undefined,
      minimumBookingPeriod: period,
    });

  return (
    <ScrollToTop>
      <div className="booking-editor">
        <Heading1>{formatMessage('bookingInfoHeader')}</Heading1>
        <LeadParagraph>{formatMessage('bookingInfoText')}</LeadParagraph>
        <Label>
          <i>{formatMessage('bookingLabel')} </i>
        </Label>

        <section className="booking-contact-info">
          <InputGroup label={formatMessage('contactFieldsContactPersonTitle')}>
            <TextField
              defaultValue={bookingContact?.contactPerson ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({
                  ...bookingContact,
                  contactPerson: e.target.value,
                })
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage('contactFieldsEmailTitle')}>
            <TextField
              defaultValue={bookingContact?.email ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({ ...bookingContact, email: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage('contactFieldsPhoneTitle')}>
            <TextField
              defaultValue={bookingContact?.phone ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({ ...bookingContact, phone: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup label={formatMessage('contactFieldsUrlTitle')}>
            <TextField
              defaultValue={bookingContact?.url ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({ ...bookingContact, url: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup
            label={formatMessage('bookingNoteFieldTitle')}
            labelTooltip={formatMessage('bookingNoteTooltip')}
            style={{ width: '100%' }}
          >
            <TextArea
              value={bookingNote ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange({ ...bookingArrangement, bookingNote: e.target.value })
              }
            />
          </InputGroup>

          <Dropdown
            label={formatMessage('bookingAccessSelectionTitle')}
            initialSelectedItem={getEnumInit(bookingAccess)}
            placeholder={formatMessage('defaultOption')}
            items={mapEnumToItems(BOOKING_ACCESS)}
            clearable
            onChange={(e) =>
              onChange({
                ...bookingArrangement,
                bookingAccess: e?.value as BOOKING_ACCESS,
              })
            }
          />

          <InputGroup label={formatMessage('contactFieldsFurtherDetailsTitle')}>
            <TextField
              defaultValue={bookingContact?.furtherDetails ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({
                  ...bookingContact,
                  furtherDetails: e.target.value,
                })
              }
            />
          </InputGroup>
        </section>

        <section className="booking-time-info">
          <Dropdown
            label={formatMessage('bookingTimeSelectionTitle')}
            initialSelectedItem={getEnumInit(bookWhen)}
            placeholder={formatMessage('defaultOption')}
            items={mapEnumToItems(PURCHASE_WHEN)}
            clearable
            onChange={(e) =>
              onChange({
                ...bookingArrangement,
                bookWhen: e?.value as PURCHASE_WHEN,
              })
            }
          />

          <RadioGroup
            name="booking-time-restrictions"
            label="Booking limit"
            onChange={(e) =>
              setBookingLimitType(e?.target?.value as BOOKING_LIMIT_TYPE)
            }
            value={bookingLimitType}
          >
            <Radio value={BOOKING_LIMIT_TYPE.TIME}>Latest booking time</Radio>

            <TextField
              type="time"
              disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
              value={latestBookingTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onLatestBookingTimeChange(e?.target?.value)
              }
            />

            <Radio value={BOOKING_LIMIT_TYPE.PERIOD}>
              Minimum booking period
            </Radio>

            <DurationPicker
              duration={minimumBookingPeriod}
              resetOnZero
              disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
              position="above"
              showYears={false}
              showMonths={false}
              onChange={(period: string) =>
                onMinimumBookingPeriodChange(period)
              }
            />
          </RadioGroup>

          <InputGroup label={formatMessage('bookingMethodSelectionTitle')}>
            <div className="filter-chip-list">
              {Object.values(BOOKING_METHOD).map((v) => (
                <FilterChip
                  value={v}
                  key={v}
                  checked={bookingMethods?.includes(v)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onBookingMethodChange(e.target.value as BOOKING_METHOD)
                  }
                >
                  {formatMessage(bookingMethodMessages[v] as keyof MessagesKey)}
                </FilterChip>
              ))}
            </div>
          </InputGroup>

          <InputGroup label={formatMessage('paymentSelectionTitle')}>
            <div className="filter-chip-list">
              {Object.values(PURCHASE_MOMENT).map((v) => (
                <FilterChip
                  value={v}
                  key={v}
                  checked={buyWhen?.includes(v)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onPurchaseMomentChange(e.target.value as PURCHASE_MOMENT)
                  }
                >
                  {formatMessage(paymentTimeMessages[v] as keyof MessagesKey)}
                </FilterChip>
              ))}
            </div>
          </InputGroup>
        </section>
      </div>
    </ScrollToTop>
  );
};

export default BookingArrangementEditor;
