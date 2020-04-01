import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import NetworksOverview from '../Networks';
import NetworkEditor from '../Networks/scenes/Editor';
import LinesOverview from '../Lines';
import EditorFrame from '../Lines/scenes/Editor/EditorFrame';
import StopPlacesOverview from '../StopPlaces';
import StopPlacesEditor from '../StopPlaces/scenes/Editor';
import ExportsOverview from '../Exports';
import ExportsEditor from '../Exports/scenes/Creator';
import ExportsViewer from '../Exports/scenes/Viewer';

const Routes = () => (
  <div className="routes">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/networks" component={NetworksOverview} />
      <Route exact path="/networks/create" component={NetworkEditor} />
      <Route exact path="/networks/edit/:id" component={NetworkEditor} />
      <Route exact path="/lines" component={LinesOverview} />
      <Route exact path="/lines/create" component={EditorFrame} />
      <Route exact path="/lines/edit/:id" component={EditorFrame} />
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
