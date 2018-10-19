import {
  CREATE_NETWORK,
  RECEIVE_NETWORKS,
  REQUEST_NETWORKS,
  UPDATE_NETWORK
} from '../actions/networks';

const networksReducer = (networks = null, action) => {
  switch (action.type) {
    case REQUEST_NETWORKS:
      return null;

    case RECEIVE_NETWORKS:
      return action.networks;

    case CREATE_NETWORK:
      return networks.concat(action.network);

    case UPDATE_NETWORK:
      return networks
        .filter(n => n.id !== action.network.id)
        .concat(action.network);

    default:
      return networks;
  }
};

export default networksReducer;
