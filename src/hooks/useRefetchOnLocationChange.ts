import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default (refetch: () => void) => {
  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);
};
