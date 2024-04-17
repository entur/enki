import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type AppDispatch, RootState } from '../../../app/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export interface DayTypesState {
  foo: string;
}

const initialState: DayTypesState = {
  foo: 'bar',
};

export const daytypesSlice = createSlice({
  name: 'daytypes',
  initialState,
  reducers: {
    updateFoo: (state, action: PayloadAction<string>) => ({
      foo: action.payload,
    }),
  },
});

export const { updateFoo } = daytypesSlice.actions;

export default daytypesSlice.reducer;

export interface State extends RootState {
  daytypes: DayTypesState;
}

export const useDaytypesSelector: TypedUseSelectorHook<State> = useSelector;
