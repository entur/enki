import { Autocomplete, TextField, Typography } from '@mui/material';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import { FlexibleLineTypeSelector } from 'components/FlexibleLineTypeSelector/FlexibleLineTypeSelector';
import Notices from 'components/Notices';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { mapToItems, mapVehicleModeAndLabelToItems } from 'helpers/dropdown';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
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

  const operatorItems = getOperatorItems();
  const networkItems = getNetworkItems();
  const brandingItems = getBrandingItems();
  const modeItems = getModeItems();

  return (
    <div className="lines-editor-general">
      <Typography variant="h1">
        {' '}
        {formatMessage({ id: 'editorAbout' })}
      </Typography>
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
          {...getMuiErrorProps(
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
          type="text"
          value={line.publicCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              publicCode: e.target.value,
            })
          }
          {...getMuiErrorProps(
            formatMessage({ id: 'publicCodeEmpty' }),
            !isBlank(line.publicCode) || !!config.optionalPublicCodeOnLine,
            publicCodePristine,
          )}
        />

        <TextField
          label={formatMessage({ id: 'generalPrivateCodeFormGroupTitle' })}
          type="text"
          value={line.privateCode ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange<Line>({
              ...(line as Line),
              privateCode: e.target.value || null,
            })
          }
        />

        <Autocomplete
          value={
            operatorItems.find((item) => item.value === line.operatorRef) ||
            null
          }
          options={operatorItems}
          getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_e, element) =>
            onChange<Line>({
              ...(line as Line),
              operatorRef: element?.value,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: 'generalOperatorFormGroupTitle' })}
              placeholder={formatMessage({ id: 'defaultOption' })}
              {...getMuiErrorProps(
                formatMessage({ id: 'operatorRefEmpty' }),
                !isBlank(line.operatorRef),
                operatorPristine,
              )}
            />
          )}
        />

        <Autocomplete
          value={
            networkItems.find((item) => item.value === line.networkRef) || null
          }
          options={networkItems}
          getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_e, element) =>
            onChange<Line>({
              ...(line as Line),
              networkRef: element?.value,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: 'generalNetworkFormGroupTitle' })}
              placeholder={formatMessage({ id: 'defaultOption' })}
              {...getMuiErrorProps(
                formatMessage({ id: 'networkRefEmpty' }),
                !isBlank(line.networkRef),
                networkPristine,
              )}
            />
          )}
        />

        <Autocomplete
          value={
            brandingItems.find((item) => item.value === line.brandingRef) ||
            null
          }
          options={brandingItems}
          getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_e, element) =>
            onChange<Line>({
              ...(line as Line),
              brandingRef: element?.value,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: 'brandingsDropdownLabelText' })}
            />
          )}
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
          <Autocomplete
            value={
              modeItems.find((item) => item.value === line.transportMode) ||
              null
            }
            options={modeItems}
            getOptionLabel={(option: NormalizedDropdownItemType) =>
              option.label
            }
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_e, element) =>
              onChange<Line>({
                ...(line as Line),
                transportMode: element?.value as VEHICLE_MODE,
                transportSubmode: undefined,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: 'transportModeTitle' })}
                placeholder={formatMessage({ id: 'defaultOption' })}
                {...getMuiErrorProps(
                  formatMessage({ id: 'transportModeEmpty' }),
                  !isBlank(line.transportMode),
                  modePristine,
                )}
              />
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
