import {
  Navigate,
  Routes as ReactRoutes,
  Route,
  useLocation,
} from 'react-router-dom';

import LineEditor from 'scenes/LineEditor';
import LinesOverview from 'scenes/Lines';
import Providers from 'scenes/Providers';
import ProviderEditor from 'scenes/Providers/Editor';
import ExportsOverview from '../Exports';
import ExportsEditor from '../Exports/Creator';
import ExportsViewer from '../Exports/Viewer';
import FlexibleLineEditor from '../FlexibleLineEditor';
import FlexibleLinesOverview from '../FlexibleLines';
import NetworksOverview from '../Networks';
import NetworkEditor from '../Networks/Editor';
import StopPlacesOverview from '../StopPlaces';
import StopPlacesEditor from '../StopPlaces/scenes/Editor';
import { useNoProviders } from './useNoProviders';
import { useNoSelectedProvider } from './useNoSelectedProvider';
import { NoSelectedProvider } from './NoSelectedProvider/NoSelectedProvider';
import { useAppSelector } from '../../store/hooks';
import Brandings from '../Brandings';
import BrandingEditor from '../Brandings/Editor';

const Routes = () => {
  const noProviders = useNoProviders();
  const noSelectedProvider = useNoSelectedProvider();
  const location = useLocation();
  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);

  if (noProviders && !location.pathname.startsWith('/providers') && isAdmin) {
    return <Navigate to="/providers" replace />;
  }

  if (
    noSelectedProvider &&
    location.pathname !== '/select-provider' &&
    !location.pathname.startsWith('/providers')
  ) {
    return <Navigate to="/select-provider" replace />;
  }

  return (
    <div className="routes">
      <ReactRoutes>
        <Route path="/" element={<Navigate to="/lines" replace />} />
        <Route path="/brandings" element={<Brandings />} />
        <Route path="/brandings/create" element={<BrandingEditor />} />
        <Route path="/brandings/edit/:id" element={<BrandingEditor />} />
        <Route path="/networks" element={<NetworksOverview />} />
        <Route path="/networks/create" element={<NetworkEditor />} />
        <Route path="/networks/edit/:id" element={<NetworkEditor />} />
        <Route path="/lines" element={<LinesOverview />} />
        <Route path="/lines/edit/:id" element={<LineEditor />} />
        <Route path="/lines/create" element={<LineEditor />} />
        <Route path="/flexible-lines" element={<FlexibleLinesOverview />} />
        <Route path="/flexible-lines/create" element={<FlexibleLineEditor />} />
        <Route
          path="/flexible-lines/edit/:id"
          element={<FlexibleLineEditor />}
        />
        <Route path="/stop-places" element={<StopPlacesOverview />} />
        <Route path="/stop-places/create" element={<StopPlacesEditor />} />
        <Route path="/stop-places/edit/:id" element={<StopPlacesEditor />} />
        <Route path="/exports" element={<ExportsOverview />} />
        <Route path="/exports/create" element={<ExportsEditor />} />
        <Route path="/exports/view/:id" element={<ExportsViewer />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/create" element={<ProviderEditor />} />
        <Route path="/providers/edit/:id" element={<ProviderEditor />} />
        <Route path="/select-provider" element={<NoSelectedProvider />} />
      </ReactRoutes>
    </div>
  );
};

export default Routes;
