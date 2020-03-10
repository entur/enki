import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TextField, InputGroup } from '@entur/form';
import { DEFAULT_SELECT_LABEL, DEFAULT_SELECT_VALUE } from '../constants';
import { FLEXIBLE_LINE_TYPE } from 'model/enums';
import { selectIntl } from 'i18n';
import messages from './messages';
import validationMessages from '../validateForm.messages';
import './styles.scss';

export default ({
  flexibleLine,
  networks,
  errors,
  operators,
  networkSelection,
  operatorSelection,
  handleFieldChange,
  handleNetworkSelectionChange,
  handleOperatorSelectionChange
}) => {
  const { formatMessage } = useSelector(selectIntl);
  const {
    errors: {
      name: nameError,
      publicCode: publicCodeError,
      networkRef: networkError
    }
  } = errors;

  return (
    <div className="lines-editor-general">
      <h4 className="header"> {formatMessage(messages.about)}</h4>
      <section className="inputs">
        <InputGroup
          className="form-section"
          label={formatMessage(messages.nameFormGroupTitle)}
          variant={nameError ? 'error' : undefined}
          feedback={nameError ?? undefined}
        >
          <TextField
            defaultValue={flexibleLine.name}
            onChange={e => handleFieldChange('name', e.target.value)}
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.descriptionFormGroupTitle)}
        >
          <TextField
            value={flexibleLine.description || ''}
            onChange={e => handleFieldChange('description', e.target.value)}
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.privateCodeFormGroupTitle)}
        >
          <TextField
            type="text"
            value={flexibleLine.privateCode || ''}
            onChange={e => handleFieldChange('privateCode', e.target.value)}
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.publicCodeFormGroupTitle)}
          variant={publicCodeError ? 'error' : undefined}
          feedback={publicCodeError ?? undefined}
        >
          <TextField
            type="text"
            defaultValue={flexibleLine.publicCode}
            onChange={e => handleFieldChange('publicCode', e.target.value)}
          />
        </InputGroup>

        <Dropdown
          className="form-section"
          items={[
            { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
            ...operators.map(({ id, name }) => ({ value: id, label: name }))
          ]}
          label={formatMessage(messages.operatorFormGroupTitle)}
          onChange={({ value }) => handleOperatorSelectionChange(value)}
          placeholder="F.eks Østfold Kollektivtrafikk"
          value={operatorSelection}
        />

        <Dropdown
          className="form-section"
          items={[
            { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
            ...networks.map(n => ({ value: n.id, label: n.name }))
          ]}
          label={formatMessage(messages.networkFormGroupTitle)}
          onChange={({ value }) => handleNetworkSelectionChange(value)}
          placeHolder={DEFAULT_SELECT_LABEL}
          value={networkSelection}
          feedback={formatMessage(
            validationMessages.errorFlexibleLineNetworkRefEmpty
          )}
          variant={networkError ? 'error' : undefined}
        />

        <Dropdown
          className="form-section"
          items={[
            { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
            ...Object.values(FLEXIBLE_LINE_TYPE).map(type => ({
              value: type,
              label: type
            }))
          ]}
          label={formatMessage(messages.typeFormGroupTitle)}
          onChange={({ value }) => handleFieldChange('flexibleLineType', value)}
          value={flexibleLine.flexibleLineType}
        />
      </section>
    </div>
  );
};
