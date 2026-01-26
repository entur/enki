import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branding } from 'model/Branding';

export type BrandingsState = Branding[] | null;

export const brandingsSlice = createSlice({
  name: 'brandings',
  initialState: null as BrandingsState,
  reducers: {
    receiveBrandings: (_state, action: PayloadAction<Branding[]>) =>
      action.payload,
    receiveBranding: (state, action: PayloadAction<Branding>) => {
      if (!state) return [action.payload];
      return state.map((b) =>
        b.id === action.payload.id ? action.payload : b,
      );
    },
  },
});

export const { receiveBrandings, receiveBranding } = brandingsSlice.actions;
export default brandingsSlice.reducer;
