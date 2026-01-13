import { RECEIVE_NETWORK, RECEIVE_NETWORKS } from 'actions/constants';
import { ReceiveNetworkAction, ReceiveNetworksAction } from 'actions/networks';
import { Network } from 'model/Network';
import { UnknownAction } from 'redux';

export type NetworksState = Network[] | null;

const networksReducer = (
  networks: NetworksState = null,
  action: UnknownAction,
) => {
  switch (action.type) {
    case RECEIVE_NETWORKS:
      return (action as ReceiveNetworksAction).networks;

    case RECEIVE_NETWORK: {
      const typedAction = action as ReceiveNetworkAction;
      return networks
        ? networks.map((n) =>
            n.id === typedAction.network.id ? typedAction.network : n,
          )
        : [typedAction.network];
    }

    default:
      return networks;
  }
};

export default networksReducer;
