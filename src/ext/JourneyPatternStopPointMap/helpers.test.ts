import {
  determineQuayToFocus,
  getSelectedQuayIds,
  onFocusedMarkerNewMapState,
} from './helpers';
import { StopPlace } from '../../api';
import { FocusedMarker, JourneyPatternMarkerType } from './types';

const stopPlace: StopPlace = {
  id: 'FIN:StopPlace:OL',
  name: {
    value: 'Oulu',
  },
  transportMode: 'rail',
  centroid: null,
  quays: [
    {
      id: 'FIN:Quay:OL_0',
      name: {
        value: 'Oulu',
      },
      publicCode: null,
      centroid: {
        location: {
          longitude: 25.486121,
          latitude: 65.012409,
        },
      },
    },
    {
      id: 'FIN:Quay:OL_2',
      name: {
        value: 'Oulu',
      },
      publicCode: null,
      centroid: {
        location: {
          longitude: 21.486121,
          latitude: 65.012409,
        },
      },
    },
    {
      id: 'FIN:Quay:OL_33',
      name: {
        value: 'Oulu',
      },
      publicCode: null,
      centroid: {
        location: {
          longitude: 25.482790868743646,
          latitude: 65.01002311528012,
        },
      },
    },
  ],
  children: [],
} as StopPlace;

describe('Journey pattern map', () => {
  describe('determineQuayToFocus', () => {
    it('should find the quay fully matching the search word', () => {
      expect(determineQuayToFocus('FIN:Quay:OL_33', stopPlace, [])).toEqual({
        id: 'FIN:Quay:OL_33',
        type: JourneyPatternMarkerType.QUAY,
      });
    });

    it('should find the quay containing the search word', () => {
      expect(
        determineQuayToFocus('FIN:Quay:OL_3', stopPlace, ['FIN:Quay:OL_0']),
      ).toEqual({ id: 'FIN:Quay:OL_33', type: JourneyPatternMarkerType.QUAY });
    });

    it('should find a selected quay if none match or contain the search word', () => {
      expect(
        determineQuayToFocus('Oulu', stopPlace, ['FIN:Quay:OL_0']),
      ).toEqual({ id: 'FIN:Quay:OL_0', type: JourneyPatternMarkerType.QUAY });
    });

    it('should find the first quay if no other conditions met', () => {
      expect(determineQuayToFocus('Oulu', stopPlace, [])).toEqual({
        id: 'FIN:Quay:OL_0',
        type: JourneyPatternMarkerType.QUAY,
      });
    });
  });

  describe('getSelectedQuayIds', () => {
    it('should find selected quay id-s when a stop place has some quays selected', () => {
      expect(
        getSelectedQuayIds(stopPlace.quays, {
          Some_quay_not_part_of_given_stop_place: [0],
          'FIN:Quay:OL_0': [1, 4],
          'FIN:Quay:OL_2': [3],
        }),
      ).toEqual(['FIN:Quay:OL_0', 'FIN:Quay:OL_2']);
    });

    it('should return empty array when a stop places has no quays selected', () => {
      expect(
        getSelectedQuayIds(stopPlace.quays, {
          Some_quay_not_part_of_given_stop_place: [0],
        }),
      ).toEqual([]);
    });

    it('should return empty array when stopPointSequenceIndexes is empty (journey pattern is empty)', () => {
      expect(getSelectedQuayIds(stopPlace.quays, {})).toEqual([]);
    });
  });

  describe('onFocusedMarkerNewMapState', () => {
    const focusedQuayMarker: FocusedMarker = {
      stopPlaceId: stopPlace.id,
      stopPlaceQuays: stopPlace.quays,
      marker: {
        id: 'FIN:Quay:OL_0',
        type: JourneyPatternMarkerType.QUAY,
      },
    };

    it('should return a state with showQuaysState indicating all quays to be shown for the focused quay marker', () => {
      expect(onFocusedMarkerNewMapState(focusedQuayMarker, {}, {}, {})).toEqual(
        {
          focusedMarker: focusedQuayMarker,
          showQuaysState: { 'FIN:StopPlace:OL': true },
        },
      );
    });

    it('should return a state with hideNonSelectedQuaysState indicating non-selected quays to be shown for the focused quay marker', () => {
      expect(
        onFocusedMarkerNewMapState(
          focusedQuayMarker,
          { 'FIN:StopPlace:OL': true, otherStop: true },
          { 'FIN:StopPlace:OL': true, otherStop: false },
          {},
        ),
      ).toEqual({
        focusedMarker: focusedQuayMarker,
        hideNonSelectedQuaysState: {
          'FIN:StopPlace:OL': false,
          otherStop: false,
        },
      });
    });

    const focusedStopMarker: FocusedMarker = {
      stopPlaceId: stopPlace.id,
      stopPlaceQuays: stopPlace.quays,
      marker: {
        id: 'FIN:Quay:OL',
        type: JourneyPatternMarkerType.STOP_PLACE,
      },
    };

    it('should return a state with showQuaysState indicating to show a stop place instead of its quays in case there are no selected quays, when focused marker is a stop place', () => {
      expect(
        onFocusedMarkerNewMapState(
          focusedStopMarker,
          { 'FIN:StopPlace:OL': true, otherStop: true },
          { 'FIN:StopPlace:OL': false, otherStop: false },
          {},
        ),
      ).toEqual({
        focusedMarker: focusedStopMarker,
        showQuaysState: { 'FIN:StopPlace:OL': false, otherStop: true },
      });
    });

    it('should not return anything special if the map is in the right state', () => {
      expect(
        onFocusedMarkerNewMapState(
          focusedQuayMarker,
          { 'FIN:StopPlace:OL': true },
          { 'FIN:Quay:OL_0': false },
          {},
        ),
      ).toEqual({
        focusedMarker: focusedQuayMarker,
      });
      expect(
        onFocusedMarkerNewMapState(
          focusedStopMarker,
          { 'FIN:StopPlace:OL': false },
          {},
          {},
        ),
      ).toEqual({
        focusedMarker: focusedStopMarker,
      });
    });
  });
});
