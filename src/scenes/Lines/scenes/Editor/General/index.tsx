import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { FLEXIBLE_LINE_TYPE } from 'model/enums';
import { selectIntl } from 'i18n';
import messages from './messages';
import validationMessages from '../validateForm.messages';
import './styles.scss';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import { Organisation } from 'reducers/organisations';
import { usePristineFeedback } from 'scenes/Lines/scenes/Editor/hooks';

type Props = {
  flexibleLine: FlexibleLine;
  networks: Network[];
  errors: any;
  operators: Organisation[];
  flexibleLineChange: (flexibleLine: FlexibleLine) => void;
  nextStepClicked: boolean;
};

export default ({
  flexibleLine,
  networks,
  errors,
  operators,
  flexibleLineChange,
  nextStepClicked
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

  const nameErr = usePristineFeedback(
    flexibleLine.name,
    !nameError,
    nameError,
    nextStepClicked
  );
  const publicCodeErr = usePristineFeedback(
    flexibleLine.publicCode,
    !publicCodeError,
    publicCodeError,
    nextStepClicked
  );
  const networkErr = usePristineFeedback(
    flexibleLine.network?.id,
    networkError === undefined,
    formatMessage(validationMessages.errorFlexibleLineNetworkRefEmpty),
    nextStepClicked
  );
  const operatorErr = usePristineFeedback(
    flexibleLine.operatorRef,
    operatorError === undefined,
    formatMessage(validationMessages.errorFlexibleLineOperatorRefEmpty),
    nextStepClicked
  );
  const lineTypeErr = usePristineFeedback(
    flexibleLine.flexibleLineType,
    flexibleLineTypeError === undefined,
    formatMessage(validationMessages.errorFlexibleLineNetworkRefEmpty),
    nextStepClicked
  );

  return (
    <div className="lines-editor-general">
      <h4 className="header"> {formatMessage(messages.about)}</h4>
      <section className="inputs">
        <InputGroup
          className="form-section"
          label={formatMessage(messages.nameFormGroupTitle)}
          {...nameErr}
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
          {...publicCodeErr}
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
          value={flexibleLine.operatorRef}
          items={[
            ...operators.map(({ id, name }) => ({ value: id, label: name }))
          ]}
          label={formatMessage(messages.operatorFormGroupTitle)}
          onChange={element =>
            flexibleLineChange({ ...flexibleLine, operatorRef: element?.value })
          }
          {...operatorErr}
        />

        <Dropdown
          className="form-section"
          value={flexibleLine.network?.id}
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
          {...networkErr}
        />

        <Dropdown
          className="form-section"
          value={flexibleLine.flexibleLineType}
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
          {...lineTypeErr}
        />
      </section>
    </div>
  );
};
