import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BookingArrangement, Contact } from '../../../../../model';

import './styles.css';
import ContactFields from './contactFields';
import BookingLimitFields from './bookingLimitFields';
import BookingMethodSelection from './bookingMethodSelection';
import BookingTimeSelection from './bookingTimeSelection';
import PaymentTimeSelection from './paymentTimeSelection';
import BookingAccessSelection from './bookingAccessSelection';
import BookingNoteField from './bookingNoteField';

class BookingArrangementEditor extends Component {
  handleFieldChange(field, value, multi = false) {
    const { bookingArrangement, onChange } = this.props;

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
  }

  handleContactFieldChange(field, value) {
    const { bookingArrangement } = this.props;
    let newContact;
    if (bookingArrangement && bookingArrangement.bookingContact) {
      newContact = bookingArrangement.bookingContact.withChanges({
        [field]: value
      });
    } else {
      newContact = new Contact({ [field]: value });
    }
    this.handleFieldChange(
      'bookingContact',
      newContact.isEmpty() ? undefined : newContact
    );
  }

  resetBookingLimit() {
    const { bookingArrangement, onChange } = this.props;
    if (bookingArrangement) {
      onChange(
        bookingArrangement.withChanges({
          minimumBookingPeriod: undefined,
          latestBookingTime: undefined
        })
      );
    }
  }

  render() {
    const {
      bookingArrangement: {
        bookingContact,
        bookingMethods,
        bookWhen,
        latestBookingTime = null,
        minimumBookingPeriod = null,
        buyWhen,
        bookingAccess,
        bookingNote
      } = {}
    } = this.props;

    return (
      <div className="booking-editor">
        <ContactFields
          contact={bookingContact}
          handleContactFieldChange={this.handleContactFieldChange.bind(this)}
        />

        <BookingMethodSelection
          bookingMethods={bookingMethods}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingTimeSelection
          bookWhen={bookWhen}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingLimitFields
          latestBookingTime={latestBookingTime}
          minimumBookingPeriod={minimumBookingPeriod}
          resetBookingLimit={this.resetBookingLimit.bind(this)}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <PaymentTimeSelection
          buyWhen={buyWhen}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingAccessSelection
          bookingAccess={bookingAccess}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingNoteField
          bookingNote={bookingNote}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

      </div>
    );
  }
}

BookingArrangementEditor.propTypes = {
  bookingArrangement: PropTypes.instanceOf(BookingArrangement)
};

export default BookingArrangementEditor;
