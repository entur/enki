import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextArea,
  DropDown,
  DropDownOptions,
  FormGroup
} from '@entur/component-library';

import { BookingArrangement, Contact } from '../../../../../model';
import {
  BOOKING_ACCESS
} from '../../../../../model/enums';

import './styles.css';
import ContactFields from './contactFields';
import BookingLimitFields from './bookingLimitFields';
import BookingMethodSelection from './bookingMethodSelection';
import BookingTimeSelection from './bookingTimeSelection';
import PaymentTimeSelection from './paymentTimeSelection';
const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

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
    const { bookingArrangement: ba } = this.props;

    const buyWhen = ba ? ba.buyWhen : undefined;
    const bookingAccess = ba ? ba.bookingAccess : undefined;
    const bookingNote = ba ? ba.bookingNote : undefined;

    return (
      <div className="booking-editor">
        <ContactFields
          contact={ba ? ba.bookingContact : undefined}
          handleContactFieldChange={this.handleContactFieldChange.bind(this)}
        />

        <BookingMethodSelection
          bookingMethods={ba ? ba.bookingMethods : undefined}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingTimeSelection
          bookWhen={ba ? ba.bookWhen : undefined}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <BookingLimitFields
          latestBookingTime={ba ? ba.latestBookingTime : null}
          minimumBookingPeriod={ba ? ba.minimumBookingPeriod : null}
          resetBookingLimit={this.resetBookingLimit.bind(this)}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <PaymentTimeSelection
          buyWhen={ba ? ba.buyWhen : undefined}
          handleFieldChange={this.handleFieldChange.bind(this)}
        />

        <FormGroup
          className="form-section"
          inputId="bookingAccess"
          title="Tilgang"
        >
          <DropDown
            value={bookingAccess}
            onChange={e =>
              this.handleFieldChange('bookingAccess', e.target.value)
            }
          >
            <DropDownOptions
              label={DEFAULT_SELECT_LABEL}
              value={DEFAULT_SELECT_VALUE}
            />
            {Object.values(BOOKING_ACCESS).map(v => (
              <DropDownOptions key={v} label={v} value={v} />
            ))}
          </DropDown>
        </FormGroup>

        <FormGroup
          className="form-section"
          inputId="bookingNote"
          title="Merknad"
        >
          <TextArea
            id="note"
            type="text"
            value={bookingNote}
            onChange={e =>
              this.handleFieldChange('bookingNote', e.target.value)
            }
          />
        </FormGroup>
      </div>
    );
  }
}

BookingArrangementEditor.propTypes = {
  bookingArrangement: PropTypes.instanceOf(BookingArrangement)
};

export default BookingArrangementEditor;
