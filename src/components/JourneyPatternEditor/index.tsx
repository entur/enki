import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useStopPointsEditor } from 'components/StopPointsEditor';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import StopPoint from 'model/StopPoint';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import General from './General';
import './styles.scss';
import { useConfig } from '../../config/ConfigContext';
import { VEHICLE_MODE } from '../../model/enums';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern) => void;
  onDelete?: () => void;
  spoilPristine: boolean;
  flexibleLineType?: FlexibleLineType;
  transportMode?: VEHICLE_MODE;
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  onDelete,
  spoilPristine,
  flexibleLineType,
  transportMode,
}: Props) => {
  const { pointsInSequence, serviceJourneys } = journeyPattern;

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const { sandboxFeatures } = useConfig();

  const deleteStopPoint = useCallback(
    (stopPointIndex: number) => {
      const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
        ...serviceJourney,
        passingTimes: serviceJourney.passingTimes
          ? removeElementByIndex(serviceJourney.passingTimes, stopPointIndex)
          : [],
      }));

      const newPointsInSequence = removeElementByIndex(
        journeyPattern.pointsInSequence,
        stopPointIndex,
      );

      onSave({
        ...journeyPattern,
        serviceJourneys: newServiceJourneys,
        pointsInSequence: newPointsInSequence,
      });
    },
    [journeyPattern, onSave, serviceJourneys],
  );

  const addStopPoint = useCallback(
    (quayRef?: string) => {
      const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
        ...serviceJourney,
        passingTimes: [...serviceJourney.passingTimes, {}],
      }));

      let newPointsInSequence = [
        ...journeyPattern.pointsInSequence,
        quayRef && quayRef ? { quayRef } : {},
      ];

      onSave({
        ...journeyPattern,
        pointsInSequence: newPointsInSequence,
        serviceJourneys: newServiceJourneys,
      });

      if (sandboxFeatures?.JourneyPatternStopPointMap) {
        // To avoid grey area on the map once the container gets bigger in the height:
        window.dispatchEvent(new Event('resize'));
      }
    },
    [journeyPattern, onSave, serviceJourneys],
  );

  const initStopPoints = useCallback(() => {
    onSave({
      ...journeyPattern,
      pointsInSequence: [{}, {}],
      serviceJourneys,
    });
  }, [journeyPattern, onSave, serviceJourneys]);

  const updateStopPoint = useCallback(
    (pointIndex: number, stopPlace: StopPoint) =>
      onSave({
        ...journeyPattern,
        pointsInSequence: changeElementAtIndex(
          journeyPattern.pointsInSequence,
          stopPlace,
          pointIndex,
        ),
      }),
    [journeyPattern, onSave],
  );

  const onPointsInSequenceChange = useCallback(
    (pointsInSequence: StopPoint[]) =>
      onSave({
        ...journeyPattern,
        pointsInSequence,
      }),
    [journeyPattern, onSave],
  );

  const StopPointsEditor = useStopPointsEditor(flexibleLineType);

  return (
    <div className="journey-pattern-editor">
      <div style={{ width: '100%' }}>
        <section>
          <RequiredInputMarker />
          <General
            journeyPattern={journeyPattern}
            onFieldChange={onSave}
            spoilPristine={spoilPristine}
          />
        </section>

        <StopPointsEditor
          pointsInSequence={pointsInSequence}
          flexibleLineType={flexibleLineType}
          spoilPristine={spoilPristine}
          updateStopPoint={updateStopPoint}
          deleteStopPoint={deleteStopPoint}
          addStopPoint={addStopPoint}
          onPointsInSequenceChange={onPointsInSequenceChange}
          transportMode={transportMode}
          initStopPoints={initStopPoints}
        />
      </div>
      {onDelete && (
        <DeleteButton
          onClick={() => setShowDeleteDialog(true)}
          title={formatMessage({ id: 'editorDeleteButtonText' })}
        />
      )}
      {showDeleteDialog && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title={formatMessage({ id: 'journeyPatternDeleteDialogTitle' })}
          message={formatMessage({ id: 'journeyPatternDeleteDialogMessage' })}
          buttons={[
            <SecondaryButton key={2} onClick={() => setShowDeleteDialog(false)}>
              {formatMessage({ id: 'no' })}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={onDelete}>
              {formatMessage({ id: 'yes' })}
            </SuccessButton>,
          ]}
          onDismiss={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default JourneyPatternEditor;
