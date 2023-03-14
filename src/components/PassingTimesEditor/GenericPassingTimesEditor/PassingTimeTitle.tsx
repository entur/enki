import { useQuaySearch } from 'api/useQuaySearch';
import StopPoint from 'model/StopPoint';
import React, { ReactElement } from 'react';

type Props = {
  stopPoint: StopPoint;
};

const PassingTimeTitle = ({ stopPoint }: Props): ReactElement => {
  const quayRef = stopPoint.quayRef;
  const { stopPlace } = useQuaySearch(quayRef);

  return <div className="title">{stopPlace?.name.value ?? quayRef}</div>;
};

export default PassingTimeTitle;
