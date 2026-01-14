import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUuid } from 'helpers/generators';
import FlexibleLine from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';

export type FlexibleLinesState = FlexibleLine[] | null;

export const flexibleLinesSlice = createSlice({
  name: 'flexibleLines',
  initialState: null as FlexibleLinesState,
  reducers: {
    receiveFlexibleLines: (_state, action: PayloadAction<FlexibleLine[]>) =>
      action.payload,
    receiveFlexibleLine: (state, action: PayloadAction<FlexibleLine>) => {
      const line = action.payload;
      const newJourneyPatterns: JourneyPattern[] =
        line?.journeyPatterns?.map((jp) => ({
          ...jp,
          pointsInSequence: jp.pointsInSequence.map((pis) => ({
            ...pis,
            key: createUuid(),
            flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
          })),
        })) ?? [];

      const newFlexibleLine: FlexibleLine = {
        ...line,
        networkRef: line.network?.id,
        brandingRef: line.branding?.id,
        journeyPatterns: newJourneyPatterns,
      };

      if (!state) return [newFlexibleLine];
      return state.map((l) => (l.id === line.id ? newFlexibleLine : l));
    },
  },
});

export const { receiveFlexibleLines, receiveFlexibleLine } =
  flexibleLinesSlice.actions;
export default flexibleLinesSlice.reducer;
