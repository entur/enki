import { ReactElement, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { usePrevious } from 'helpers/hooks';

type Props = RouteComponentProps & {
  children: ReactElement;
};

const ScrollToTop = ({ children, location }: Props) => {
  const prevLocation = usePrevious(location);

  useEffect(() => {
    if (prevLocation !== location) {
      window.scrollTo(0, 0);
    }
  }, [prevLocation, location]);

  return children;
};

export default withRouter(ScrollToTop);
