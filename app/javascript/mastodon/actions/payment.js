import { closeModal } from 'mastodon/actions/modal';

import api from '../api';

export const STRIPE_CHECKOUT_SESSION_REQUEST  = 'STRIPE_CHECKOUT_SESSION_REQUEST';
export const STRIPE_CHECKOUT_SESSION_FETCH_SUCCESS  = 'STRIPE_CHECKOUT_SESSION_FETCH_SUCCESS';
export const STRIPE_CHECKOUT_SESSION_FETCH_FAIL  = 'STRIPE_CHECKOUT_SESSION_FETCH_FAIL';
export const CLEAR_STRIPE_CHECKOUT_SESSION = 'CLEAR_STRIPE_CHECKOUT_SESSION';

export const createCheckoutSession = (itemId = null, itemValue = null) => (dispatch, getState) => {
  dispatch(stripeCheckoutSessionRequest());
  api(getState).post('/api/v1/payments/create_session', { purchase_type: itemId, purchase_target: itemValue }).then(response => {
    dispatch(fetchCheckoutSessionSuccess(response.data));
  }).catch((err) => {
      dispatch(closeModal({ modalType: undefined, ignoreFocus: false }));
      dispatch(fetchCheckoutSessionFail(err));
  });
}

export const clearStripeCheckoutSession = () => ({
  type: CLEAR_STRIPE_CHECKOUT_SESSION
});

export const stripeCheckoutSessionRequest = () => ({
  type: STRIPE_CHECKOUT_SESSION_REQUEST
});

export const fetchCheckoutSessionSuccess = (data) => ({
  type: STRIPE_CHECKOUT_SESSION_FETCH_SUCCESS,
  sessionId: data.clientSecret
});

export const fetchCheckoutSessionFail = (err) => ({
  type: STRIPE_CHECKOUT_SESSION_FETCH_FAIL,
  error: err
});
