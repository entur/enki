import { RECEIVE_BRANDING, RECEIVE_BRANDINGS } from 'actions/constants';
import { Branding } from 'model/Branding';
import { AnyAction } from 'redux';

export type BrandingsState = Branding[] | null;

const brandingsReducer = (
  brandings: BrandingsState = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case RECEIVE_BRANDINGS:
      return action.brandings;

    case RECEIVE_BRANDING:
      return brandings
        ? brandings.map((b) =>
            b.id === action.branding.id ? action.branding : b,
          )
        : [action.branding];

    default:
      return brandings;
  }
};

export default brandingsReducer;
