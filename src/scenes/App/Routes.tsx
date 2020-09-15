import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import NetworksOverview from '../Networks';
import NetworkEditor from '../Networks/scenes/Editor';
import LinesOverview from 'scenes/Lines';
import LineEditor from 'scenes/LineEditor';
import FlexibleLinesOverview from '../FlexibleLines';
import FlexibleLineEditor from '../FlexibleLineEditor';
import StopPlacesOverview from '../StopPlaces';
import StopPlacesEditor from '../StopPlaces/scenes/Editor';
import ExportsOverview from '../Exports';
import ExportsEditor from '../Exports/scenes/Creator';
import ExportsViewer from '../Exports/scenes/Viewer';

const Routes = () => (
  <div className="routes">
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          return <Redirect to="/lines" />;
        }}
      />
      <Route exact path="/networks" component={NetworksOverview} />
      <Route exact path="/networks/create" component={NetworkEditor} />
      <Route exact path="/networks/edit/:id" component={NetworkEditor} />
      <Route exact path="/lines" component={LinesOverview} />
      <Route exact path="/lines/edit/:id" component={LineEditor} />
      <Route exact path="/lines/create" component={LineEditor} />
      <Route exact path="/flexible-lines" component={FlexibleLinesOverview} />
      <Route
        exact
        path="/flexible-lines/create"
        component={FlexibleLineEditor}
      />
      <Route
        exact
        path="/flexible-lines/edit/:id"
        component={FlexibleLineEditor}
      />
      <Route exact path="/stop-places" component={StopPlacesOverview} />
      <Route exact path="/stop-places/create" component={StopPlacesEditor} />
      <Route exact path="/stop-places/edit/:id" component={StopPlacesEditor} />
      <Route exact path="/exports" component={ExportsOverview} />
      <Route exact path="/exports/create" component={ExportsEditor} />
      <Route exact path="/exports/view/:id" component={ExportsViewer} />
    </Switch>
  </div>
);

export default Routes;
