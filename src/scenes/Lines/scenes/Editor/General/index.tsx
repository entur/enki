import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { Heading2 } from '@entur/typography';
import { FLEXIBLE_LINE_TYPE } from 'model/enums';
import { selectIntl } from 'i18n';
import './styles.scss';
import FlexibleLine from 'model/FlexibleLine';
import { Network } from 'model/Network';
import { Organisation } from 'reducers/organisations';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import ServiceJourney from 'model/ServiceJourney';
import JourneyPattern from 'model/JourneyPattern';

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
  spoilPristine,
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { publicCode, flexibleLineType } = flexibleLine;
  const {
    errors: {
      name: nameError,
      publicCode: publicCodeError,
      networkRef: networkError,
      operatorRef: operatorError,
      flexibleLineType: flexibleLineTypeError,
    },
  } = errors;
  const [showDrawer, setDrawer] = useState<boolean>(false);

  const namePristine = usePristine(flexibleLine.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const networkPristine = usePristine(flexibleLine.network?.id, spoilPristine);
  const operatorPristine = usePristine(flexibleLine.operatorRef, spoilPristine);
  const lineTypePristine = usePristine(flexibleLineType, spoilPristine);

  const onFlexibleLineTypeChange = (flexibleLineType: string | undefined) => {
    if (flexibleLineType !== 'flexibleAreasOnly') {
      return flexibleLineChange({ ...flexibleLine, flexibleLineType });
    }

    const journeyPatterns = flexibleLine.journeyPatterns ?? [];
    const { serviceJourneys } = journeyPatterns[0];

    flexibleLineChange({
      ...flexibleLine,
      journeyPatterns: journeyPatterns.map((journeyPattern: JourneyPattern) => {
        return {
          ...journeyPattern,
          serviceJourneys: serviceJourneys.map(
            (serviceJourney: ServiceJourney) => {
              return {
                ...serviceJourney,
                passingTimes: [{}, {}],
              };
            }
          ),
          pointsInSequence: [{}, {}],
        };
      }),
      flexibleLineType,
    });
  };

  return (
    <div className="lines-editor-general">
      <Heading2> {formatMessage('editorAbout')}</Heading2>
      <section className="inputs">
        <InputGroup
          className="form-section"
          label={formatMessage('generalNameFormGroupTitle')}
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
          label={formatMessage('generalDescriptionFormGroupTitle')}
        >
          <TextField
            value={flexibleLine.description ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({
                ...flexibleLine,
                description: e.target.value,
              })
            }
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage('generalPrivateCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPrivateCodeInputLabelTooltip')}
        >
          <TextField
            type="text"
            value={flexibleLine.privateCode ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({
                ...flexibleLine,
                privateCode: e.target.value,
              })
            }
          />
        </InputGroup>

        <InputGroup
          className="form-section"
          label={formatMessage('generalPublicCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPublicCodeInputLabelTooltip')}
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
                publicCode: e.target.value,
              })
            }
          />
        </InputGroup>

        <Dropdown
          className="form-section"
          value={flexibleLine.operatorRef}
          items={[
            ...operators.map(({ id, name }) => ({ value: id, label: name })),
          ]}
          label={formatMessage('generalOperatorFormGroupTitle')}
          onChange={(element) =>
            flexibleLineChange({ ...flexibleLine, operatorRef: element?.value })
          }
          {...getErrorFeedback(
            formatMessage('operatorRefEmpty'),
            !operatorError,
            operatorPristine
          )}
        />

        <Dropdown
          className="form-section"
          value={flexibleLine.network?.id}
          items={networks.map((n) => ({
            value: n.id ?? '',
            label: n.name ?? '',
          }))}
          label={formatMessage('generalNetworkFormGroupTitle')}
          onChange={(element) =>
            flexibleLineChange({
              ...flexibleLine,
              networkRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('networkRefEmpty'),
            !networkError,
            networkPristine
          )}
        />

        <div className="line-type-dropdown">
          <div
            className="line-type-dropdown-tooltip"
            aria-label={formatMessage('drawerAria')}
            onClick={() => setDrawer(true)}
          >
            {formatMessage('typeFormGroupTitleTooltip')}
          </div>
          <Dropdown
            className="form-section"
            value={flexibleLine.flexibleLineType}
            items={[
              ...Object.values(FLEXIBLE_LINE_TYPE).map((type) => ({
                value: type,
                label: type,
              })),
            ]}
            label={formatMessage('generalTypeFormGroupTitle')}
            onChange={(element) => onFlexibleLineTypeChange(element?.value)}
            {...getErrorFeedback(
              formatMessage('networkRefEmpty'),
              !flexibleLineTypeError,
              lineTypePristine
            )}
          />
        </div>
      </section>

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage('generalDrawerTitle')}
      />
    </div>
  );
};
