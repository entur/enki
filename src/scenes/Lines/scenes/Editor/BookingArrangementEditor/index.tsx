import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import ScrollToTop from 'components/ScrollToTop';
import './styles.scss';
import BookingArrangement from 'model/BookingArrangement';
import { addOrRemove } from 'helpers/arrays';
import {
  BOOKING_ACCESS,
  BOOKING_METHOD,
  bookingAccessMessages,
  bookingMethodMessages,
  bookingTimeMessages,
  paymentTimeMessages,
  PURCHASE_MOMENT,
  PURCHASE_WHEN,
} from 'model/enums';
import { Heading2, LeadParagraph } from '@entur/typography';
import { InputGroup, TextArea, TextField } from '@entur/form';
import Contact from 'model/Contact';
import { Dropdown } from '@entur/dropdown';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { FilterChip } from '@entur/chip';
import { isBlank } from 'helpers/forms';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';

type Props = {
  onChange: (bookingArrangement: BookingArrangement | undefined) => void;
  bookingArrangement: BookingArrangement;
  spoilPristine: boolean;
};

export const bookingArrangementIsValid = (
  bookingArrangement: BookingArrangement
) =>
  !isBlank(bookingArrangement?.bookingContact?.url) ||
  !isBlank(bookingArrangement?.bookingContact?.phone);

const BookingArrangementEditor = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { bookingArrangement, onChange, spoilPristine } = props;
  const {
    bookingContact,
    bookingMethods,
    bookWhen,
    buyWhen,
    bookingAccess,
    bookingNote,
  } = bookingArrangement;

  const phonePristine = usePristine(bookingContact?.phone, spoilPristine);
  const urlPristine = usePristine(bookingContact?.url, spoilPristine);

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

  return (
    <ScrollToTop>
      <div className="booking-editor">
        <Heading2>{formatMessage('bookingInfoHeader')}</Heading2>
        <LeadParagraph>{formatMessage('bookingInfoText')}</LeadParagraph>

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

          <InputGroup
            label={formatMessage('contactFieldsPhoneTitle')}
            {...getErrorFeedback(
              formatMessage('urlOrPhoneMustBeFilled'),
              bookingArrangementIsValid(bookingArrangement),
              phonePristine && urlPristine
            )}
          >
            <TextField
              defaultValue={bookingContact?.phone ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({ ...bookingContact, phone: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup
            label={formatMessage('contactFieldsUrlTitle')}
            {...getErrorFeedback(
              formatMessage('urlOrPhoneMustBeFilled'),
              bookingArrangementIsValid(bookingArrangement),
              phonePristine && urlPristine
            )}
          >
            <TextField
              defaultValue={bookingContact?.url ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange({ ...bookingContact, url: e.target.value })
              }
            />
          </InputGroup>

          <Dropdown
            label={formatMessage('bookingAccessSelectionTitle')}
            value={bookingAccess}
            items={[
              ...Object.values(BOOKING_ACCESS).map((v) => ({
                value: v,
                label: formatMessage(bookingAccessMessages[v]),
              })),
            ]}
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

          <InputGroup
            className="form-section"
            label={formatMessage('bookingNoteFieldTitle')}
          >
            <TextArea
              value={bookingNote ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange({ ...bookingArrangement, bookingNote: e.target.value })
              }
            />
          </InputGroup>
        </section>

        <section className="booking-time-info">
          <InputGroup>
            <Dropdown
              label={formatMessage('bookingTimeSelectionTitle')}
              value={bookWhen}
              items={[
                ...Object.values(PURCHASE_WHEN).map((v) => ({
                  value: v,
                  label: formatMessage(bookingTimeMessages[v]),
                })),
              ]}
              onChange={(e) =>
                onChange({
                  ...bookingArrangement,
                  bookWhen: e?.value as PURCHASE_WHEN,
                })
              }
            />
          </InputGroup>

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
