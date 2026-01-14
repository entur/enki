import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organisation } from 'model/Organisation';

export type OrganisationState = Organisation[] | null;

export const organisationsSlice = createSlice({
  name: 'organisations',
  initialState: null as OrganisationState,
  reducers: {
    receiveOrganisations: (_state, action: PayloadAction<Organisation[]>) =>
      action.payload,
  },
});

export const { receiveOrganisations } = organisationsSlice.actions;
export default organisationsSlice.reducer;
