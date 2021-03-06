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
import Line from 'model/Line';
import JourneyPattern from 'model/JourneyPattern';
import ServiceJourney from 'model/ServiceJourney';
import Notices from 'components/Notices';

interface Props<T extends Line> {
  line: T;
  operators: Organisation[];
  networks: Network[];
  onChange: <T>(line: T) => void;
  spoilPristine: boolean;
}

export default <T extends Line>({
  line,
  operators,
  networks,
  onChange,
  spoilPristine,
}: Props<T>) => {
  const { formatMessage } = useSelector(selectIntl);
  const { publicCode } = line;

  let flexibleLineType: string | undefined;
  let isFlexibleLine = false;

  if ((line as FlexibleLine).flexibleLineType) {
    isFlexibleLine = true;
    flexibleLineType = (line as FlexibleLine).flexibleLineType;
  }

  const onFlexibleLineTypeChange = (
    newFlexibleLineType: string | undefined
  ) => {
    if (newFlexibleLineType !== 'flexibleAreasOnly') {
      return onChange<FlexibleLine>({
        ...(line as FlexibleLine),
        flexibleLineType: newFlexibleLineType,
      });
    }

    const journeyPatterns = line.journeyPatterns ?? [];

    onChange<FlexibleLine>({
      ...(line as FlexibleLine),
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

  const [showDrawer, setDrawer] = useState<boolean>(false);

  const namePristine = usePristine(line.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const operatorPristine = usePristine(line.operatorRef, spoilPristine);
  const networkPristine = usePristine(line.networkRef, spoilPristine);
  const lineTypePristine = usePristine(flexibleLineType, spoilPristine);
  const modePristine = usePristine(line.transportMode, spoilPristine);

  return (
    <div className="lines-editor-general">
      <Heading1> {formatMessage('editorAbout')}</Heading1>
      <RequiredInputMarker />
      <section className="inputs">
        <TextField
          label={formatMessage('generalNameFormGroupTitle')}
          value={line.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              name: e.target.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('nameEmpty'),
            !isBlank(line.name),
            namePristine
          )}
        />

        <TextField
          label={formatMessage('generalDescriptionFormGroupTitle')}
          value={line.description ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              description: e.target.value || null,
            })
          }
        />

        <TextField
          label={formatMessage('generalPublicCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPublicCodeInputLabelTooltip')}
          type="text"
          value={line.publicCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              publicCode: e.target.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('publicCodeEmpty'),
            !isBlank(line.publicCode),
            publicCodePristine
          )}
        />

        <TextField
          label={formatMessage('generalPrivateCodeFormGroupTitle')}
          labelTooltip={formatMessage('generalPrivateCodeInputLabelTooltip')}
          type="text"
          value={line.privateCode ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              privateCode: e.target.value || null,
            })
          }
        />

        <Dropdown
          initialSelectedItem={getInit(operators, line.operatorRef)}
          placeholder={formatMessage('defaultOption')}
          items={mapToItems(operators)}
          clearable
          label={formatMessage('generalOperatorFormGroupTitle')}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              operatorRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('operatorRefEmpty'),
            !isBlank(line.operatorRef),
            operatorPristine
          )}
        />

        <Dropdown
          initialSelectedItem={getInit(networks, line.networkRef)}
          placeholder={formatMessage('defaultOption')}
          items={mapToItems(networks)}
          clearable
          label={formatMessage('generalNetworkFormGroupTitle')}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              networkRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('networkRefEmpty'),
            !isBlank(line.networkRef),
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
                value={flexibleLineType}
                label={formatMessage('generalTypeFormGroupTitle')}
                onChange={(element) =>
                  onFlexibleLineTypeChange &&
                  onFlexibleLineTypeChange(element?.value)
                }
                {...getErrorFeedback(
                  formatMessage('flexibleLineTypeEmpty'),
                  !isBlank((line as FlexibleLine).flexibleLineType),
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
              line.transportMode
            )}
            placeholder={formatMessage('defaultOption')}
            items={mapVehicleModeAndLabelToItems(
              vehicleModeMessages,
              formatMessage
            )}
            clearable
            label={formatMessage('transportModeTitle')}
            onChange={(element) =>
              onChange<Line>({
                ...(line as Line),
                transportMode: element?.value as VEHICLE_MODE,
                transportSubmode: undefined,
              })
            }
            {...getErrorFeedback(
              formatMessage('transportModeEmpty'),
              !isBlank(line.transportMode),
              modePristine
            )}
          />

          {line.transportMode && (
            <VehicleSubModeDropdown
              transportMode={line.transportMode}
              transportSubmode={line.transportSubmode}
              submodeChange={(submode) =>
                onChange<Line>({
                  ...(line as Line),
                  transportSubmode: submode,
                })
              }
              spoilPristine={spoilPristine}
            />
          )}
        </section>
      </section>

      <Notices
        notices={line.notices}
        setNotices={(notices) => {
          onChange<Line>({
            ...(line as Line),
            notices,
          });
        }}
        formatMessage={formatMessage}
      />

      {isFlexibleLine && (
        <BookingArrangementEditor
          bookingArrangement={(line as FlexibleLine).bookingArrangement}
          spoilPristine={spoilPristine}
          bookingInfoAttachment={{
            type: BookingInfoAttachmentType.LINE,
            name: line.name!,
          }}
          onChange={(bookingArrangement) => {
            onChange<FlexibleLine>({
              ...(line as FlexibleLine),
              bookingArrangement,
            });
          }}
          onRemove={() => {
            onChange<FlexibleLine>({
              ...(line as FlexibleLine),
              bookingArrangement: null,
            });
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
