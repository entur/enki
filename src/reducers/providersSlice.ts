import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Provider from 'model/Provider';

export interface ProvidersState {
  providers: Provider[] | null;
  failure: boolean;
  exports: null;
}

const initialState: ProvidersState = {
  providers: null,
  failure: false,
  exports: null,
};

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    receiveProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
      state.failure = false;
    },
    failedReceivingProviders: (state) => {
      state.failure = true;
    },
  },
});

export const { receiveProviders, failedReceivingProviders } =
  providersSlice.actions;
export default providersSlice.reducer;
