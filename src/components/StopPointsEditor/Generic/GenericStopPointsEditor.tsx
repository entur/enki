import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { GenericStopPointEditor } from './GenericStopPointEditor';
import { useConfig } from '../../../config/ConfigContext';
import { SmallAlertBox } from '@entur/alert';
import '../styles.scss';
import { useCallback, useEffect, useState } from 'react';
import { StopPlace, UttuQuery } from '../../../api';
import { getStopPlacesQuery } from '../../../api/uttu/queries';
import { useAuth } from '../../../auth/auth';
import { useAppSelector } from '../../../store/hooks';
import { ComponentToggle } from '@entur/react-component-toggle';

export const GenericStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
  flexibleLineType,
  transportMode,
  initDefaultJourneyPattern,
  swapStopPoints,
}: StopPointsEditorProps) => {
  const auth = useAuth();
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl } = useConfig();
  const { formatMessage } = useIntl();
  const { sandboxFeatures } = useConfig();
  const isMapEnabled = sandboxFeatures?.JourneyPatternStopPointMap;
  const [focusedQuayId, setFocusedQuayId] = useState<string | undefined | null>(
    undefined,
  );
  /**
   * This state below is most meaningful in case when journey pattern map is enabled (otherwise it would just help in skipping extra calls for fetching a quay by id);
   * Due to map's bounding box filtering, the stop places data may end up missing the stop places that are selected for the journey pattern;
   * Without keeping record of those, there would be problems with (as they rely on quay's location data): "locate" button,
   * drawing polyline into the stop that is outside the view of the bbox, fitting the map view into the bounds of existing jp on initial map load;
   */
  const [stopPlacesInJourneyPattern, setStopPlacesInJourneyPattern] = useState<
    StopPlace[] | undefined
  >(undefined);

  useEffect(() => {
    // if map isn't enabled, let's produce two empty stop points
    if (!isMapEnabled && pointsInSequence?.length === 0) {
      initDefaultJourneyPattern();
    }
  }, []);

  const onFocusedQuayIdUpdate = useCallback(
    (quayId: string | undefined | null) => {
      setFocusedQuayId(quayId);
    },
    [],
  );

  useEffect(() => {
    auth.getAccessToken().then((token) => {
      UttuQuery(
        uttuApiUrl,
        activeProvider,
        getStopPlacesQuery,
        {
          quayIds: pointsInSequence.map((sp) => sp.quayRef).filter((id) => id),
        },
        token,
      ).then((data) => {
        setStopPlacesInJourneyPattern(data?.stopPlaces || []);
      });
    });
  }, []);

  const updateStopPlacesInJourneyPattern = useCallback(
    (newStopPlace: StopPlace) => {
      setStopPlacesInJourneyPattern([
        ...(stopPlacesInJourneyPattern || []),
        newStopPlace,
      ]);
    },
    [stopPlacesInJourneyPattern],
  );

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage({ id: 'editorStopPoints' })}</Heading3>
      {!isMapEnabled && (
        <Paragraph>{formatMessage({ id: 'stopPointsInfoFixed' })}</Paragraph>
      )}
      {stopPlacesInJourneyPattern && (
        <div className={'stop-point-editor-container'}>
          <div
            className={`stop-point-editor ${isMapEnabled ? 'stop-point-editor-width-limit' : ''}`}
          >
            {isMapEnabled && pointsInSequence?.length < 2 && (
              <SmallAlertBox
                className={'stop-point-number-alert'}
                variant={'info'}
              >
                {formatMessage({ id: 'stopPointsMapInfo' })}
              </SmallAlertBox>
            )}
            {pointsInSequence.map((stopPoint, pointIndex) => (
              <GenericStopPointEditor
                key={stopPoint.key}
                order={pointIndex + 1}
                stopPoint={stopPoint}
                spoilPristine={spoilPristine}
                isFirst={pointIndex === 0}
                isLast={pointIndex === pointsInSequence.length - 1}
                onChange={(updatedStopPoint: StopPoint) =>
                  updateStopPoint(pointIndex, updatedStopPoint)
                }
                onDelete={() => deleteStopPoint(pointIndex)}
                canDelete={pointsInSequence.length > 2}
                flexibleLineType={flexibleLineType}
                onFocusedQuayIdUpdate={onFocusedQuayIdUpdate}
                swapStopPoints={swapStopPoints}
                stopPlacesInJourneyPattern={stopPlacesInJourneyPattern}
                updateStopPlacesInJourneyPattern={
                  updateStopPlacesInJourneyPattern
                }
              />
            ))}
            <AddButton
              onClick={() => addStopPoint()}
              buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
            />
          </div>
          <ComponentToggle
            feature={'JourneyPatternStopPointMap'}
            componentProps={{
              pointsInSequence,
              addStopPoint,
              deleteStopPoint,
              transportMode,
              focusedQuayId,
              onFocusedQuayIdUpdate,
              stopPlacesInJourneyPattern,
            }}
          />
        </div>
      )}
      {!stopPlacesInJourneyPattern && (
        <AddButton
          onClick={() => addStopPoint()}
          buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
        />
      )}
    </section>
  );
};
