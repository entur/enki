type Contact = {
  name?: string;
  description?: string;
  privateCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  url?: string;
  furtherDetails?: string;
};

export const contactIsEmpty = (contact: Contact): boolean =>
  !contact.name &&
  !contact.description &&
  !contact.privateCode &&
  !contact.contactPerson &&
  !contact.phone &&
  !contact.email &&
  !contact.url &&
  !contact.furtherDetails;

export default Contact;
