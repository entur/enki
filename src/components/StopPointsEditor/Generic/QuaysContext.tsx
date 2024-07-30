import { createContext, useContext } from 'react';

interface QuaysContext {
  quaySelectionStates: Record<string, boolean>;
  setQuaySelectionStates: (value: ((prevState: {}) => {}) | {}) => void;
}

export const QuaysContext = createContext<QuaysContext>({
  quaySelectionStates: {},
  setQuaySelectionStates: (value: ((prevState: {}) => {}) | {}) => {},
});

export const useQuays = () => {
  return useContext(QuaysContext);
};
