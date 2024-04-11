import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useStopPointsEditor } from 'components/StopPointsEditor';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import StopPoint from 'model/StopPoint';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import General from './General';
import './styles.scss';
import { TestProps } from '../../ext/test/types';
import { SandboxFeature } from '../../config/SandboxFeature';
import { LatLngExpression, LatLngTuple } from 'leaflet';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern) => void;
  onDelete?: () => void;
  spoilPristine: boolean;
  flexibleLineType?: FlexibleLineType;
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  onDelete,
  spoilPristine,
  flexibleLineType,
}: Props) => {
  const { pointsInSequence, serviceJourneys } = journeyPattern;

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  const deleteStopPoint = useCallback(
    (stopPointIndex: number) => {
      const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
        ...serviceJourney,
        passingTimes: serviceJourney.passingTimes
          ? removeElementByIndex(serviceJourney.passingTimes, stopPointIndex)
          : [],
      }));

      onSave({
        ...journeyPattern,
        serviceJourneys: newServiceJourneys,
        pointsInSequence: removeElementByIndex(
          journeyPattern.pointsInSequence,
          stopPointIndex,
        ),
      });
    },
    [journeyPattern, onSave, serviceJourneys],
  );

  const addStopPoint = useCallback(() => {
    const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
      ...serviceJourney,
      passingTimes: [...serviceJourney.passingTimes, {}],
    }));

    onSave({
      ...journeyPattern,
      pointsInSequence: [...journeyPattern.pointsInSequence, {}],
      serviceJourneys: newServiceJourneys,
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

  const [quayPosition, setQuayPosition] = useState<
    LatLngExpression | undefined
  >();

  return (
    <div className="journey-pattern-editor">
      <div>
        <section>
          <SandboxFeature<TestProps>
            feature="test"
            quayRef={journeyPattern.pointsInSequence[0].quayRef}
            onClick={(position) => setQuayPosition(position)}
          />
          <pre>
            Quay position:{' '}
            {quayPosition ? JSON.stringify(quayPosition) : 'Unknown'}
          </pre>
        </section>
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
