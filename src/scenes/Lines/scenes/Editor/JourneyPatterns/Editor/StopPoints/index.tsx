import React, { ReactElement, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { StopPoint } from 'model';
import { replaceElement } from 'helpers/arrays';
import { ExpandablePanel } from '@entur/expand';
import validateForm from './Editor/validateForm';
import StopPointEditor from './Editor';
import messages from '../messages';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { GlobalState } from 'reducers';
import searchForQuay from 'scenes/Lines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/searchForQuay';

type Props = {
  stopPoints: StopPoint[];
  deleteStopPoint: (index: number) => void;
  onChange: (stopPoints: StopPoint[]) => void;
  setIsValidStopPoints: (isValid: boolean) => void;
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
  onChange,
  setIsValidStopPoints,
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

  return (
    <div className="stop-points-editor">
      {stopPoints.map((stopPoint, index) => {
        const [isValid] = validateForm(stopPoint, index === 0);
        return (
          <ExpandablePanel
            key={index}
            title={getFetchedTitle(stopPoint)}
            defaultOpen={!isValid}
          >
            <StopPointEditor
              isFirst={index === 0}
              stopPoint={stopPoint}
              deleteStopPoint={() => deleteStopPoint(index)}
              onChange={(stopPoint: StopPoint) =>
                updateStopPoint(index, stopPoint)
              }
              setIsValidStopPoints={setIsValidStopPoints}
              flexibleStopPlaces={flexibleStopPlaces ?? []}
            />
          </ExpandablePanel>
        );
      })}

      <SecondaryButton
        onClick={() => onChange(stopPoints.concat(new StopPoint()))}
        style={{ margin: '2rem 0' }}
      >
        <AddIcon />
        {formatMessage(messages.addStopPoint)}
      </SecondaryButton>
    </div>
  );
};

const mapStateToProps = ({ flexibleStopPlaces }: GlobalState): StateProps => ({
  flexibleStopPlaces
});

export default connect(mapStateToProps)(StopPointsEditor);
