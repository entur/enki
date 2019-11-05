import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';
import {
  TextField,
  FormGroup
} from '@entur/component-library';
import {selectIntl} from '../../../../../i18n';
import messages from './contactFields.messages';

export default (props) => {
  const {formatMessage} = useSelector(selectIntl);
  const {
    contact: {
      contactPerson,
      phone,
      email,
      url,
      furtherDetails,
    } = {},
    handleContactFieldChange
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
          onChange={e =>
            handleContactFieldChange('contactPerson', e.target.value)
          }
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
          onChange={e =>
            handleContactFieldChange('phone', e.target.value)
          }
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
          onChange={e =>
            handleContactFieldChange('email', e.target.value)
          }
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
          onChange={e => handleContactFieldChange('url', e.target.value)}
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
          onChange={e =>
            handleContactFieldChange('furtherDetails', e.target.value)
          }
        />
      </FormGroup>
    </Fragment>
  );
}
