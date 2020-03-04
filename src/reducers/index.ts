import notification from 'components/Notification/reducer';
import user, { UserState } from './user';
import organisations, { OrganisationState } from './organisations';
import providers, { ProvidersState } from './providers';
import exports, { ExportsState } from './exports';
import networks, { NetworksState } from './networks';
import flexibleLines, { FlexibleLinesState } from './flexibleLines';
import flexibleStopPlaces, {
  FlexibleStopPlacesState
} from './flexibleStopPlaces';
import editor, { EditorState } from './editor';

export type GlobalState = {
  notification: any;
  user: UserState;
  organisations: OrganisationState;
  providers: ProvidersState;
  exports: ExportsState;
  networks: NetworksState;
  flexibleLines: FlexibleLinesState;
  flexibleStopPlaces: FlexibleStopPlacesState;
  editor: EditorState;
};

const reducers = {
  notification,
  user,
  organisations,
  providers,
  exports,
  networks,
  flexibleLines,
  flexibleStopPlaces,
  editor
};

export default reducers;
