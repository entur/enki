import { useAppSelector } from '../../store/hooks';

export const useNoSelectedProvider = () => {
  const provider = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );

  return !provider;
};
