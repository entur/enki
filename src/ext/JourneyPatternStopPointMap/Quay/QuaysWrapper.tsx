import { Quay, StopPlace } from '../../../api';
import QuayMarker from './QuayMarker';
import { getSelectedQuayIds } from '../helpers';
import { FocusedMarker } from '../types';

interface QuaysWrapperProps {
  stopPlace: StopPlace;
  stopPointSequenceIndexes: Record<string, number[]>;
  hideNonSelectedQuaysState: boolean;
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  hideNonSelectedQuaysCallback: (
    hideNonSelected: boolean,
    stopPlaceId: string,
  ) => void;
  showQuaysCallback: (showAll: boolean, stopPlaceId: string) => void;
  focusedMarker: FocusedMarker | undefined;
  clearFocusedMarker: () => void;
}

const QuaysWrapper = ({
  stopPlace,
  stopPointSequenceIndexes,
  hideNonSelectedQuaysState,
  addStopPoint,
  deleteStopPoint,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
  focusedMarker,
  clearFocusedMarker,
}: QuaysWrapperProps) => {
  const selectedQuayIds: string[] = getSelectedQuayIds(
    stopPlace.quays,
    stopPointSequenceIndexes,
  );

  return (
    <>
      {stopPlace.quays.map((quay: Quay) => {
        const isSelectedQuay = selectedQuayIds.includes(quay.id);
        const hasSelectedQuay = !!selectedQuayIds?.length;
        const hasNonSelectedQuays =
          selectedQuayIds.length < stopPlace.quays.length;

        return !hideNonSelectedQuaysState || isSelectedQuay ? (
          <QuayMarker
            key={'quay-marker-' + quay.id}
            quay={quay}
            stopPointSequenceIndexes={stopPointSequenceIndexes[quay.id]}
            stopPlace={stopPlace}
            isSelectedQuay={isSelectedQuay}
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
            clearFocusedMarker={clearFocusedMarker}
            isPopupToBeOpen={quay.id === focusedMarker?.marker.id}
          />
        ) : (
          ''
        );
      })}
    </>
  );
};

export default QuaysWrapper;
