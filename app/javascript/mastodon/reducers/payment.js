import { Map as ImmutableMap } from 'immutable';

import {
  STRIPE_CHECKOUT_SESSION_FETCH_SUCCESS,
  STRIPE_CHECKOUT_SESSION_REQUEST,
  CLEAR_STRIPE_CHECKOUT_SESSION
} from '../actions/payment';

const initialState = ImmutableMap({
  sessionId: '',
});

export default function payment(state = initialState, action) {
  switch(action.type) {
  case CLEAR_STRIPE_CHECKOUT_SESSION:
    return initialState;
  case STRIPE_CHECKOUT_SESSION_REQUEST:
    return state;
  case STRIPE_CHECKOUT_SESSION_FETCH_SUCCESS:
    return state.withMutations((map) => {
      map.set('sessionId', action.sessionId);
    });
  default:
    return state;
  }
}
