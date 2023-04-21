import notification, { NotificationState } from 'reducers/notification';
import organisations, { OrganisationState } from './organisations';
import providers, { ProvidersState } from './providers';
import exports, { ExportsState } from './exports';
import networks, { NetworksState } from './networks';
import flexibleLines, { FlexibleLinesState } from './flexibleLines';
import flexibleStopPlaces, {
  FlexibleStopPlacesState,
} from './flexibleStopPlaces';
import editor, { EditorState } from './editor';
import { AuthState } from 'features/app/authSlice';
import { ConfigState } from 'features/app/configSlice';

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
  intl: IntlState;
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
