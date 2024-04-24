import { useConfig } from 'config/ConfigContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/auth';
import { useAppSelector } from '../../store/hooks';

export const useNoProviders = () => {
  const providers = useAppSelector((state) => state.providers);
  const auth = useAuth();
  const { adminRole } = useConfig();
  const location = useLocation();

  return (
    providers.providers &&
    providers.providers.length === 0 &&
    auth.roleAssignments?.includes(adminRole!) &&
    location.pathname !== '/providers' &&
    location.pathname !== '/providers/create'
  );
};
