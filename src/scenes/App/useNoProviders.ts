import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const useNoProviders = () => {
  const providers = useAppSelector((state) => state.userContext.providers);
  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);
  const location = useLocation();

  return (
    providers.length === 0 &&
    isAdmin &&
    location.pathname !== '/providers' &&
    location.pathname !== '/providers/create'
  );
};
