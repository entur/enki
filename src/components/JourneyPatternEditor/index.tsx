import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import General from './General';
import { Paragraph, Heading3 } from '@entur/typography';
import { changeElementAtIndex, removeElementByIndex } from 'helpers/arrays';
import StopPoint from 'model/StopPoint';
import AddButton from 'components/AddButton/AddButton';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import JourneyPattern from 'model/JourneyPattern';
import RequiredInputMarker from 'components/RequiredInputMarker';
import useUniqueKeys from 'hooks/useUniqueKeys';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import ConfirmDialog from 'components/ConfirmDialog';
import { SecondaryButton, SuccessButton } from '@entur/button';
import './styles.scss';
import { useStopPointEditor } from 'components/StopPointEditor';
import { FlexibleLineType } from 'model/FlexibleLine';

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

  const keys = useUniqueKeys(pointsInSequence);

  const StopPointEditor = useStopPointEditor(flexibleLineType);

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

        <section style={{ marginTop: '2em' }}>
          <Heading3>{formatMessage('editorStopPoints')}</Heading3>
          <Paragraph>
            {flexibleLineType
              ? formatMessage('stopPointsInfo')
              : formatMessage('stopPointsInfoFixed')}
          </Paragraph>
          <div className="stop-point-editor">
            {pointsInSequence.map((stopPoint, pointIndex) => (
              <StopPointEditor
                key={keys[pointIndex]}
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
              />
            ))}
          </div>
          <AddButton
            onClick={addStopPoint}
            buttonTitle={formatMessage('editorAddStopPoint')}
          />
        </section>
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
