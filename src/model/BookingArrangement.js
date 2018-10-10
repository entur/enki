import Base from './base/Base';
import Contact from './Contact';

class BookingArrangement extends Base {
  constructor(data = {}) {
    super();

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.bookingContact = data.bookingContact
      ? new Contact(data.bookingContact)
      : null;
    this.bookingNote = data.bookingNote || '';
    this.bookingMethods = data.bookingMethods || [];
    this.bookingAccess = data.bookingAccess || '';
    this.bookWhen = data.bookWhen || '';
    this.buyWhen = data.buyWhen || [];
    this.latestBookingTime = data.latestBookingTime || '';
    this.minimumBookingPeriod = data.minimumBookingPeriod || '';
  }
}

export default BookingArrangement;
