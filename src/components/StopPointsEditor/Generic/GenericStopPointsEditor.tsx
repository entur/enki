import { Heading3, Paragraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import useUniqueKeys from 'hooks/useUniqueKeys';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { StopPointsEditorProps } from '..';
import { GenericStopPointEditor } from './GenericStopPointEditor';
import { JourneyPatternStopPointMap } from '../../../ext/JourneyPatternStopPointMap/JourneyPatternStopPointMap';
import SandboxFeature from '../../../ext/SandboxFeature';
import { useConfig } from '../../../config/ConfigContext';

export const GenericStopPointsEditor = ({
  pointsInSequence,
  spoilPristine,
  updateStopPoint,
  deleteStopPoint,
  addStopPoint,
  addStopPointFromMap,
  flexibleLineType,
  transportMode,
}: StopPointsEditorProps) => {
  const keys = useUniqueKeys(pointsInSequence);
  const { formatMessage } = useIntl();
  const { sandboxFeatures } = useConfig();

  return (
    <section style={{ marginTop: '2em' }}>
      <Heading3>{formatMessage({ id: 'editorStopPoints' })}</Heading3>
      <Paragraph>{formatMessage({ id: 'stopPointsInfoFixed' })}</Paragraph>
      <div className={'stop-point-editor-container'}>
        <div
          className={`stop-point-editor ${sandboxFeatures?.JourneyPatternStopPointMap ? 'stop-point-editor-width-limit' : ''}`}
        >
          {pointsInSequence.map((stopPoint, pointIndex) => (
            <GenericStopPointEditor
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
              flexibleLineType={flexibleLineType}
            />
          ))}
        </div>
        <SandboxFeature
          feature={'JourneyPatternStopPointMap'}
          pointsInSequence={pointsInSequence}
          addStopPoint={addStopPointFromMap}
          deleteStopPoint={deleteStopPoint}
          transportMode={transportMode}
        />
      </div>
      <AddButton
        onClick={addStopPoint}
        buttonTitle={formatMessage({ id: 'editorAddStopPoint' })}
      />
    </section>
  );
};
