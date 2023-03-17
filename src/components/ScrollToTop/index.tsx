import { ReactElement, useEffect } from 'react';
import { usePrevious } from 'helpers/hooks';
import { useLocation } from 'react-router-dom';

type Props = {
  children: ReactElement;
};

const ScrollToTop = ({ children }: Props) => {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  useEffect(() => {
    if (prevLocation !== location) {
      window.scrollTo(0, 0);
    }
  }, [prevLocation, location]);

  return children;
};

export default ScrollToTop;
