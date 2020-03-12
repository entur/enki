import React, { ReactElement, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondarySquareButton } from '@entur/button';
import { StopPoint } from 'model';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import StopPointEditor from './Editor';
import messages from '../messages';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { GlobalState } from 'reducers';
import searchForQuay from './Editor/searchForQuay';
import { Paragraph } from '@entur/typography';
import { validateStopPoint } from './Editor/validateForm';

type Props = {
  stopPoints: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: () => void;
  onChange: (stopPoints: StopPoint[]) => void;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[] | null;
};

const Title = ({ quayRef }: { quayRef: string }): ReactElement => {
  const [title, setTitle] = useState(quayRef);

  useEffect(() => {
    const fetchTitle = async () =>
      await searchForQuay(quayRef).then(response =>
        setTitle(response.stopPlace?.name.value ?? quayRef)
      );
    fetchTitle();
  }, [quayRef]);

  return <div>{title}</div>;
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

  const getFetchedTitle = (stopPoint: StopPoint): ReactElement =>
    stopPoint.quayRef ? (
      <Title quayRef={stopPoint.quayRef} />
    ) : (
      <div>
        {flexibleStopPlaces?.find(
          stop => stop.id === stopPoint.flexibleStopPlaceRef
        )?.name ?? ''}
      </div>
    );

  const keys = useUniqueKeys(stopPoints);

  return (
    <>
      {stopPoints.map((stopPoint, index) => (
        <StopPointEditor
          key={keys[index]}
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
      <div
        style={{ display: 'flex', alignItems: 'baseline', marginTop: '3rem' }}
      >
        <SecondarySquareButton
          onClick={addStopPoint}
          style={{ marginRight: '1rem' }}
        >
          <AddIcon />
        </SecondarySquareButton>
        <Paragraph>{formatMessage(messages.addStopPoint)}</Paragraph>
      </div>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces
});

export default connect(mapStateToProps)(StopPointsEditor);
