import { RECEIVE_NETWORKS, REQUEST_NETWORKS } from '../actions/networks';

const networksReducer = (networks = null, action) => {
  switch (action.type) {
    case REQUEST_NETWORKS:
      return null;

    case RECEIVE_NETWORKS:
      return action.networks;

    default:
      return networks;
  }
};

export default networksReducer;
