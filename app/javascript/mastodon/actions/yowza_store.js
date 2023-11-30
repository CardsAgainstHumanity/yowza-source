import { openModal, closeModal } from 'mastodon/actions/modal';
import { me } from 'mastodon/initial_state';

import api from '../api';

import { showAlert } from './alerts';


export const INITIALIZE_STORE_REQUEST  = 'INITIALIZE_STORE_REQUEST';
export const POPULATE_INITIAL_STORE  = 'POPULATE_INITIAL_STORE';
export const POPULATE_INITIAL_STORE_FAIL  = 'POPULATE_INITIAL_STORE_FAIL';
export const TOGGLE_STORE_ITEM  = 'TOGGLE_STORE_ITEM';
export const CHANGE_STORE_ITEM_VALUE  = 'CHANGE_STORE_ITEM_VALUE';
export const RESET_STORE  = 'RESET_STORE';

export const initializeStore = () => (dispatch, getState) => {
  const totalChecks = getState().getIn(['accounts', me, 'total_checks']);
  dispatch(initializeStoreRequest());
  api(getState).get('/api/v1/store').then(response => {
    dispatch(populateInitialStore(response.data, totalChecks));
  }).catch(() => {
    dispatch(populateInitialStoreFail());
  });
}

export const submitItemForPurchase = (itemId, itemValue) => (dispatch, getState) => {
  validateItem(itemId, itemValue, getState).then((result) => {
    if (result) {
      dispatch(closeModal({ modalType: undefined, ignoreFocus: false }));
      dispatch(openModal({ modalType: 'PAYMENT', modalProps: { itemId: itemId, itemValue: itemValue } }));
    } else {
      dispatch(showAlert({
        message: "Something went wrong",
        dismissAfter: 5000,
      }));
    }
  }).catch(() => {
    dispatch(showAlert({
      message: "Something went wrong",
      dismissAfter: 5000,
    }));
  })
}

export const initializeStoreRequest = () => ({
  type: INITIALIZE_STORE_REQUEST,
});

export const populateInitialStore = (data, totalChecks) => ({
  type: POPULATE_INITIAL_STORE,
  data: data,
  totalChecks: totalChecks,
});

export const populateInitialStoreFail = () => ({
  type: POPULATE_INITIAL_STORE_FAIL
});

export const toggleStoreItem = (itemId) => (dispatch, getState) => {
  const currentlyToggled = getState().getIn(['yowzaStore', 'items', itemId, 'toggled'])
  dispatch({
    type: TOGGLE_STORE_ITEM,
    itemId: itemId,
    newToggleState: !currentlyToggled,
  });
};

export const changeStoreItemValue = (itemId, value, valid) => ({
  type: CHANGE_STORE_ITEM_VALUE,
  itemId: itemId,
  value: value,
  valid: valid
});

export const resetStore = () => ({
  type: RESET_STORE
});

// on submit, we make calls to the backend to make sure the account/post exists
const validateItem = async (itemId, itemValue, getState) => {
  try {
    switch(itemId) {
      case 'bot_follow':
      case 'followers':
        await api(getState).get('/api/v1/accounts/lookup', { params: { acct: itemValue } })
        return true;
      case 'likes':
        const matches = itemValue.match(new RegExp(`^${window.location.origin}/@[A-Za-z0-9]+/(\\d+)$`));
        const match = matches[1];
        await api(getState).get(`/api/v1/statuses/${match}`)
        return true;
    }
    return true;
  } catch {
    return false;
  }
}
