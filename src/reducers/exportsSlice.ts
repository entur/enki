import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortExportsByDate } from 'helpers/exports';
import { Export } from 'model/Export';

export type ExportsState = Export[] | null;

export const exportsSlice = createSlice({
  name: 'exports',
  initialState: null as ExportsState,
  reducers: {
    requestExports: () => null,
    receiveExports: (_state, action: PayloadAction<Export[]>) =>
      sortExportsByDate(action.payload),
    receiveExport: (state, action: PayloadAction<Export>) => {
      if (!state) return [action.payload];
      return state.map((e) =>
        e.id === action.payload.id ? action.payload : e,
      );
    },
  },
});

export const { requestExports, receiveExports, receiveExport } =
  exportsSlice.actions;
export default exportsSlice.reducer;
