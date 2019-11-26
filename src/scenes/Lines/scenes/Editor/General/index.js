import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  FormGroup
} from '@entur/component-library';
import { DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL } from '../constants';
import Errors from 'components/Errors';
import { FLEXIBLE_LINE_TYPE } from 'model/enums';
import { selectIntl } from 'i18n';
import messages from './messages';

export default ({
  flexibleLine,
  networks,
  operators,
  errors,
  networkSelection,
  operatorSelection,
  handleFieldChange,
  handleNetworkSelectionChange,
  handleOperatorSelectionChange
}) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Fragment>
      <FormGroup
        className="form-section"
        inputId="name"
        title={formatMessage(messages.nameFormGroupTitle)}
      >
        <TextField
          type="text"
          value={flexibleLine.name}
          onChange={e => handleFieldChange('name', e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="description"
        title={formatMessage(messages.descriptionFormGroupTitle)}
      >
        <TextArea
          type="text"
          value={flexibleLine.description}
          onChange={e => handleFieldChange('description', e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="privateCode"
        title={formatMessage(messages.privateCodeFormGroupTitle)}
      >
        <TextField
          type="text"
          value={flexibleLine.privateCode}
          onChange={e => handleFieldChange('privateCode', e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="publicCode"
        title={formatMessage(messages.publicCodeFormGroupTitle)}
      >
        <TextField
          type="text"
          value={flexibleLine.publicCode}
          onChange={e => handleFieldChange('publicCode', e.target.value)}
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="operator"
        title={formatMessage(messages.operatorFormGroupTitle)}
      >
        <DropDown
          value={operatorSelection}
          onChange={e => handleOperatorSelectionChange(e.target.value)}
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {operators.map(o => (
            <DropDownOptions key={o.name} label={o.name} value={o.id} />
          ))}
        </DropDown>
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="network"
        title={formatMessage(messages.networkFormGroupTitle)}
      >
        <DropDown
          value={networkSelection}
          onChange={e => handleNetworkSelectionChange(e.target.value)}
          className={errors.networkRef.length > 0 ? 'input-error' : ''}
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {networks.map(n => (
            <DropDownOptions key={n.name} label={n.name} value={n.id} />
          ))}
        </DropDown>
      </FormGroup>
      <Errors errors={errors.networkRef} />

      <FormGroup
        className="form-section"
        inputId="flexibleLineType"
        title={formatMessage(messages.typeFormGroupTitle)}
      >
        <DropDown
          value={flexibleLine.flexibleLineType}
          onChange={e => handleFieldChange('flexibleLineType', e.target.value)}
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {Object.values(FLEXIBLE_LINE_TYPE).map(type => (
            <DropDownOptions key={type} label={type} value={type} />
          ))}
        </DropDown>
      </FormGroup>
    </Fragment>
  );
};
