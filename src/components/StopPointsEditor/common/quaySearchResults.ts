import { VariantType } from '@entur/form';
import { Quay, StopPlace } from 'api';

export type QuaySearch = { stopPlace?: StopPlace; quay?: Quay };

export type QuaySearchResults = {
  feedback?: string;
  variant?: VariantType;
};

export function quaySearchResults(
  quaySearch: QuaySearch | undefined,
  loading: boolean,
  loadingLabel: string,
  quayNotFoundLabel: string,
): QuaySearchResults {
  if (!quaySearch) return { feedback: undefined, variant: undefined };

  if (loading) {
    return {
      feedback: loadingLabel,
      variant: 'info',
    };
  }

  if (quaySearch.stopPlace && quaySearch.quay) {
    const name = quaySearch.stopPlace.name.value;
    const publicCode = quaySearch.quay.publicCode ?? '';

    return {
      feedback: name + ' ' + publicCode,
      variant: 'success',
    };
  } else {
    return {
      feedback: quayNotFoundLabel,
      variant: 'warning',
    };
  }
}
