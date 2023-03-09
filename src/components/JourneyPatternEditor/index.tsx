import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { useStopPointsEditor } from 'components/StopPointsEditor';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import { selectIntl } from 'i18n';
import { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import StopPoint from 'model/StopPoint';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import General from './General';
import './styles.scss';

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
  const { formatMessage } = useSelector(selectIntl);

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
          stopPointIndex
        ),
      });
    },
    [journeyPattern, onSave, serviceJourneys]
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
          pointIndex
        ),
      }),
    [journeyPattern, onSave]
  );

  const onPointsInSequenceChange = useCallback(
    (pointsInSequence: StopPoint[]) =>
      onSave({
        ...journeyPattern,
        pointsInSequence,
      }),
    [journeyPattern, onSave]
  );

  const StopPointsEditor = useStopPointsEditor(flexibleLineType);

  return (
    <div className="journey-pattern-editor">
      <div>
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
          title={formatMessage('editorDeleteButtonText')}
        />
      )}
      {showDeleteDialog && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title={formatMessage('journeyPatternDeleteDialogTitle')}
          message={formatMessage('journeyPatternDeleteDialogMessage')}
          buttons={[
            <SecondaryButton key={2} onClick={() => setShowDeleteDialog(false)}>
              {formatMessage('no')}
            </SecondaryButton>,
            <SuccessButton key={1} onClick={onDelete}>
              {formatMessage('yes')}
            </SuccessButton>,
          ]}
          onDismiss={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default JourneyPatternEditor;
