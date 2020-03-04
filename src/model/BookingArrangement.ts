import Base from './base/Base';
import Contact from './Contact';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  bookingContact?: Contact | null;
  bookingNote?: string;
  bookingMethods?: any[];
  bookingAccess?: any;
  bookWhen?: any;
  buyWhen?: any;
  latestBookingTime?: any;
  minimumBookingPeriod?: any;
};

class BookingArrangement extends Base {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  bookingContact: Contact | null;
  bookingNote: string | undefined;
  bookingMethods: any[];
  bookingAccess: any | undefined;
  bookWhen: any | undefined;
  buyWhen: any[] | undefined;
  latestBookingTime: any | undefined;
  minimumBookingPeriod: any | undefined;

  static createInstance() {
    return new BookingArrangement({ bookingContact: new Contact() });
  }

  constructor(data: Data = {}) {
    super();

    this.name = data?.name;
    this.description = data?.description;
    this.privateCode = data?.privateCode;
    this.bookingContact = data?.bookingContact
      ? new Contact(data.bookingContact)
      : null;
    this.bookingNote = data?.bookingNote;
    this.bookingMethods = data?.bookingMethods || [];
    this.bookingAccess = data?.bookingAccess;
    this.bookWhen = data?.bookWhen;
    this.buyWhen = data?.buyWhen || [];
    this.latestBookingTime = data?.latestBookingTime;
    this.minimumBookingPeriod = data?.minimumBookingPeriod;
  }

  isEmpty(): boolean {
    return (
      !this.name &&
      !this.description &&
      !this.privateCode &&
      !this.bookingContact &&
      !this.bookingNote &&
      this.bookingMethods.length === 0 &&
      !this.bookingAccess &&
      !this.bookWhen &&
      this.buyWhen?.length === 0 &&
      !this.latestBookingTime &&
      !this.minimumBookingPeriod
    );
  }
}

export default BookingArrangement;
