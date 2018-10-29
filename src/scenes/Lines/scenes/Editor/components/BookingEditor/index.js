import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  CheckboxGroup,
  Checkbox
} from '@entur/component-library';

import { BookingArrangement, Contact } from '../../../../../../model';
import {
  BOOKING_ACCESS,
  BOOKING_METHOD,
  PURCHASE_MOMENT,
  PURCHASE_WHEN
} from '../../../../../../model/enums';

import './styles.css';

const DEFAULT_SELECT_LABEL = '';
const DEFAULT_SELECT_VALUE = undefined;

class BookingEditor extends Component {
  handleFieldChange(field, value, multi = false) {
    const { booking, onChange } = this.props;

    let newValue = value;
    if (multi) {
      if (booking) {
        newValue = booking[field].includes(value)
          ? booking[field].filter(v => v !== value)
          : booking[field].concat(value);
      } else {
        newValue = [value];
      }
    }

    const newBooking = booking
      ? booking.withChanges({ [field]: newValue })
      : new BookingArrangement({ [field]: newValue });

    onChange(newBooking.isEmpty() ? undefined : newBooking);
  }

  handleContactFieldChange(field, value) {
    const { booking } = this.props;
    let newContact;
    if (booking && booking.bookingContact) {
      newContact = booking.bookingContact.withChanges({ [field]: value });
    } else {
      newContact = new Contact({ [field]: value });
    }
    this.handleFieldChange(
      'bookingContact',
      newContact.isEmpty() ? undefined : newContact
    );
  }

  render() {
    const { booking } = this.props;

    const contact = booking ? booking.bookingContact : undefined;
    const contactPerson = contact ? contact.contactPerson : undefined;
    const phone = contact ? contact.phone : undefined;
    const email = contact ? contact.email : undefined;
    const url = contact ? contact.url : undefined;
    const furtherDetails = contact ? contact.furtherDetails : undefined;

    const bookingMethods = booking ? booking.bookingMethods : undefined;
    const bookWhen = booking ? booking.bookWhen : undefined;
    const buyWhen = booking ? booking.buyWhen : undefined;
    const bookingAccess = booking ? booking.bookingAccess : undefined;
    const bookingNote = booking ? booking.bookingNote : undefined;

    return (
      <div className="booking-editor">
        <Label>Kontaktperson</Label>
        <TextField
          type="text"
          value={contactPerson}
          onChange={e =>
            this.handleContactFieldChange('contactPerson', e.target.value)
          }
        />

        <Label>Telefon</Label>
        <TextField
          type="text"
          value={phone}
          onChange={e => this.handleContactFieldChange('phone', e.target.value)}
        />

        <Label>E-post</Label>
        <TextField
          type="text"
          value={email}
          onChange={e => this.handleContactFieldChange('email', e.target.value)}
        />

        <Label>URL</Label>
        <TextField
          type="text"
          value={url}
          onChange={e => this.handleContactFieldChange('url', e.target.value)}
        />

        <Label>Detaljer</Label>
        <TextField
          type="text"
          value={furtherDetails}
          onChange={e =>
            this.handleContactFieldChange('furtherDetails', e.target.value)
          }
        />

        <Label>Hvordan bestille</Label>
        <CheckboxGroup
          onChange={e =>
            this.handleFieldChange('bookingMethods', e.target.value, true)
          }
        >
          {Object.values(BOOKING_METHOD).map(v => (
            <Checkbox
              key={v}
              label={v}
              value={v}
              checked={bookingMethods && bookingMethods.includes(v)}
            />
          ))}
        </CheckboxGroup>

        <Label>Bestillingstidspunkt</Label>
        <DropDown
          value={bookWhen}
          onChange={e => this.handleFieldChange('bookWhen', e.target.value)}
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {Object.values(PURCHASE_WHEN).map(v => (
            <DropDownOptions key={v} label={v} value={v} />
          ))}
        </DropDown>

        <Label>Betalingstidspunkt</Label>
        <CheckboxGroup
          onChange={e =>
            this.handleFieldChange('buyWhen', e.target.value, true)
          }
        >
          {Object.values(PURCHASE_MOMENT).map(v => (
            <Checkbox
              key={v}
              label={v}
              value={v}
              checked={buyWhen && buyWhen.includes(v)}
            />
          ))}
        </CheckboxGroup>

        <Label>Tilgang</Label>
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

        <Label>Merknad</Label>
        <TextArea
          id="note"
          type="text"
          value={bookingNote}
          onChange={e => this.handleFieldChange('bookingNote', e.target.value)}
        />
      </div>
    );
  }
}

BookingEditor.propTypes = {
  booking: PropTypes.instanceOf(BookingArrangement).isRequired
};

export default BookingEditor;
