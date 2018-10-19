import notification from '../components/Notification/reducer';
import user from './user';
import organisations from './organisations';
import providers from './providers';
import networks from './networks';
import flexibleLines from './flexibleLines';
import flexibleStopPlaces from './flexibleStopPlaces';

const reducers = {
  notification,
  user,
  organisations,
  providers,
  networks,
  flexibleLines,
  flexibleStopPlaces
};

export default reducers;
