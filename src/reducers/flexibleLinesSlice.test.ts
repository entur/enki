import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import reducer, {
  receiveFlexibleLines,
  receiveFlexibleLine,
} from './flexibleLinesSlice';

describe('flexibleLinesSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('receiveFlexibleLines replaces entire state', () => {
    const lines: FlexibleLine[] = [
      { id: '1', name: 'Line1', flexibleLineType: FlexibleLineType.FIXED },
      {
        id: '2',
        name: 'Line2',
        flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE,
      },
    ];
    expect(reducer(null, receiveFlexibleLines(lines))).toEqual(lines);
  });

  it('receiveFlexibleLine normalizes and returns singleton when state is null', () => {
    const line: FlexibleLine = {
      id: '1',
      name: 'Line1',
      flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
      network: { id: 'net1', name: 'Net', authorityRef: 'a' },
      branding: { id: 'br1', name: 'Brand' },
      journeyPatterns: [
        {
          pointsInSequence: [
            {
              flexibleStopPlace: { id: 'fsp1', name: 'Stop' } as any,
            } as any,
          ],
        } as any,
      ],
    };
    const result = reducer(null, receiveFlexibleLine(line));
    expect(result).toHaveLength(1);
    expect(result![0].networkRef).toBe('net1');
    expect(result![0].brandingRef).toBe('br1');
    expect(
      result![0].journeyPatterns![0].pointsInSequence[0].flexibleStopPlaceRef,
    ).toBe('fsp1');
    expect(
      result![0].journeyPatterns![0].pointsInSequence[0].key,
    ).toBeDefined();
  });

  it('receiveFlexibleLine updates existing by id', () => {
    const initial: FlexibleLine[] = [
      { id: '1', name: 'Old', flexibleLineType: FlexibleLineType.FIXED },
      { id: '2', name: 'Keep', flexibleLineType: FlexibleLineType.FIXED },
    ];
    const updated: FlexibleLine = {
      id: '1',
      name: 'New',
      flexibleLineType: FlexibleLineType.FIXED,
      journeyPatterns: [],
    };
    const result = reducer(initial, receiveFlexibleLine(updated));
    expect(result).toHaveLength(2);
    expect(result![0].name).toBe('New');
    expect(result![1].name).toBe('Keep');
  });
});
