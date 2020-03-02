import { InputGroupProps } from '@entur/form';

export type QuaySearchResults =
  | Pick<InputGroupProps, 'variant' | 'feedback'>
  | undefined;
export type QuaySearch = { stopPlace: any; quay: any };

export function quaySearchResults(quaySearch: QuaySearch): QuaySearchResults {
  if (!quaySearch) return undefined;
  const { stopPlace } = quaySearch;
  if (!stopPlace) return undefined;
  if (stopPlace !== 'not-found') {
    const name = stopPlace.name.value;
    const publicCode = quaySearch.quay.publicCode;
    return {
      feedback: name + ' ' + publicCode,
      variant: 'success'
    };
  } else {
    return {
      feedback: 'Fant ikke plattform.',
      variant: 'warning'
    };
  }
}
