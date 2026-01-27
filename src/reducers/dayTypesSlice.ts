import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DayType from 'model/DayType';

export type DayTypesState = DayType[] | null;

export const dayTypesSlice = createSlice({
  name: 'dayTypes',
  initialState: null as DayTypesState,
  reducers: {
    receiveDayTypes: (_state, action: PayloadAction<DayType[]>) =>
      action.payload,
    receiveDayType: (state, action: PayloadAction<DayType>) => {
      if (!state) return [action.payload];
      const exists = state.find((dt) => dt.id === action.payload.id);
      if (exists) {
        return state.map((dt) =>
          dt.id === action.payload.id ? action.payload : dt,
        );
      }
      return [...state, action.payload];
    },
  },
});

export const { receiveDayTypes, receiveDayType } = dayTypesSlice.actions;
export default dayTypesSlice.reducer;
