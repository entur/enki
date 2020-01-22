import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import { selectIntl } from 'i18n';
import messages from './contactFields.messages';
import { Contact } from 'model';

const ContactFields = props => {
  const { formatMessage } = useSelector(selectIntl);
  const {
    contact: { contactPerson, phone, email, url, furtherDetails } = {},
    onContactPersonChange,
    onPhoneChange,
    onEmailChange,
    onUrlChange,
    onDetailsChange
  } = props;

  return (
    <Fragment>
      <InputGroup
        className="form-section"
        label={formatMessage(messages.contactPersonTitle)}
      >
        <TextField
          defaultValue={contactPerson}
          onChange={e => onContactPersonChange(e.target.value)}
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.phoneTitle)}
      >
        <TextField
          defaultValue={phone}
          onChange={e => onPhoneChange(e.target.value)}
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.emailTitle)}
      >
        <TextField
          defaultValue={email}
          onChange={e => onEmailChange(e.target.value)}
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.urlTitle)}
      >
        <TextField
          defaultValue={url}
          onChange={e => onUrlChange(e.target.value)}
        />
      </InputGroup>

      <InputGroup
        className="form-section"
        label={formatMessage(messages.furtherDetailsTitle)}
      >
        <TextField
          defaultValue={furtherDetails}
          onChange={e => onDetailsChange(e.target.value)}
        />
      </InputGroup>
    </Fragment>
  );
};

ContactFields.propTypes = {
  onContactPersonChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onDetailsChange: PropTypes.func.isRequired,
  contact: PropTypes.instanceOf(Contact)
};

export default ContactFields;
