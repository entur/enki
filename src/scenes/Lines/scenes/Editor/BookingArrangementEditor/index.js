import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  CheckboxGroup,
  Checkbox,
  Radio,
  FormGroup
} from '@entur/component-library';

import { BookingArrangement, Contact } from '../../../../../model';
import {
  BOOKING_ACCESS,
  BOOKING_METHOD,
  PURCHASE_MOMENT,
  PURCHASE_WHEN
} from '../../../../../model/enums';
import DurationPicker from '../../../../../components/DurationPicker';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const BOOKING_LIMIT_TYPE = Object.freeze({
  TIME: 'time',
  PERIOD: 'period'
});

class BookingArrangementEditor extends Component {
  state = { bookingLimitType: BOOKING_LIMIT_TYPE.TIME };

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

  handleBookingLimitChange(bookingLimitType) {
    const { bookingArrangement, onChange } = this.props;
    if (bookingArrangement) {
      onChange(
        bookingArrangement.withChanges({
          minimumBookingPeriod: undefined,
          latestBookingTime: undefined
        })
      );
    }
    this.setState({ bookingLimitType });
  }

  render() {
    const { bookingArrangement: ba } = this.props;
    const { bookingLimitType } = this.state;

    const contact = ba ? ba.bookingContact : undefined;
    const contactPerson = contact ? contact.contactPerson : undefined;
    const phone = contact ? contact.phone : undefined;
    const email = contact ? contact.email : undefined;
    const url = contact ? contact.url : undefined;
    const furtherDetails = contact ? contact.furtherDetails : undefined;

    const bookingMethods = ba ? ba.bookingMethods : undefined;
    const bookWhen = ba ? ba.bookWhen : undefined;
    const buyWhen = ba ? ba.buyWhen : undefined;
    const bookingAccess = ba ? ba.bookingAccess : undefined;
    const latestBookingTime =
      ba && ba.latestBookingTime ? ba.latestBookingTime : null;
    const minimumBookingPeriod = ba ? ba.minimumBookingPeriod : null;
    const bookingNote = ba ? ba.bookingNote : undefined;

    return (
      <div className="booking-editor">
        <FormGroup
          className="form-section"
          inputId="name"
          title="Kontaktperson"
        >
          <TextField
            type="text"
            value={contactPerson}
            onChange={e =>
              this.handleContactFieldChange('contactPerson', e.target.value)
            }
          />
        </FormGroup>

        <FormGroup className="form-section" inputId="phone" title="Telefon">
          <TextField
            type="text"
            value={phone}
            onChange={e =>
              this.handleContactFieldChange('phone', e.target.value)
            }
          />
        </FormGroup>

        <FormGroup className="form-section" inputId="email" title="E-post">
          <TextField
            type="text"
            value={email}
            onChange={e =>
              this.handleContactFieldChange('email', e.target.value)
            }
          />
        </FormGroup>

        <FormGroup className="form-section" inputId="urlFormGroup" title="URL">
          <TextField
            type="text"
            value={url}
            onChange={e => this.handleContactFieldChange('url', e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form-section" inputId="details" title="Detaljer">
          <TextField
            type="text"
            value={furtherDetails}
            onChange={e =>
              this.handleContactFieldChange('furtherDetails', e.target.value)
            }
          />
        </FormGroup>

        <FormGroup
          className="form-section"
          inputId="bookingMethods"
          title="Hvordan bestille"
        >
          <CheckboxGroup
            id="bookingMethods"
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
        </FormGroup>

        <FormGroup
          className="form-section"
          inputId="bookWhen"
          title="Bestillingstidspunkt"
        >
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
        </FormGroup>

        <FormGroup
          className="form-section"
          inputId="buyWhen"
          title="Betalingstidspunkt"
        >
          <CheckboxGroup
            id="buyWhen"
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
        </FormGroup>

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

        <div className="form-section">
          <Label>Bestillingsgrense</Label>

          <Radio
            className="booking-limit-radio"
            label="Tidspunkt"
            value={BOOKING_LIMIT_TYPE.TIME}
            checked={bookingLimitType === BOOKING_LIMIT_TYPE.TIME}
            onChange={() =>
              this.handleBookingLimitChange(BOOKING_LIMIT_TYPE.TIME)
            }
          />
          <TextField
            type="time"
            className="latest-time-picker"
            value={latestBookingTime}
            onChange={e => this.handleFieldChange('latestBookingTime', e.target.value)}
            disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
          />

          <Radio
            className="booking-limit-radio"
            label="Periode"
            value={BOOKING_LIMIT_TYPE.TIME}
            checked={bookingLimitType === BOOKING_LIMIT_TYPE.PERIOD}
            onChange={() =>
              this.handleBookingLimitChange(BOOKING_LIMIT_TYPE.PERIOD)
            }
          />
          <DurationPicker
            className="mimimum-booking-period-picker"
            duration={minimumBookingPeriod}
            resetOnZero
            onChange={period =>
              this.handleFieldChange('minimumBookingPeriod', period)
            }
            disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
            position="above"
          />
        </div>

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
