import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NetworksOverview from '../Networks';
import NetworkEditor from '../Networks/scenes/Editor';
import LinesOverview from '../Lines';
import LinesEditor from '../Lines/scenes/Editor';
import StopPlacesOverview from '../StopPlaces';
import StopPlacesEditor from '../StopPlaces/scenes/Editor';
import ExportsOverview from '../Exports';
import ExportsEditor from '../Exports/scenes/Editor';
import ExportsViewer from '../Exports/scenes/Viewer';

const Routes = () => (
  <div className="routes">
    <Switch>
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/`}
        component={NetworksOverview}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/networks`}
        component={NetworksOverview}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/networks/create`}
        component={NetworkEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/networks/edit/:id`}
        component={NetworkEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/lines`}
        component={LinesOverview}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/lines/create`}
        component={LinesEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/lines/edit/:id`}
        component={LinesEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/stop-places`}
        component={StopPlacesOverview}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/stop-places/create`}
        component={StopPlacesEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/stop-places/edit/:id`}
        component={StopPlacesEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/exports`}
        component={ExportsOverview}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/exports/create`}
        component={ExportsEditor}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/exports/view/:id`}
        component={ExportsViewer}
      />
    </Switch>
  </div>
);

export default Routes;
