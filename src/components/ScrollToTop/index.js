import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { usePrevious } from 'helpers/hooks';

const ScrollToTop = ({ children, location }) => {
  const prevLocation = usePrevious(location);

  useEffect(() => {
    if (prevLocation !== location) {
      window.scrollTo(0, 0);
    }
  }, [prevLocation, location]);

  return children;
};

export default withRouter(ScrollToTop);
