import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TextField, InputGroup } from '@entur/form';
import { FLEXIBLE_LINE_TYPE } from 'model/enums';
import { selectIntl } from 'i18n';
import messages from './messages';
import validationMessages from '../validateForm.messages';
import './styles.scss';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import { Organisation } from 'reducers/organisations';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';

type Props = {
  flexibleLine: FlexibleLine;
  networks: Network[];
  errors: any;
  operators: Organisation[];
  flexibleLineChange: (flexibleLine: FlexibleLine) => void;
};

export default ({
  flexibleLine,
  networks,
  errors,
  operators,
  flexibleLineChange
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const {
    errors: {
      name: nameError,
      publicCode: publicCodeError,
      networkRef: networkError,
      operatorRef: operatorError,
      flexibleLineType: flexibleLineTypeError
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
            defaultValue={flexibleLine.name ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({ ...flexibleLine, name: e.target.value })
            }
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.descriptionFormGroupTitle)}
        >
          <TextField
            value={flexibleLine.description ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({
                ...flexibleLine,
                description: e.target.value
              })
            }
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.privateCodeFormGroupTitle)}
          labelTooltip={formatMessage(messages.privateCodeInputLabelTooltip)}
        >
          <TextField
            type="text"
            value={flexibleLine.privateCode ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({
                ...flexibleLine,
                privateCode: e.target.value
              })
            }
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage(messages.publicCodeFormGroupTitle)}
          labelTooltip={formatMessage(messages.publicCodeInputLabelTooltip)}
          variant={publicCodeError ? 'error' : undefined}
          feedback={publicCodeError ?? undefined}
        >
          <TextField
            type="text"
            defaultValue={flexibleLine.publicCode ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({
                ...flexibleLine,
                publicCode: e.target.value
              })
            }
          />
        </InputGroup>

        <Dropdown
          className="form-section"
          items={[
            ...operators.map(({ id, name }) => ({ value: id, label: name }))
          ]}
          label={formatMessage(messages.operatorFormGroupTitle)}
          onChange={element =>
            flexibleLineChange({ ...flexibleLine, operatorRef: element?.value })
          }
          feedback={formatMessage(
            validationMessages.errorFlexibleLineOperatorRefEmpty
          )}
          variant={operatorError ? 'error' : undefined}
          value={flexibleLine.operatorRef}
        />

        <Dropdown
          className="form-section"
          items={networks.map(n => ({
            value: n.id ?? '',
            label: n.name ?? ''
          }))}
          label={formatMessage(messages.networkFormGroupTitle)}
          onChange={element =>
            flexibleLineChange({
              ...flexibleLine,
              networkRef: element?.value
            })
          }
          value={flexibleLine.network?.id}
          feedback={formatMessage(
            validationMessages.errorFlexibleLineNetworkRefEmpty
          )}
          variant={networkError ? 'error' : undefined}
        />

        <Dropdown
          className="form-section"
          items={[
            ...Object.values(FLEXIBLE_LINE_TYPE).map(type => ({
              value: type,
              label: type
            }))
          ]}
          label={formatMessage(messages.typeFormGroupTitle)}
          onChange={element =>
            flexibleLineChange({
              ...flexibleLine,
              flexibleLineType: element?.value
            })
          }
          value={flexibleLine.flexibleLineType}
          feedback={formatMessage(
            validationMessages.errorFlexibleLineFlexibleLineTypeEmpty
          )}
          variant={flexibleLineTypeError ? 'error' : undefined}
        />
      </section>

      <FlexibleLineTypeDrawer open title="Fleksible linjetyper" />
    </div>
  );
};
