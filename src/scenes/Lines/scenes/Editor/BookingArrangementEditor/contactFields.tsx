import React, { ChangeEvent, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import { selectIntl } from 'i18n';
import Contact from 'model/Contact';

type Props = {
  onContactChange: (contact: Contact) => void;
  contact: Contact;
};

const ContactFields = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { contact, onContactChange } = props;

  return (
    <Fragment>
      <InputGroup
        className="form-section"
        label={formatMessage('contactFieldsContactPersonTitle')}
      >
        <TextField
          defaultValue={contact.contactPerson ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...contact, contactPerson: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage('contactFieldsPhoneTitle')}
      >
        <TextField
          defaultValue={contact.phone ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...contact, phone: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage('contactFieldsEmailTitle')}
      >
        <TextField
          defaultValue={contact.email ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...contact, email: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage('contactFieldsUrlTitle')}
      >
        <TextField
          defaultValue={contact.url ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...contact, url: e.target.value })
          }
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage('contactFieldsFurtherDetailsTitle')}
      >
        <TextField
          defaultValue={contact.furtherDetails ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onContactChange({ ...contact, furtherDetails: e.target.value })
          }
        />
      </InputGroup>
    </Fragment>
  );
};

export default ContactFields;
