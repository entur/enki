import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';
import { getLocale } from 'i18n';

export interface LocaleState {
  locale: string;
}

const initialState: LocaleState = {
  locale: getLocale(),
};

export const intlSlice = createSlice({
  name: 'intl',
  initialState,
  reducers: {
    updateLocale: (state, action: PayloadAction<string>) => ({
      ...state,
      locale: action.payload,
    }),
  },
});

export const { updateLocale } = intlSlice.actions;

export const selectLocale = (state: RootState) => state.intl.locale;

export default intlSlice.reducer;
