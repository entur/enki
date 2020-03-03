import notification from 'components/Notification/reducer';
import user from './user';
import organisations from './organisations';
import providers from './providers';
import exports from './exports';
import networks from './networks';
import flexibleLines from './flexibleLines';
import flexibleStopPlaces from './flexibleStopPlaces';
import editor from './editor';

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
