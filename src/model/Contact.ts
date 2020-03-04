import Base from './base/Base';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  url?: string;
  furtherDetails?: string;
};

class Contact extends Base {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  contactPerson: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  url: string | undefined;
  furtherDetails: string | undefined;

  constructor(data?: Data) {
    super();

    this.name = data?.name;
    this.description = data?.description;
    this.privateCode = data?.privateCode;
    this.contactPerson = data?.contactPerson;
    this.phone = data?.phone;
    this.email = data?.email;
    this.url = data?.url;
    this.furtherDetails = data?.furtherDetails;
  }

  isEmpty(): boolean {
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
