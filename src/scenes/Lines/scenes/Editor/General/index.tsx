import React, { useState, ChangeEvent } from 'react';
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
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';
import { IconButton } from '@entur/button';
import { ValidationInfoIcon } from '@entur/icons';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';

type Props = {
  flexibleLine: FlexibleLine;
  networks: Network[];
  errors: any;
  operators: Organisation[];
  flexibleLineChange: (flexibleLine: FlexibleLine) => void;
  spoilPristine: boolean;
};

export default ({
  flexibleLine,
  networks,
  errors,
  operators,
  flexibleLineChange,
  spoilPristine
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { publicCode, flexibleLineType } = flexibleLine;
  const {
    errors: {
      name: nameError,
      publicCode: publicCodeError,
      networkRef: networkError,
      operatorRef: operatorError,
      flexibleLineType: flexibleLineTypeError
    }
  } = errors;
  const [showDrawer, setDrawer] = useState<boolean>(false);

  const namePristine = usePristine(flexibleLine.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const networkPristine = usePristine(flexibleLine.network?.id, spoilPristine);
  const operatorPristine = usePristine(flexibleLine.operatorRef, spoilPristine);
  const lineTypePristine = usePristine(flexibleLineType, spoilPristine);

  return (
    <div className="lines-editor-general">
      <h4 className="header"> {formatMessage(messages.about)}</h4>
      <section className="inputs">
        <InputGroup
          className="form-section"
          label={formatMessage(messages.nameFormGroupTitle)}
          {...getErrorFeedback(nameError, !nameError, namePristine)}
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
          {...getErrorFeedback(
            publicCodeError,
            !publicCodeError,
            publicCodePristine
          )}
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
          {...getErrorFeedback(
            formatMessage(validationMessages.errorFlexibleLineOperatorRefEmpty),
            !operatorError,
            operatorPristine
          )}
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
          {...getErrorFeedback(
            formatMessage(validationMessages.errorFlexibleLineNetworkRefEmpty),
            !networkError,
            networkPristine
          )}
        />

        <div className="line-type-dropdown">
          <IconButton
            className="line-type-dropdown-icon"
            aria-label={formatMessage(messages.drawerAria)}
            onClick={() => setDrawer(true)}
          >
            <ValidationInfoIcon />
          </IconButton>
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
            {...getErrorFeedback(
              formatMessage(
                validationMessages.errorFlexibleLineNetworkRefEmpty
              ),
              !flexibleLineTypeError,
              lineTypePristine
            )}
          />
        </div>
      </section>

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage(messages.drawerTitle)}
      />
    </div>
  );
};
