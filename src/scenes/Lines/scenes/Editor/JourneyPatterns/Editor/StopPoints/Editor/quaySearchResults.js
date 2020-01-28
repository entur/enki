export function quaySearchResults(quaySearch) {
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
