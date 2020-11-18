import { FeedbackTextProps } from '@entur/form';
import { QuaySearch } from './searchForQuay';

export type QuaySearchResults =
  | Pick<FeedbackTextProps, 'variant' | 'feedback'>
  | undefined;

export function quaySearchResults(
  quaySearch: QuaySearch | undefined
): QuaySearchResults {
  if (!quaySearch) return undefined;

  if (quaySearch.stopPlace && quaySearch.quay) {
    const name = quaySearch.stopPlace.name.value;
    const publicCode = quaySearch.quay.publicCode ?? '';

    return {
      feedback: name + ' ' + publicCode,
      variant: 'success',
    };
  } else {
    return {
      feedback: 'Fant ikke plattform.',
      variant: 'warning',
    };
  }
}
