import { RefObject, useEffect } from 'react';

/**
 * Reusable hook for opening up focused marker's popup section
 * @param isPopupToBeOpen to open or not
 * @param markerRef ref that would open up the popup
 * @param clearFocusedMarker focusedMarker needs to be cleared away to allow focusing on it repeatedly (aka user clicks same 'locate button' in the search results multiple times)
 */
export const usePopupOpeningOnFocus = (
  isPopupToBeOpen: boolean,
  markerRef: RefObject<any>,
  clearFocusedMarker: () => void,
) => {
  useEffect(() => {
    if (isPopupToBeOpen) {
      if (markerRef && markerRef.current) {
        markerRef.current.openPopup();
        // Mission accomplished, focused marker can be cleared now
        clearFocusedMarker();
      }
    }
  }, [isPopupToBeOpen, markerRef, clearFocusedMarker]);
};
