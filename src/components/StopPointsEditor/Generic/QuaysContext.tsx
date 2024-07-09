import { createContext, useContext } from 'react';

interface Quay {
  id: string;
  name: string;
  stopPlaceType: string;
  transportMode: string;
  position: number[];
}

interface QuaysContext {
  quays: Quay[];
  quaySelectionStates: Record<string, boolean>;
  setQuaySelectionStates: (value: ((prevState: {}) => {}) | {}) => void;
}

export const quays: Quay[] = [
  {
    id: 'FIN:Quay:JY_2',
    name: 'Jyväskylä',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.24054179146983, 25.753123608081573],
  },
  {
    id: 'FIN:Quay:RPH_0',
    name: 'Rautpohja',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.232539, 25.690392],
  },
  {
    id: 'FIN:Quay:VN_0',
    name: 'Vesanka',
    stopPlaceType: 'rail',
    transportMode: 'railStation',
    position: [62.269355, 25.557151],
  },
  {
    id: 'FIN:Quay:PVI_1',
    name: 'Petäjävesi',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.25694827096574, 25.190376616477234],
  },
  {
    id: 'FIN:Quay:KTN_0',
    name: 'Kaleton',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.239687, 24.791661],
  },
  {
    id: 'FIN:StopPlace:KEU',
    name: 'Keuruu',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.25538929084291, 24.706565196114838],
  },
  {
    id: 'FIN:Quay:HPK_5',
    name: 'Haapamäki',
    transportMode: 'rail',
    stopPlaceType: 'railStation',
    position: [62.24550540767263, 24.45576498462487],
  },
];

export const QuaysContext = createContext<QuaysContext>({
  quays: [],
  quaySelectionStates: {},
  setQuaySelectionStates: (value: ((prevState: {}) => {}) | {}) => {},
});

export const useQuays = () => {
  return useContext(QuaysContext);
};
