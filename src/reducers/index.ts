import { AuthState } from 'features/app/authSlice';
import { ConfigState } from 'features/app/configSlice';
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
};

export default reducers;
