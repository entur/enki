import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useStopPointsEditor } from 'components/StopPointsEditor';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import StopPoint from 'model/StopPoint';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import General from './General';
import './styles.scss';
import { useConfig } from '../../config/ConfigContext';
import { VEHICLE_MODE } from '../../model/enums';
import ServiceJourney from '../../model/ServiceJourney';
import { createUuid } from '../../helpers/generators';
import { getJourneyPatternWithSwappedStopPoints } from './helpers';
import DeleteActionChip from '../DeleteActionChip';
import CopyActionChip from '../CopyActionChip';
import CopyDialog from './CopyDialog';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern) => void;
  onDelete?: () => void;
  onCopy: (jpName: string) => void;
  spoilPristine: boolean;
  flexibleLineType?: FlexibleLineType;
  transportMode?: VEHICLE_MODE;
  journeyPatternsNames: string[];
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  onDelete,
  spoilPristine,
  flexibleLineType,
  transportMode,
  onCopy,
  journeyPatternsNames,
}: Props) => {
  const { pointsInSequence, serviceJourneys } = journeyPattern;
  const journeyPatternRef = useRef<any>({
    pointsInSequence: [],
    serviceJourneys: [],
  });

  useEffect(() => {
    journeyPatternRef.current = {
      journeyPattern,
    };
  }, [journeyPattern, journeyPatternRef.current]);

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCopyDialog, setShowCopyDialog] = useState<boolean>(false);
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

      const key = createUuid();

      let newPointsInSequence = [
        ...journeyPattern.pointsInSequence,
        quayRef && quayRef ? { quayRef, key } : { key },
      ];

      onSave({
        ...journeyPattern,
        pointsInSequence: newPointsInSequence,
        serviceJourneys: newServiceJourneys,
      });
    },
    [journeyPattern, onSave, serviceJourneys],
  );

  const addStopPointForMap = useCallback(
    (quayRef?: string) => {
      const newServiceJourneys =
        journeyPatternRef.current.journeyPattern.serviceJourneys.map(
          (serviceJourney: ServiceJourney) => ({
            ...serviceJourney,
            passingTimes: [...serviceJourney.passingTimes, {}],
          }),
        );

      const key = createUuid();

      let newPointsInSequence = [
        ...journeyPatternRef.current.journeyPattern.pointsInSequence,
        quayRef ? { quayRef, key } : { key },
      ];

      onSave({
        ...journeyPatternRef.current.journeyPattern,
        pointsInSequence: newPointsInSequence,
        serviceJourneys: newServiceJourneys,
      });
    },
    [journeyPatternRef],
  );

  const initDefaultJourneyPattern = useCallback(() => {
    onSave({
      ...journeyPattern,
      pointsInSequence: [{ key: createUuid() }, { key: createUuid() }],
      serviceJourneys: journeyPattern.serviceJourneys.map(
        (serviceJourney: ServiceJourney) => ({
          ...serviceJourney,
          passingTimes: [{}, {}],
        }),
      ),
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

  const swapStopPoints = useCallback(
    (positionIndex1: number, positionIndex2: number) => {
      const updatedJourneyPattern: JourneyPattern =
        getJourneyPatternWithSwappedStopPoints(
          positionIndex1,
          positionIndex2,
          journeyPattern,
        );
      onSave(updatedJourneyPattern);
    },
    [journeyPattern],
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
          addStopPoint={
            sandboxFeatures?.JourneyPatternStopPointMap
              ? addStopPointForMap
              : addStopPoint
          }
          onPointsInSequenceChange={onPointsInSequenceChange}
          transportMode={transportMode}
          initDefaultJourneyPattern={initDefaultJourneyPattern}
          swapStopPoints={swapStopPoints}
        />
      </div>
      <div className="journey-pattern-editor-action-chips">
        {onDelete && (
          <DeleteActionChip
            className="journey-pattern-editor-action-chip"
            onClick={() => setShowDeleteDialog(true)}
            title={formatMessage({ id: 'editorDeleteButtonText' })}
          />
        )}
        <CopyActionChip
          className="journey-pattern-editor-action-chip"
          title={formatMessage({ id: 'editorCopyButtonText' })}
          onClick={() => setShowCopyDialog(true)}
        />
      </div>

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
      {showCopyDialog && (
        <CopyDialog
          open={showCopyDialog}
          journeyPattern={journeyPattern}
          onSave={(jpName: string) => {
            onCopy(jpName);
            setShowCopyDialog(false);
          }}
          onDismiss={() => setShowCopyDialog(false)}
          journeyPatternsNames={journeyPatternsNames}
        />
      )}
    </div>
  );
};

export default JourneyPatternEditor;
