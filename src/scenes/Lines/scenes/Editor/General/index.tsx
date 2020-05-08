import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { InputGroup, TextField } from '@entur/form';
import { Heading1 } from '@entur/typography';
import {
  FLEXIBLE_LINE_TYPE,
  VEHICLE_MODE,
  vehicleModeMessages,
} from 'model/enums';
import { selectIntl } from 'i18n';
import './styles.scss';
import FlexibleLine from 'model/FlexibleLine';
import { Organisation } from 'reducers/organisations';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import ServiceJourney from 'model/ServiceJourney';
import JourneyPattern from 'model/JourneyPattern';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { Network } from 'model/Network';
import {
  getEnumInit,
  getInit,
  mapEnumToItems,
  mapToItems,
  mapVehicleModeAndLabelToItems,
  vehicleModeInit,
} from 'helpers/dropdown';
import VehicleSubModeDropdown from './VehicleSubModeDropdown';

type Props = {
  flexibleLine: FlexibleLine;
  operators: Organisation[];
  networks: Network[];
  flexibleLineChange: (flexibleLine: FlexibleLine) => void;
  spoilPristine: boolean;
  isFlexibleLine: boolean;
};

export default ({
  flexibleLine,
  operators,
  networks,
  flexibleLineChange,
  spoilPristine,
  isFlexibleLine,
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { publicCode, flexibleLineType } = flexibleLine;
  const [showDrawer, setDrawer] = useState<boolean>(false);

  const namePristine = usePristine(flexibleLine.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const operatorPristine = usePristine(flexibleLine.operatorRef, spoilPristine);
  const networkPristine = usePristine(flexibleLine.networkRef, spoilPristine);
  const lineTypePristine = usePristine(flexibleLineType, spoilPristine);
  const modePristine = usePristine(flexibleLine.transportMode, spoilPristine);

  const onFlexibleLineTypeChange = (flexibleLineType: string | undefined) => {
    if (flexibleLineType !== 'flexibleAreasOnly') {
      return flexibleLineChange({ ...flexibleLine, flexibleLineType });
    }

    const journeyPatterns = flexibleLine.journeyPatterns ?? [];
    const { serviceJourneys } = journeyPatterns[0];

    flexibleLineChange({
      ...flexibleLine,
      journeyPatterns: journeyPatterns.map(
        (journeyPattern: JourneyPattern) => ({
          ...journeyPattern,
          serviceJourneys: serviceJourneys.map(
            (serviceJourney: ServiceJourney) => ({
              ...serviceJourney,
              passingTimes: [{}, {}],
            })
          ),
          pointsInSequence: [{}, {}],
        })
      ),
      flexibleLineType,
    });
  };

  return (
    <div className="lines-editor-general">
      <Heading1> {formatMessage('editorAbout')}</Heading1>
      <RequiredInputMarker />
      <section className="inputs">
        <InputGroup
          label={formatMessage('generalNameFormGroupTitle')}
          {...getErrorFeedback(
            formatMessage('nameEmpty'),
            !isBlank(flexibleLine.name),
            namePristine
          )}
        >
          <TextField
            defaultValue={flexibleLine.name ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              flexibleLineChange({ ...flexibleLine, name: e.target.value })
            }
          />
        </InputGroup>

        <InputGroup label={formatMessage('generalDescriptionFormGroupTitle')}>
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
          label={formatMessage('generalPublicCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPublicCodeInputLabelTooltip')}
          {...getErrorFeedback(
            formatMessage('publicCodeEmpty'),
            !isBlank(flexibleLine.publicCode),
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
          initialSelectedItem={vehicleModeInit(
            vehicleModeMessages,
            formatMessage,
            flexibleLine.transportMode
          )}
          placeholder={formatMessage('defaultOption')}
          items={mapVehicleModeAndLabelToItems(
            vehicleModeMessages,
            formatMessage
          )}
          clearable
          label={formatMessage('transportModeTitle')}
          onChange={(element) =>
            flexibleLineChange({
              ...flexibleLine,
              transportMode: element?.value as VEHICLE_MODE,
              transportSubmode: undefined,
            })
          }
          {...getErrorFeedback(
            formatMessage('transportModeEmpty'),
            !isBlank(flexibleLine.transportMode),
            modePristine
          )}
        />

        {flexibleLine.transportMode && (
          <VehicleSubModeDropdown
            transportMode={flexibleLine.transportMode}
            transportSubmode={flexibleLine.transportSubmode}
            submodeChange={(submode) =>
              flexibleLineChange({ ...flexibleLine, transportSubmode: submode })
            }
            spoilPristine={spoilPristine}
          />
        )}

        <Dropdown
          initialSelectedItem={getInit(operators, flexibleLine.operatorRef)}
          placeholder={formatMessage('defaultOption')}
          items={mapToItems(operators)}
          clearable
          label={formatMessage('generalOperatorFormGroupTitle')}
          onChange={(element) =>
            flexibleLineChange({ ...flexibleLine, operatorRef: element?.value })
          }
          {...getErrorFeedback(
            formatMessage('operatorRefEmpty'),
            !isBlank(flexibleLine.operatorRef),
            operatorPristine
          )}
        />

        <Dropdown
          initialSelectedItem={getInit(networks, flexibleLine.networkRef)}
          placeholder={formatMessage('defaultOption')}
          items={mapToItems(networks)}
          clearable
          label={formatMessage('generalNetworkFormGroupTitle')}
          onChange={(element) =>
            flexibleLineChange({ ...flexibleLine, networkRef: element?.value })
          }
          {...getErrorFeedback(
            formatMessage('networkRefEmpty'),
            !isBlank(flexibleLine.networkRef),
            networkPristine
          )}
        />

        {isFlexibleLine && (
          <div className="line-type-dropdown">
            <div
              className="line-type-dropdown-tooltip"
              aria-label={formatMessage('drawerAria')}
              onClick={() => setDrawer(true)}
            >
              {formatMessage('typeFormGroupTitleTooltip')}
            </div>
            {
              <Dropdown
                className="flexible-line-type"
                initialSelectedItem={getEnumInit(flexibleLineType)}
                placeholder={formatMessage('defaultOption')}
                items={mapEnumToItems(FLEXIBLE_LINE_TYPE)}
                clearable
                label={formatMessage('generalTypeFormGroupTitle')}
                onChange={(element) => onFlexibleLineTypeChange(element?.value)}
                {...getErrorFeedback(
                  formatMessage('flexibleLineTypeEmpty'),
                  !isBlank(flexibleLine.flexibleLineType),
                  lineTypePristine
                )}
              />
            }
          </div>
        )}
      </section>

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage('generalDrawerTitle')}
      />
    </div>
  );
};
