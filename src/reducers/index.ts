import { AuthState } from 'auth/authSlice';
import { ConfigState } from 'config/configSlice';
import notification, { NotificationState } from 'reducers/notification';
import editor, { EditorState } from './editor';
import exports, { ExportsState } from './exports';
import flexibleLines, { FlexibleLinesState } from './flexibleLines';
import flexibleStopPlaces, {
  FlexibleStopPlacesState,
} from './flexibleStopPlaces';
import networks, { NetworksState } from './networks';
import organisations, { OrganisationState } from './organisations';
import providers, { ProvidersState } from './providers';
import stopPlaces, { StopPlacesState } from './stopPlaces';

export type GlobalState = {
  notification: NotificationState;
  auth: AuthState;
  organisations: OrganisationState;
  providers: ProvidersState;
  exports: ExportsState;
  networks: NetworksState;
  flexibleLines: FlexibleLinesState;
  flexibleStopPlaces: FlexibleStopPlacesState;
  editor: EditorState;
  config: ConfigState;
  stopPlaces: StopPlacesState;
};

const reducers = {
  notification,
  organisations,
  providers,
  exports,
  networks,
  flexibleLines,
  flexibleStopPlaces,
  editor,
  stopPlaces,
};

export default reducers;
