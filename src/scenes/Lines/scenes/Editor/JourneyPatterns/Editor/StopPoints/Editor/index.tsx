import React from 'react';
import Form from './Form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';

export type StopPointsFormError = {
  flexibleStopPlaceRefAndQuayRef: any;
  frontText: any;
};

type Props = {
  index: number;
  isFirst: boolean;
  stopPoint: StopPoint;
  onChange: (stopPoint: StopPoint) => void;
  deleteStopPoint?: () => void;
  errors: StopPointsFormError;
  flexibleStopPlaces: FlexibleStopPlace[];
};

const StopPointEditor = (props: Props) => {
  const {
    index,
    flexibleStopPlaces,
    stopPoint,
    isFirst,
    onChange,
    errors,
    deleteStopPoint
  } = props;

  return (
    <div className="stop-point-editor" style={{ marginTop: '2rem' }}>
      <Form
        index={index}
        frontTextRequired={isFirst}
        flexibleStopPlaces={flexibleStopPlaces}
        errors={errors}
        onChange={onChange}
        stopPoint={stopPoint}
        deleteStopPoint={deleteStopPoint}
      />
    </div>
  );
};

export default StopPointEditor;
