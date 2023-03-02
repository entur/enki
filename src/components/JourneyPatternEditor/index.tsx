import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { StopPointsEditor } from 'components/StopPointsEditor/StopPointsEditor';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import { selectIntl } from 'i18n';
import { FlexibleLineType } from 'model/FlexibleLine';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import JourneyPattern from 'model/JourneyPattern';
import StopPoint from 'model/StopPoint';
import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import General from './General';
import './styles.scss';

type Props = {
  journeyPattern: JourneyPattern;
  onSave: (journeyPattern: JourneyPattern) => void;
  onDelete?: () => void;
  spoilPristine: boolean;
  flexibleLineType?: FlexibleLineType;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

const JourneyPatternEditor = ({
  journeyPattern,
  onSave,
  onDelete,
  flexibleStopPlaces,
  spoilPristine,
  flexibleLineType,
}: Props & StateProps) => {
  const { pointsInSequence, serviceJourneys } = journeyPattern;

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { formatMessage } = useSelector(selectIntl);

  const onJourneyPatternChange = (newJourneyPattern: JourneyPattern) => {
    onSave(newJourneyPattern);
  };

  const deleteStopPoint = (stopPointIndex: number) => {
    const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
      ...serviceJourney,
      passingTimes: serviceJourney.passingTimes
        ? removeElementByIndex(serviceJourney.passingTimes, stopPointIndex)
        : [],
    }));

    onJourneyPatternChange({
      ...journeyPattern,
      serviceJourneys: newServiceJourneys,
      pointsInSequence: removeElementByIndex(
        journeyPattern.pointsInSequence,
        stopPointIndex
      ),
    });
  };

  const addStopPoint = () => {
    const newServiceJourneys = serviceJourneys.map((serviceJourney) => ({
      ...serviceJourney,
      passingTimes: [...serviceJourney.passingTimes, {}],
    }));

    onJourneyPatternChange({
      ...journeyPattern,
      pointsInSequence: [...journeyPattern.pointsInSequence, {}],
      serviceJourneys: newServiceJourneys,
    });
  };

  const updateStopPoint = (pointIndex: number, stopPlace: StopPoint) =>
    onJourneyPatternChange({
      ...journeyPattern,
      pointsInSequence: changeElementAtIndex(
        journeyPattern.pointsInSequence,
        stopPlace,
        pointIndex
      ),
    });

  return (
    <div className="journey-pattern-editor">
      <div>
        <section>
          <RequiredInputMarker />
          <General
            journeyPattern={journeyPattern}
            onFieldChange={onJourneyPatternChange}
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

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces: flexibleStopPlaces ?? [],
});

export default connect(mapStateToProps)(JourneyPatternEditor);
