import {
  ReceiveBrandingAction,
  ReceiveBrandingsAction,
} from 'actions/brandings';
import { RECEIVE_BRANDING, RECEIVE_BRANDINGS } from 'actions/constants';
import { Branding } from 'model/Branding';
import { UnknownAction } from 'redux';

export type BrandingsState = Branding[] | null;

const brandingsReducer = (
  brandings: BrandingsState = null,
  action: UnknownAction,
) => {
  switch (action.type) {
    case RECEIVE_BRANDINGS:
      return (action as ReceiveBrandingsAction).brandings;

    case RECEIVE_BRANDING: {
      const typedAction = action as ReceiveBrandingAction;
      return brandings
        ? brandings.map((b) =>
            b.id === typedAction.branding.id ? typedAction.branding : b,
          )
        : [typedAction.branding];
    }

    default:
      return brandings;
  }
};

export default brandingsReducer;
