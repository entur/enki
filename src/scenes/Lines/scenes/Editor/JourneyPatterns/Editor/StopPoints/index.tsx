import React from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import StopPointEditor from './Editor';
import messages from '../messages';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { GlobalState } from 'reducers';
import { validateStopPoint } from './Editor/validateForm';
import AddButton from 'components/AddButton/AddButton';
import StopPoint from 'model/StopPoint';

type Props = {
  stopPoints: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: () => void;
  onChange: (stopPoints: StopPoint[]) => void;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[] | null;
};

const StopPointsEditor = ({
  stopPoints,
  deleteStopPoint,
  addStopPoint,
  onChange,
  flexibleStopPlaces
}: Props & StateProps) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateStopPoint = (index: number, stopPlace: StopPoint) => {
    onChange(replaceElement(stopPoints, index, stopPlace));
  };

  const keys = useUniqueKeys(stopPoints);

  return (
    <>
      {stopPoints.map((stopPoint, index) => (
        <StopPointEditor
          key={keys[index]}
          index={index}
          isFirst={index === 0}
          stopPoint={stopPoint}
          errors={validateStopPoint(stopPoint, index === 0)}
          deleteStopPoint={
            stopPoints.length > 2 ? () => deleteStopPoint(index) : undefined
          }
          onChange={(stopPoint: StopPoint) => updateStopPoint(index, stopPoint)}
          flexibleStopPlaces={flexibleStopPlaces ?? []}
        />
      ))}
      <AddButton
        onClick={addStopPoint}
        buttonTitle={formatMessage(messages.addStopPoint)}
      />
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces
});

export default connect(mapStateToProps)(StopPointsEditor);
