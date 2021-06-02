import { StopPlacesQuery } from 'api';

export type Quay = {
  id: string;
  publicCode: null | string;
  name: null | string;
};

export type StopPlace = {
  id: string;
  name: { value: string };
  quays: Quay[];
  children: StopPlace[];
};

export type SearchForQuayResponse = {
  stopPlace: null | StopPlace[];
};

export type QuaySearch = { stopPlace?: StopPlace; quay?: Quay };

export default async function search(quayRef: string): Promise<QuaySearch> {
  const endpoint = `/api/stopPlacesRead/quays/${quayRef}/stop-place`;

  const data = await StopPlacesQuery(endpoint);

  let foundQuay = undefined,
    foundStopPlace = undefined;

  if (data) {
    foundStopPlace = data;
    foundQuay = data.quays?.quayRefOrQuay.find((q: Quay) => q.id === quayRef);
  }

  return { stopPlace: foundStopPlace, quay: foundQuay };
}
