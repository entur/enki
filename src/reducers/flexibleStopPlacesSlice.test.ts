import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { Coordinate } from 'model/GeoJSON';
import reducer, {
  requestFlexibleStopPlaces,
  receiveFlexibleStopPlaces,
  requestFlexibleStopPlace,
  receiveFlexibleStopPlace,
} from './flexibleStopPlacesSlice';

describe('flexibleStopPlacesSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('requestFlexibleStopPlaces resets state to null', () => {
    const initial: FlexibleStopPlace[] = [{ id: '1', name: 'SP1' }];
    expect(reducer(initial, requestFlexibleStopPlaces())).toBeNull();
  });

  it('receiveFlexibleStopPlaces maps flexibleAreas to flexibleArea', () => {
    const stopPlaces: FlexibleStopPlace[] = [
      {
        id: '1',
        name: 'SP1',
        flexibleAreas: [
          { polygon: { type: 'Polygon', coordinates: [[0, 0] as Coordinate] } },
        ],
      },
      { id: '2', name: 'SP2' },
    ];
    const result = reducer(null, receiveFlexibleStopPlaces(stopPlaces));
    expect(result).toHaveLength(2);
    expect(result![0].flexibleArea).toEqual({
      polygon: { type: 'Polygon', coordinates: [[0, 0] as Coordinate] },
    });
    expect(result![1].flexibleArea).toBeUndefined();
  });

  it('requestFlexibleStopPlace preserves existing state', () => {
    const initial: FlexibleStopPlace[] = [{ id: '1', name: 'SP1' }];
    expect(reducer(initial, requestFlexibleStopPlace())).toEqual(initial);
  });

  it('receiveFlexibleStopPlace updates existing by id', () => {
    const initial: FlexibleStopPlace[] = [
      { id: '1', name: 'Old' },
      { id: '2', name: 'Keep' },
    ];
    const updated: FlexibleStopPlace = { id: '1', name: 'New' };
    const result = reducer(initial, receiveFlexibleStopPlace(updated));
    expect(result).toHaveLength(2);
    expect(result![0].name).toBe('New');
    expect(result![1].name).toBe('Keep');
  });

  it('receiveFlexibleStopPlace returns singleton when state is null', () => {
    const sp: FlexibleStopPlace = { id: '1', name: 'New' };
    const result = reducer(null, receiveFlexibleStopPlace(sp));
    expect(result).toEqual([sp]);
  });

  it('receiveFlexibleStopPlace applies mapFlexibleAreasToArea', () => {
    const sp: FlexibleStopPlace = {
      id: '1',
      name: 'SP',
      flexibleAreas: [
        { polygon: { type: 'Polygon', coordinates: [[1, 2] as Coordinate] } },
      ],
    };
    const result = reducer(null, receiveFlexibleStopPlace(sp));
    expect(result![0].flexibleArea).toEqual({
      polygon: { type: 'Polygon', coordinates: [[1, 2] as Coordinate] },
    });
  });
});
