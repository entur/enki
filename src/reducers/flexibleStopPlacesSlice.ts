import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import FlexibleStopPlace, {
  mapFlexibleAreasToArea,
} from 'model/FlexibleStopPlace';

export type FlexibleStopPlacesState = FlexibleStopPlace[] | null;

export const flexibleStopPlacesSlice = createSlice({
  name: 'flexibleStopPlaces',
  initialState: null as FlexibleStopPlacesState,
  reducers: {
    requestFlexibleStopPlaces: () => null,
    receiveFlexibleStopPlaces: (
      _state,
      action: PayloadAction<FlexibleStopPlace[]>,
    ) => action.payload.map((sp) => mapFlexibleAreasToArea(sp)),
    requestFlexibleStopPlace: (state) => state,
    receiveFlexibleStopPlace: (
      state,
      action: PayloadAction<FlexibleStopPlace>,
    ) => {
      const result = state
        ? state.map((sp) => (sp.id === action.payload.id ? action.payload : sp))
        : [action.payload];
      return result.map((sp) => mapFlexibleAreasToArea(sp));
    },
  },
});

export const {
  requestFlexibleStopPlaces,
  receiveFlexibleStopPlaces,
  requestFlexibleStopPlace,
  receiveFlexibleStopPlace,
} = flexibleStopPlacesSlice.actions;
export default flexibleStopPlacesSlice.reducer;
