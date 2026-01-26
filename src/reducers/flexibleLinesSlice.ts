import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { normalizeFlexibleLineFromApi } from 'helpers/flexibleLines';
import FlexibleLine from 'model/FlexibleLine';

export type FlexibleLinesState = FlexibleLine[] | null;

export const flexibleLinesSlice = createSlice({
  name: 'flexibleLines',
  initialState: null as FlexibleLinesState,
  reducers: {
    receiveFlexibleLines: (_state, action: PayloadAction<FlexibleLine[]>) =>
      action.payload,
    receiveFlexibleLine: (state, action: PayloadAction<FlexibleLine>) => {
      const normalizedLine = normalizeFlexibleLineFromApi(action.payload);

      if (!state) return [normalizedLine];
      return state.map((l) =>
        l.id === normalizedLine.id ? normalizedLine : l,
      );
    },
  },
});

export const { receiveFlexibleLines, receiveFlexibleLine } =
  flexibleLinesSlice.actions;
export default flexibleLinesSlice.reducer;
