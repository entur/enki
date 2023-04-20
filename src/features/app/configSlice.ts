import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';
import { Config } from 'config/ConfigContext';

// Define a type for the slice state
export interface ConfigState extends Config {
  loaded: boolean;
}

// Define the initial state using that type
const initialState: ConfigState = {
  loaded: false,
};

export const configSlice = createSlice({
  name: 'config',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateConfig: (state, action: PayloadAction<Config>) => ({
      loaded: true,
      ...action.payload,
    }),
  },
});

export const { updateConfig } = configSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value
export const selectConfigLoaded = (state: RootState) => state.config.loaded;

export default configSlice.reducer;
