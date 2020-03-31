import React from 'react';
import StopPoint from 'model/StopPoint';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import './styles.scss';

type Props = {
  flexibleStopPlaces: FlexibleStopPlace[];
  stopPoints: StopPoint[];
  children: any;
};

const FlexibleAreasPassingTime = (props: Props) => {
  return <div className="flexible-areas-passing-time">{props.children}</div>;
};

export default FlexibleAreasPassingTime;
