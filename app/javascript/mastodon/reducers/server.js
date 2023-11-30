import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  SERVER_FETCH_REQUEST,
  SERVER_FETCH_SUCCESS,
  SERVER_FETCH_FAIL,
  SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST,
  SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS,
  SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL,
  EXTENDED_DESCRIPTION_REQUEST,
  EXTENDED_DESCRIPTION_SUCCESS,
  EXTENDED_DESCRIPTION_FAIL,
} from 'mastodon/actions/server';

const initialState = ImmutableMap({
  server: ImmutableMap({
    isLoading: false,
  }),

  extendedDescription: ImmutableMap({
    isLoading: false,
  }),
});

export default function server(state = initialState, action) {
  switch (action.type) {
  case SERVER_FETCH_REQUEST:
    return state.setIn(['server', 'isLoading'], true);
  case SERVER_FETCH_SUCCESS:
    return state.set('server', fromJS(action.server)).setIn(['server', 'isLoading'], false);
  case SERVER_FETCH_FAIL:
    return state.setIn(['server', 'isLoading'], false);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST:
    return state.setIn(['translationLanguages', 'isLoading'], true);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS:
    return state.setIn(['translationLanguages', 'items'], fromJS(action.translationLanguages)).setIn(['translationLanguages', 'isLoading'], false);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL:
    return state.setIn(['translationLanguages', 'isLoading'], false);
  case EXTENDED_DESCRIPTION_REQUEST:
    return state.setIn(['extendedDescription', 'isLoading'], true);
  case EXTENDED_DESCRIPTION_SUCCESS:
    return state.set('extendedDescription', fromJS(action.description)).setIn(['extendedDescription', 'isLoading'], false);
  case EXTENDED_DESCRIPTION_FAIL:
    return state.setIn(['extendedDescription', 'isLoading'], false);
  default:
    return state;
  }
}
