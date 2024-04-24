# i18n in enki

## How to add new languages

Translation files are located in `./translations`, files are named after the language code / locale. You can
add a new translation file by copying en.ts to the locale of your choice, then translating all the content.

Supported locales are listed in `./locale.tsx`. The list can optionally be restricted by configuration
(see `../config/ConfigContex.ts`). Add the new language to the `Locale` array.

Finally, the language picker must be updated to include the new language. You must update the functions
`getLanguagePickerFlagIcon` and `getLanguagePickerLocaleMessageKey` functions also located in `./locale.tsx`.
