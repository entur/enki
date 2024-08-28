import { Quay, StopPlace } from '../../../api';
import QuayMarker from './QuayMarker';

interface QuaysWrapperProps {
  stopPlace: StopPlace;
  quayStopPointIndexesRecord: Record<string, number[]>;
  hideNonSelectedQuaysState: boolean;
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  hideNonSelectedQuaysCallback: (
    hideNonSelected: boolean,
    stopPlaceId: string,
  ) => void;
  showQuaysCallback: (showAll: boolean, stopPlaceId: string) => void;
}

const QuaysWrapper = ({
  stopPlace,
  quayStopPointIndexesRecord,
  hideNonSelectedQuaysState,
  addStopPoint,
  deleteStopPoint,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
}: QuaysWrapperProps) => {
  const selectedQuayIds: string[] = stopPlace.quays
    .filter((quay: Quay) => quayStopPointIndexesRecord[quay.id] !== undefined)
    .map((quay: Quay) => quay.id);

  return (
    <>
      {stopPlace.quays.map((quay: Quay) => {
        const isSelectedQuay = selectedQuayIds.includes(quay.id);
        const hasSelectedQuay = !!selectedQuayIds?.length;
        const hasNonSelectedQuays =
          selectedQuayIds.length < stopPlace.quays.length;

        return !hideNonSelectedQuaysState || isSelectedQuay ? (
          <QuayMarker
            key={quay.id}
            quay={quay}
            stopPointIndexes={quayStopPointIndexesRecord[quay.id]}
            stopPlace={stopPlace}
            hasSelectedQuay={hasSelectedQuay}
            hasNonSelectedQuays={hasNonSelectedQuays}
            hideNonSelectedQuaysState={hideNonSelectedQuaysState}
            showQuaysCallback={(showAll) => {
              showQuaysCallback(showAll, stopPlace.id);
            }}
            hideNonSelectedQuaysCallback={(hideNonSelected) => {
              hideNonSelectedQuaysCallback(hideNonSelected, stopPlace.id);
            }}
            addStopPointCallback={addStopPoint}
            deleteStopPointCallback={deleteStopPoint}
          />
        ) : (
          ''
        );
      })}
    </>
  );
};

export default QuaysWrapper;
