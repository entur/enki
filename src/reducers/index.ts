import { AuthState } from 'auth/authSlice';
import { ConfigState } from 'config/configSlice';
import notification, { NotificationState } from './notificationSlice';
import editor, { EditorState } from './editorSlice';
import exports, { ExportsState } from './exportsSlice';
import flexibleLines, { FlexibleLinesState } from './flexibleLinesSlice';
import flexibleStopPlaces, {
  FlexibleStopPlacesState,
} from './flexibleStopPlacesSlice';
import networks, { NetworksState } from './networksSlice';
import organisations, { OrganisationState } from './organisationsSlice';
import providers, { ProvidersState } from './providersSlice';
import brandings, { BrandingsState } from './brandingsSlice';
import dayTypes, { DayTypesState } from './dayTypesSlice';

export type GlobalState = {
  notification: NotificationState;
  auth: AuthState;
  organisations: OrganisationState;
  providers: ProvidersState;
  exports: ExportsState;
  networks: NetworksState;
  brandings: BrandingsState;
  dayTypes: DayTypesState;
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
  brandings,
  dayTypes,
  flexibleLines,
  flexibleStopPlaces,
  editor,
};

export default reducers;
