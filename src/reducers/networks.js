import { CREATE_NETWORK, UPDATE_NETWORK } from '../actions/networks';

const networksReducer = (networks = null, action) => {
  switch (action.type) {
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
