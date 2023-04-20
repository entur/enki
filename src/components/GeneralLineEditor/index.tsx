import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Dropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
import { Heading1 } from '@entur/typography';
import { VEHICLE_MODE, vehicleModeMessages } from 'model/enums';
import './styles.scss';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { Network } from 'model/Network';
import { mapToItems, mapVehicleModeAndLabelToItems } from 'helpers/dropdown';
import VehicleSubModeDropdown from './VehicleSubModeDropdown';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import Line from 'model/Line';
import JourneyPattern from 'model/JourneyPattern';
import ServiceJourney from 'model/ServiceJourney';
import Notices from 'components/Notices';
import { Organisation } from 'model/Organisation';
import { FlexibleLineTypeSelector } from 'components/FlexibleLineTypeSelector/FlexibleLineTypeSelector';

interface Props<T extends Line> {
  line: T;
  operators: Organisation[];
  networks: Network[];
  onChange: <T extends Line>(line: T) => void;
  spoilPristine: boolean;
}

export default <T extends Line>({
  line,
  operators,
  networks,
  onChange,
  spoilPristine,
}: Props<T>) => {
  const { formatMessage } = useIntl();
  const { publicCode } = line;

  const { flexibleLineType, isFlexibleLine } = useMemo(() => {
    const flexibleLineType = (line as FlexibleLine).flexibleLineType;
    const isFlexibleLine = !!flexibleLineType;

    return {
      flexibleLineType,
      isFlexibleLine,
    };
  }, [line]);

  const onFlexibleLineTypeChange = (
    newFlexibleLineType: FlexibleLineType | undefined
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

  const getModeItems = useCallback(
    () => mapVehicleModeAndLabelToItems(vehicleModeMessages, formatMessage),
    [formatMessage]
  );

  const namePristine = usePristine(line.name, spoilPristine);
  const publicCodePristine = usePristine(publicCode, spoilPristine);
  const operatorPristine = usePristine(line.operatorRef, spoilPristine);
  const networkPristine = usePristine(line.networkRef, spoilPristine);
  const modePristine = usePristine(line.transportMode, spoilPristine);

  const getOperatorItems = useCallback(
    () => mapToItems(operators.map((op) => ({ ...op, name: op.name.value }))),
    [operators]
  );

  const getNetworkItems = useCallback(() => mapToItems(networks), [networks]);

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
            namePristine
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
          label={formatMessage({ id: 'generalPublicCodeFormGroupTitle' })}
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
            !isBlank(line.publicCode),
            publicCodePristine
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

        <Dropdown
          value={line.operatorRef || null}
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={getOperatorItems}
          clearable
          label={formatMessage({ id: 'generalOperatorFormGroupTitle' })}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              operatorRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'operatorRefEmpty' }),
            !isBlank(line.operatorRef),
            operatorPristine
          )}
        />

        <Dropdown
          value={line.networkRef || null}
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={getNetworkItems}
          clearable
          label={formatMessage({ id: 'generalNetworkFormGroupTitle' })}
          onChange={(element) =>
            onChange<Line>({
              ...(line as Line),
              networkRef: element?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage({ id: 'networkRefEmpty' }),
            !isBlank(line.networkRef),
            networkPristine
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
          <Dropdown
            value={line.transportMode}
            placeholder={formatMessage({ id: 'defaultOption' })}
            items={getModeItems}
            clearable
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
    </div>
  );
};
