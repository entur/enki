import notification, { NotificationState } from 'reducers/notification';
import auth, { AuthState } from './auth';
import organisations, { OrganisationState } from './organisations';
import providers, { ProvidersState } from './providers';
import exports, { ExportsState } from './exports';
import networks, { NetworksState } from './networks';
import flexibleLines, { FlexibleLinesState } from './flexibleLines';
import flexibleStopPlaces, {
  FlexibleStopPlacesState,
} from './flexibleStopPlaces';
import editor, { EditorState } from './editor';
import { AppIntlState } from 'i18n';
import config, { ConfigState } from './config';

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
  intl: AppIntlState;
  config: ConfigState;
};

const reducers = {
  notification,
  auth,
  organisations,
  providers,
  exports,
  networks,
  flexibleLines,
  flexibleStopPlaces,
  editor,
  config,
};

export default reducers;
