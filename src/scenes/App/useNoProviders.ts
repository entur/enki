import { useConfig } from 'config/ConfigContext';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GlobalState } from 'reducers';

export const useNoProviders = () => {
  const { providers, auth } = useSelector<GlobalState, GlobalState>(
    (state) => state
  );
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
