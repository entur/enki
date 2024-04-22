import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';
import { getLocale, locale } from 'i18n';

export interface LocaleState {
  locale: locale;
}

const initialState: LocaleState = {
  locale: getLocale(),
};

export const intlSlice = createSlice({
  name: 'intl',
  initialState,
  reducers: {
    updateLocale: (state, action: PayloadAction<locale>) => ({
      ...state,
      locale: action.payload,
    }),
    updateConfiguredLocale: (state, action: PayloadAction<locale>) => ({
      ...state,
      locale: getLocale(action.payload),
    }),
  },
});

export const { updateLocale, updateConfiguredLocale } = intlSlice.actions;

export const selectLocale = (state: RootState) => state.intl.locale;

export default intlSlice.reducer;
