import { Quay, StopPlace } from '../../../api';
import QuayMarker from './QuayMarker';
import { getSelectedQuayIds } from '../helpers';
import { FocusedMarker } from '../types';

interface QuaysProps {
  stopPlace: StopPlace;
  stopPointSequenceIndexes: Record<string, number[]>;
  hideNonSelectedQuaysState: boolean;
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  hideNonSelectedQuays: (hideNonSelected: boolean, stopPlaceId: string) => void;
  showQuays: (showAll: boolean, stopPlaceId: string) => void;
  focusedMarker: FocusedMarker | undefined;
  clearFocusedMarker: () => void;
}

const Quays = ({
  stopPlace,
  stopPointSequenceIndexes,
  hideNonSelectedQuaysState,
  addStopPoint,
  deleteStopPoint,
  showQuays,
  hideNonSelectedQuays,
  focusedMarker,
  clearFocusedMarker,
}: QuaysProps) => {
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
            showQuays={(showAll) => {
              showQuays(showAll, stopPlace.id);
            }}
            hideNonSelectedQuays={(hideNonSelected) => {
              hideNonSelectedQuays(hideNonSelected, stopPlace.id);
            }}
            addStopPoint={addStopPoint}
            deleteStopPoint={deleteStopPoint}
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

export default Quays;
