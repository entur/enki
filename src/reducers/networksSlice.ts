import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Network } from 'model/Network';

export type NetworksState = Network[] | null;

export const networksSlice = createSlice({
  name: 'networks',
  initialState: null as NetworksState,
  reducers: {
    receiveNetworks: (_state, action: PayloadAction<Network[]>) =>
      action.payload,
    receiveNetwork: (state, action: PayloadAction<Network>) => {
      if (!state) return [action.payload];
      return state.map((n) =>
        n.id === action.payload.id ? action.payload : n,
      );
    },
  },
});

export const { receiveNetworks, receiveNetwork } = networksSlice.actions;
export default networksSlice.reducer;
