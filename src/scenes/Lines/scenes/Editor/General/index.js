import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TextArea, TextField, InputGroup } from '@entur/form';
import { isBlank } from 'helpers/forms';
import { DEFAULT_SELECT_LABEL, DEFAULT_SELECT_VALUE } from '../constants';
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
    <div className="tab-style">
      <InputGroup
        className="form-section"
        label={formatMessage(messages.nameFormGroupTitle)}
        variant={isBlank(flexibleLine.name) ? 'error' : undefined}
        feedback={
          isBlank(flexibleLine.name) ? 'Navn må fylles inn.' : undefined
        }
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
        <TextArea
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
        variant={isBlank(flexibleLine.publicCode) ? 'error' : undefined}
        feedback={
          isBlank(flexibleLine.publicCode)
            ? 'Public Code må fylles inn.'
            : undefined
        }
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
        items={networks.map(n => ({ value: n.id, label: n.name }))}
        label={formatMessage(messages.networkFormGroupTitle)}
        onChange={({ value }) => handleNetworkSelectionChange(value)}
        placeHolder={DEFAULT_SELECT_LABEL}
        value={networkSelection}
        variant={errors.networkRef.length > 0 ? 'input-error' : undefined}
      />

      <Errors errors={errors.networkRef} />

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
        onChange={e => handleFieldChange('flexibleLineType', e.value)}
        value={flexibleLine.flexibleLineType}
      />
    </div>
  );
};
