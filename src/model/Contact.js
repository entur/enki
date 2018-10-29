import Base from './base/Base';

class Contact extends Base {
  constructor(data = {}) {
    super();

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.contactPerson = data.contactPerson;
    this.phone = data.phone;
    this.email = data.email;
    this.url = data.url;
    this.furtherDetails = data.furtherDetails;
  }

  isEmpty() {
    return (
      !this.name &&
      !this.description &&
      !this.privateCode &&
      !this.contactPerson &&
      !this.phone &&
      !this.email &&
      !this.url &&
      !this.furtherDetails
    );
  }
}

export default Contact;
