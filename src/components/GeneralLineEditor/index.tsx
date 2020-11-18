import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
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
import usePristine from 'hooks/usePristine';
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
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';

type Props = {
  flexibleLine: FlexibleLine;
  operators: Organisation[];
  networks: Network[];
  flexibleLineChange: (flexibleLine: FlexibleLine) => void;
  spoilPristine: boolean;
  isFlexibleLine?: boolean;
};

export default ({
  flexibleLine,
  operators,
  networks,
  flexibleLineChange,
  spoilPristine,
  isFlexibleLine = false,
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

  const onFlexibleLineTypeChange = (
    newFlexibleLineType: string | undefined
  ) => {
    if (newFlexibleLineType !== 'flexibleAreasOnly') {
      return flexibleLineChange({
        ...flexibleLine,
        flexibleLineType: newFlexibleLineType,
      });
    }

    const journeyPatterns = flexibleLine.journeyPatterns ?? [];

    flexibleLineChange({
      ...flexibleLine,
      journeyPatterns: journeyPatterns.map(
        (journeyPattern: JourneyPattern) => ({
          ...journeyPattern,
          serviceJourneys: journeyPattern.serviceJourneys.map(
            (serviceJourney: ServiceJourney) => ({
              ...serviceJourney,
              passingTimes: [{}, {}],
            })
          ),
          pointsInSequence: [{}, {}],
        })
      ),
      flexibleLineType: newFlexibleLineType,
    });
  };

  return (
    <div className="lines-editor-general">
      <Heading1> {formatMessage('editorAbout')}</Heading1>
      <RequiredInputMarker />
      <section className="inputs">
        <TextField
          label={formatMessage('generalNameFormGroupTitle')}
          value={flexibleLine.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            flexibleLineChange({ ...flexibleLine, name: e.target.value })
          }
          {...getErrorFeedback(
            formatMessage('nameEmpty'),
            !isBlank(flexibleLine.name),
            namePristine
          )}
        />

        <TextField
          label={formatMessage('generalDescriptionFormGroupTitle')}
          value={flexibleLine.description ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            flexibleLineChange({
              ...flexibleLine,
              description: e.target.value,
            })
          }
        />

        <TextField
          label={formatMessage('generalPublicCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPublicCodeInputLabelTooltip')}
          type="text"
          value={flexibleLine.publicCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            flexibleLineChange({
              ...flexibleLine,
              publicCode: e.target.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('publicCodeEmpty'),
            !isBlank(flexibleLine.publicCode),
            publicCodePristine
          )}
        />

        <TextField
          label={formatMessage('generalPrivateCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPrivateCodeInputLabelTooltip')}
          type="text"
          value={flexibleLine.privateCode ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            flexibleLineChange({
              ...flexibleLine,
              privateCode: e.target.value,
            })
          }
        />

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
          <section className="line-type-dropdown">
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
          </section>
        )}
        <section className="transport-mode-dropdowns">
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
                flexibleLineChange({
                  ...flexibleLine,
                  transportSubmode: submode,
                })
              }
              spoilPristine={spoilPristine}
            />
          )}
        </section>
      </section>

      {isFlexibleLine && (
        <BookingArrangementEditor
          bookingArrangement={flexibleLine.bookingArrangement}
          spoilPristine={spoilPristine}
          bookingInfoAttachment={{
            type: BookingInfoAttachmentType.LINE,
            name: flexibleLine.name!,
          }}
          onChange={(bookingArrangement) => {
            flexibleLineChange({
              ...flexibleLine,
              bookingArrangement,
            });
          }}
          onRemove={() => {
            const { bookingArrangement, ...updatedFlexibleLine } = flexibleLine;
            flexibleLineChange(updatedFlexibleLine);
          }}
        />
      )}

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage('generalDrawerTitle')}
      />
    </div>
  );
};
