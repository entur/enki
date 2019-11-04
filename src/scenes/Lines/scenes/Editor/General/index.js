import React, { Fragment } from 'react';
import {
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  FormGroup
} from '@entur/component-library';
import { DEFAULT_SELECT_VALUE, DEFAULT_SELECT_LABEL} from '../constants';
import Errors from '../../../../../components/Errors';
import { FLEXIBLE_LINE_TYPE } from '../../../../../model/enums';

export default ({ flexibleLine, networks, operators, errors, networkSelection, operatorSelection, handleFieldChange, handleNetworkSelectionChange, handleOperatorSelectionChange }) => {
  return (
    <Fragment>
      <FormGroup
        className="form-section"
        inputId="name"
        title="* Navn"
      >
        <TextField
          type="text"
          value={flexibleLine.name}
          onChange={e =>
            handleFieldChange('name', e.target.value)
          }
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="description"
        title="Beskrivelse"
      >
        <TextArea
          type="text"
          value={flexibleLine.description}
          onChange={e =>
            handleFieldChange('description', e.target.value)
          }
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="privateCode"
        title="Privat kode"
      >
        <TextField
          type="text"
          value={flexibleLine.privateCode}
          onChange={e =>
            handleFieldChange('privateCode', e.target.value)
          }
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="publicCode"
        title="* Offentlig kode"
      >
        <TextField
          type="text"
          value={flexibleLine.publicCode}
          onChange={e =>
            handleFieldChange('publicCode', e.target.value)
          }
        />
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="operator"
        title="Operatør"
      >
        <DropDown
          value={operatorSelection}
          onChange={e =>
            handleOperatorSelectionChange(e.target.value)
          }
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {operators.map(o => (
            <DropDownOptions
              key={o.name}
              label={o.name}
              value={o.id}
            />
          ))}
        </DropDown>
      </FormGroup>

      <FormGroup
        className="form-section"
        inputId="network"
        title="* Nettverk"
      >
        <DropDown
          value={networkSelection}
          onChange={e =>
            handleNetworkSelectionChange(e.target.value)
          }
          className={errors.networkRef.length > 0 ? 'input-error' : ''}
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {networks.map(n => (
            <DropDownOptions
              key={n.name}
              label={n.name}
              value={n.id}
            />
          ))}
        </DropDown>
      </FormGroup>
      <Errors errors={errors.networkRef} />

      <FormGroup
        className="form-section"
        inputId="flexibleLineType"
        title="* Flexible line type"
      >
        <DropDown
          value={flexibleLine.flexibleLineType}
          onChange={e =>
            handleFieldChange('flexibleLineType', e.target.value)
          }
        >
          <DropDownOptions
            label={DEFAULT_SELECT_LABEL}
            value={DEFAULT_SELECT_VALUE}
          />
          {Object.values(FLEXIBLE_LINE_TYPE).map(type => (
            <DropDownOptions
              key={type}
              label={type}
              value={type}
            />
          ))}
        </DropDown>
      </FormGroup>
    </Fragment>
  );
}
