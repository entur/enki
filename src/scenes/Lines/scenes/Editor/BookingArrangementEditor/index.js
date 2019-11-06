import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { BookingArrangement, Contact } from '../../../../../model';
import ContactFields from './contactFields';
import BookingLimitFields from './bookingLimitFields';
import BookingMethodSelection from './bookingMethodSelection';
import BookingTimeSelection from './bookingTimeSelection';
import PaymentTimeSelection from './paymentTimeSelection';
import BookingAccessSelection from './bookingAccessSelection';
import BookingNoteField from './bookingNoteField';
import './styles.css';

const BookingArrangementEditor = props => {
  const {
    bookingArrangement = {},
    onChange
  } = props;

  const handleFieldChange = useCallback((field, value, multi = false) => {
    let newValue = value;
    if (multi) {
      if (bookingArrangement) {
        newValue = bookingArrangement[field].includes(value)
          ? bookingArrangement[field].filter(v => v !== value)
          : bookingArrangement[field].concat(value);
      } else {
        newValue = [value];
      }
    }

    const newBooking = bookingArrangement
      ? bookingArrangement.withChanges({ [field]: newValue })
      : new BookingArrangement({ [field]: newValue });

    onChange(newBooking.isEmpty() ? undefined : newBooking);
  }, [bookingArrangement, onChange]);

  const handleContactFieldChange = useCallback((field, value) => {
    let newContact;
    if (bookingArrangement && bookingArrangement.bookingContact) {
      newContact = bookingArrangement.bookingContact.withChanges({
        [field]: value
      });
    } else {
      newContact = new Contact({ [field]: value });
    }
    handleFieldChange(
      'bookingContact',
      newContact.isEmpty() ? undefined : newContact
    );
  }, [bookingArrangement, handleFieldChange]);

  const resetBookingLimit = useCallback(() => {
    if (bookingArrangement) {
      onChange(
        bookingArrangement.withChanges({
          minimumBookingPeriod: undefined,
          latestBookingTime: undefined
        })
      );
    }
  }, [bookingArrangement, onChange]);

  const {
    bookingContact,
    bookingMethods,
    bookWhen,
    latestBookingTime = null,
    minimumBookingPeriod = null,
    buyWhen,
    bookingAccess,
    bookingNote
  } = bookingArrangement;

  return (
    <div className="booking-editor">
      <ContactFields
        contact={bookingContact}
        handleContactFieldChange={handleContactFieldChange}
      />

      <BookingMethodSelection
        bookingMethods={bookingMethods}
        handleFieldChange={handleFieldChange}
      />

      <BookingTimeSelection
        bookWhen={bookWhen}
        handleFieldChange={handleFieldChange}
      />

      <BookingLimitFields
        latestBookingTime={latestBookingTime}
        minimumBookingPeriod={minimumBookingPeriod}
        resetBookingLimit={resetBookingLimit}
        handleFieldChange={handleFieldChange}
      />

      <PaymentTimeSelection
        buyWhen={buyWhen}
        handleFieldChange={handleFieldChange}
      />

      <BookingAccessSelection
        bookingAccess={bookingAccess}
        handleFieldChange={handleFieldChange}
      />

      <BookingNoteField
        bookingNote={bookingNote}
        handleFieldChange={handleFieldChange}
      />
    </div>
  );
}

BookingArrangementEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  bookingArrangement: PropTypes.instanceOf(BookingArrangement)
};

export default BookingArrangementEditor;
