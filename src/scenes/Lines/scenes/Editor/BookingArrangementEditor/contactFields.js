import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TextField, FormGroup } from '@entur/component-library';
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
      <FormGroup
        className="form-section"
        inputId="name"
        title={formatMessage(messages.contactPersonTitle)}
      >
        <TextField
          type="text"
          value={contactPerson}
          onChange={e => onContactPersonChange(e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="phone"
        title={formatMessage(messages.phoneTitle)}
      >
        <TextField
          type="text"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="email"
        title={formatMessage(messages.emailTitle)}
      >
        <TextField
          type="text"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="urlFormGroup"
        title={formatMessage(messages.urlTitle)}
      >
        <TextField
          type="text"
          value={url}
          onChange={e => onUrlChange(e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="details"
        title={formatMessage(messages.furtherDetailsTitle)}
      >
        <TextField
          type="text"
          value={furtherDetails}
          onChange={e => onDetailsChange(e.target.value)}
        />
      </FormGroup>
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
