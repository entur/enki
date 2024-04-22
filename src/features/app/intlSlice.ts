import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';
import { getLocale, Locale, LOCALE_KEY } from 'i18n';

export interface LocaleState {
  locale: Locale;
}

const initialState: LocaleState = {
  locale: getLocale(),
};

export const intlSlice = createSlice({
  name: 'intl',
  initialState,
  reducers: {
    updateLocale: {
      reducer: (state, action: PayloadAction<Locale>) => ({
        ...state,
        locale: action.payload,
      }),
      prepare: (locale: Locale) => {
        localStorage.setItem(LOCALE_KEY, locale);
        return { payload: locale };
      },
    },
    updateConfiguredLocale: (state, action: PayloadAction<Locale>) => ({
      ...state,
      locale: getLocale(action.payload),
    }),
  },
});

export const { updateLocale, updateConfiguredLocale } = intlSlice.actions;

export const selectLocale = (state: RootState) => state.intl.locale;

export default intlSlice.reducer;
