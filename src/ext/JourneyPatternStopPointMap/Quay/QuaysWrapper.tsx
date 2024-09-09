import { Quay, StopPlace } from '../../../api';
import QuayMarker from './QuayMarker';
import { MapSearchResult } from '../JourneyPatternStopPointMap';
import { useEffect, useState } from 'react';
import StopPlaceDetails from '../StopPlaceDetails';

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
  locatedSearchResult: MapSearchResult | undefined;
  clearLocateSearchResult: () => void;
}

const getSelectedQuays = (
  stopPlace: StopPlace,
  stopPointSequenceIndexes: Record<string, number[]>,
) => {
  return stopPlace.quays.filter(
    (quay: Quay) => stopPointSequenceIndexes[quay.id]?.length > 0,
  );
};

const QuaysWrapper = ({
  stopPlace,
  stopPointSequenceIndexes,
  hideNonSelectedQuaysState,
  addStopPoint,
  deleteStopPoint,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
  locatedSearchResult,
  clearLocateSearchResult,
}: QuaysWrapperProps) => {
  const selectedQuays = getSelectedQuays(stopPlace, stopPointSequenceIndexes);
  const selectedQuayIds: string[] = selectedQuays.map((quay: Quay) => quay.id);
  // When locating a stop/quay from the search input results, choosing which quay to have with open popup:
  const [quayToOpenPopup, setQuayToOpenPopup] = useState<Quay | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!locatedSearchResult) {
      setQuayToOpenPopup(undefined);
      return;
    }

    if (
      !locatedSearchResult.searchText.includes('Quay') &&
      selectedQuays?.length == 0
    ) {
      // User searched for the stop place, and unless there is a quay selected, the stop shall be what we show
      showQuaysCallback(false, stopPlace.id);
      return;
    }

    const quayFullyMatchingSearch = locatedSearchResult?.searchText
      ? stopPlace.quays.filter(
          (q) => q.id === locatedSearchResult?.searchText,
        )[0]
      : undefined;
    if (quayFullyMatchingSearch) {
      setQuayToOpenPopup(quayFullyMatchingSearch);
      return;
    }

    const quayContainingSearch = locatedSearchResult?.searchText
      ? stopPlace.quays.filter((q) =>
          q.id.includes(locatedSearchResult.searchText),
        )[0]
      : undefined;
    if (quayContainingSearch) {
      setQuayToOpenPopup(quayContainingSearch);
      return;
    }

    const firstSelectedQuay =
      selectedQuays.length > 0 ? selectedQuays[0] : undefined;
    if (firstSelectedQuay) {
      setQuayToOpenPopup(firstSelectedQuay);
      return;
    }

    const justTheFirstQuay = stopPlace.quays[0];
    setQuayToOpenPopup(justTheFirstQuay);
  }, [locatedSearchResult, stopPlace, setQuayToOpenPopup, selectedQuays]);

  useEffect(() => {
    // If quayToOpenPopup happens to be something that is in hidden state, then time to un-hide it
    if (
      quayToOpenPopup &&
      hideNonSelectedQuaysState &&
      !selectedQuayIds.includes(quayToOpenPopup.id)
    ) {
      hideNonSelectedQuaysCallback(false, stopPlace.id);
    }
  }, [quayToOpenPopup, hideNonSelectedQuaysState, selectedQuayIds, stopPlace]);

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
            clearLocateSearchResult={clearLocateSearchResult}
            isPopupToBeOpen={quay.id === quayToOpenPopup?.id}
          />
        ) : (
          ''
        );
      })}
    </>
  );
};

export default QuaysWrapper;
