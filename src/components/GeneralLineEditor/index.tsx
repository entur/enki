import { Dropdown, SearchableDropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
import { Heading1 } from '@entur/typography';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import { FlexibleLineTypeSelector } from 'components/FlexibleLineTypeSelector/FlexibleLineTypeSelector';
import Notices from 'components/Notices';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { mapToItems, mapVehicleModeAndLabelToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import Line from 'model/Line';
import { Network } from 'model/Network';
import { Organisation } from 'model/Organisation';
import ServiceJourney from 'model/ServiceJourney';
import { VEHICLE_MODE, vehicleModeMessages } from 'model/enums';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import VehicleSubModeDropdown from './VehicleSubModeDropdown';
import './styles.scss';
import { Branding } from '../../model/Branding';
import { useConfig } from '../../config/ConfigContext';
import { MessagesKey } from '../../i18n/translationKeys';

interface Props<T extends Line> {
  line: T;
  operators: Organisation[];
  networks: Network[];
  brandings: Branding[];
  onChange: <T extends Line>(line: T) => void;
  spoilPristine: boolean;
}

export default <T extends Line>({
  line,
  operators,
  networks,
  brandings,
  onChange,
  spoilPristine,
}: Props<T>) => {
  const { formatMessage } = useIntl();
  const { publicCode } = line;
  const { lineSupportedVehicleModes } = useConfig();

  const { flexibleLineType, isFlexibleLine } = useMemo(() => {
    const flexibleLineType = (line as FlexibleLine).flexibleLineType;
    const isFlexibleLine = !!flexibleLineType;

    return {
      flexibleLineType,
      isFlexibleLine,
    };
  }, [line]);

  const onFlexibleLineTypeChange = (
    newFlexibleLineType: FlexibleLineType | undefined,
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
              passingTimes: [],
            }),
          ),
          pointsInSequence: [],
        }),
      ),
      flexibleLineType: newFlexibleLineType,
    });
  };

  const getModeItems = useCallback(
    () =>
      mapVehicleModeAndLabelToItems(
        lineSupportedVehicleModes && lineSupportedVehicleModes.length > 0
          ? getSupportedVehicleModeMessages()
          : vehicleModeMessages,
        formatMessage,
      ),
    [formatMessage],
  );

  const getSupportedVehicleModeMessages = (): Record<
    VEHICLE_MODE,
    keyof MessagesKey
  > => {
    const supportedVehicleModeMessages: Record<string, string> = {};
    lineSupportedVehicleModes?.forEach((mode) => {
      supportedVehicleModeMessages[mode] = vehicleModeMessages[mode];
    });
    return supportedVehicleModeMessages as Record<
      VEHICLE_MODE,
      keyof MessagesKey
    >;
  };

  const namePristine = usePristine(line.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const operatorPristine = usePristine(line.operatorRef, spoilPristine);
  const networkPristine = usePristine(line.networkRef, spoilPristine);
  const modePristine = usePristine(line.transportMode, spoilPristine);

  const getOperatorItems = useCallback(
    () => mapToItems(operators.map((op) => ({ ...op, name: op.name.value }))),
    [operators],
  );

  const getNetworkItems = useCallback(() => mapToItems(networks), [networks]);

  const getBrandingItems = useCallback(
    () => mapToItems(brandings),
    [brandings],
  );

  const config = useConfig();

  return (
    <div className="lines-editor-general">
      <Heading1> {formatMessage({ id: 'editorAbout' })}</Heading1>
      <RequiredInputMarker />
      <section className="inputs">
        <TextField
          label={formatMessage({ id: 'generalNameFormGroupTitle' })}
          value={line.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              name: e.target.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'nameEmpty' }),
            !isBlank(line.name),
            namePristine,
          )}
        />

        <TextField
          label={formatMessage({ id: 'generalDescriptionFormGroupTitle' })}
          value={line.description ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              description: e.target.value || null,
            })
          }
        />

        <TextField
          label={formatMessage(
            { id: 'generalPublicCodeFormGroupTitle' },
            {
              requiredMarker: !config.optionalPublicCodeOnLine ? '*' : '',
            },
          )}
          labelTooltip={formatMessage({
            id: 'generalPublicCodeInputLabelTooltip',
          })}
          type="text"
          value={line.publicCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              publicCode: e.target.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'publicCodeEmpty' }),
            !isBlank(line.publicCode) || !!config.optionalPublicCodeOnLine,
            publicCodePristine,
          )}
        />

        <TextField
          label={formatMessage({ id: 'generalPrivateCodeFormGroupTitle' })}
          labelTooltip={formatMessage({
            id: 'generalPrivateCodeInputLabelTooltip',
          })}
          type="text"
          value={line.privateCode ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              privateCode: e.target.value || null,
            })
          }
        />

        <SearchableDropdown<string>
          selectedItem={
            getOperatorItems().find(
              (item) => item.value === line.operatorRef,
            ) || null
          }
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={getOperatorItems}
          clearable
          labelClearSelectedItem={formatMessage({ id: 'clearSelected' })}
          label={formatMessage({ id: 'generalOperatorFormGroupTitle' })}
          noMatchesText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              operatorRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'operatorRefEmpty' }),
            !isBlank(line.operatorRef),
            operatorPristine,
          )}
        />

        <Dropdown<string>
          selectedItem={
            getNetworkItems().find((item) => item.value === line.networkRef) ||
            null
          }
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={getNetworkItems}
          clearable
          labelClearSelectedItem={formatMessage({ id: 'clearSelected' })}
          label={formatMessage({ id: 'generalNetworkFormGroupTitle' })}
          noMatchesText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              networkRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'networkRefEmpty' }),
            !isBlank(line.networkRef),
            networkPristine,
          )}
        />

        <Dropdown<string>
          items={getBrandingItems}
          selectedItem={
            getBrandingItems().find(
              (item) => item.value === line.brandingRef,
            ) || null
          }
          clearable
          labelClearSelectedItem={formatMessage({ id: 'clearSelected' })}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              brandingRef: element?.value,
            })
          }
          label={formatMessage({ id: 'brandingsDropdownLabelText' })}
          noMatchesText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
        />

        {isFlexibleLine && (
          <section className="line-type-dropdown">
            <FlexibleLineTypeSelector
              flexibleLineType={flexibleLineType}
              onChange={onFlexibleLineTypeChange}
              spoilPristine={spoilPristine}
            />
          </section>
        )}

        <section className="transport-mode-dropdowns">
          <Dropdown
            selectedItem={
              getModeItems().find(
                (item) => item.value === line.transportMode,
              ) || null
            }
            placeholder={formatMessage({ id: 'defaultOption' })}
            items={getModeItems}
            clearable
            labelClearSelectedItem={formatMessage({ id: 'clearSelected' })}
            label={formatMessage({ id: 'transportModeTitle' })}
            onChange={(element) =>
              onChange<Line>({
                ...(line as Line),
                transportMode: element?.value as VEHICLE_MODE,
                transportSubmode: undefined,
              })
            }
            {...getErrorFeedback(
              formatMessage({ id: 'transportModeEmpty' }),
              !isBlank(line.transportMode),
              modePristine,
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
    </div>
  );
};
