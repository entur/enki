import stylesURL from './styles.scss?url';
import { Helmet } from 'react-helmet';

/**
 * Main point in here is just to import the style overrides
 */
export const FintrafficStyle = () => {
  return (
    <Helmet>
      <link href={stylesURL} rel="stylesheet" media="all" />;
    </Helmet>
  );
};
