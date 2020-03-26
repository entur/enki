import { RECEIVE_NETWORKS, RECEIVE_NETWORK } from 'actions/networks';
import { AnyAction } from 'redux';
import { Network } from 'model/Network';

export type NetworksState = Network[] | null;

const networksReducer = (networks: NetworksState = null, action: AnyAction) => {
  switch (action.type) {
    case RECEIVE_NETWORKS:
      return action.networks;

    case RECEIVE_NETWORK:
      return networks
        ? networks.map((n) => (n.id === action.network.id ? action.network : n))
        : [action.network];

    default:
      return networks;
  }
};

export default networksReducer;
