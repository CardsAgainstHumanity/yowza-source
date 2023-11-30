import api from '../api';

import { importFetchedAccount } from './importer';

export const SERVER_FETCH_REQUEST = 'Server_FETCH_REQUEST';
export const SERVER_FETCH_SUCCESS = 'Server_FETCH_SUCCESS';
export const SERVER_FETCH_FAIL    = 'Server_FETCH_FAIL';

export const SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST = 'SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST';
export const SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS = 'SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS';
export const SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL    = 'SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL';

export const EXTENDED_DESCRIPTION_REQUEST = 'EXTENDED_DESCRIPTION_REQUEST';
export const EXTENDED_DESCRIPTION_SUCCESS = 'EXTENDED_DESCRIPTION_SUCCESS';
export const EXTENDED_DESCRIPTION_FAIL    = 'EXTENDED_DESCRIPTION_FAIL';

export const fetchServer = () => (dispatch, getState) => {
  if (getState().getIn(['server', 'server', 'isLoading'])) {
    return;
  }

  dispatch(fetchServerRequest());

  api(getState)
    .get('/api/v2/instance').then(({ data }) => {
      if (data.contact.account) dispatch(importFetchedAccount(data.contact.account));
      dispatch(fetchServerSuccess(data));
    }).catch(err => dispatch(fetchServerFail(err)));
};

const fetchServerRequest = () => ({
  type: SERVER_FETCH_REQUEST,
});

const fetchServerSuccess = server => ({
  type: SERVER_FETCH_SUCCESS,
  server,
});

const fetchServerFail = error => ({
  type: SERVER_FETCH_FAIL,
  error,
});

export const fetchServerTranslationLanguages = () => (dispatch, getState) => {
  dispatch(fetchServerTranslationLanguagesRequest());

  api(getState)
    .get('/api/v1/instance/translation_languages').then(({ data }) => {
      dispatch(fetchServerTranslationLanguagesSuccess(data));
    }).catch(err => dispatch(fetchServerTranslationLanguagesFail(err)));
};

const fetchServerTranslationLanguagesRequest = () => ({
  type: SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST,
});

const fetchServerTranslationLanguagesSuccess = translationLanguages => ({
  type: SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS,
  translationLanguages,
});

const fetchServerTranslationLanguagesFail = error => ({
  type: SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL,
  error,
});

export const fetchExtendedDescription = () => (dispatch, getState) => {
  if (getState().getIn(['server', 'extendedDescription', 'isLoading'])) {
    return;
  }

  dispatch(fetchExtendedDescriptionRequest());

  api(getState)
    .get('/api/v1/instance/extended_description')
    .then(({ data }) => dispatch(fetchExtendedDescriptionSuccess(data)))
    .catch(err => dispatch(fetchExtendedDescriptionFail(err)));
};

const fetchExtendedDescriptionRequest = () => ({
  type: EXTENDED_DESCRIPTION_REQUEST,
});

const fetchExtendedDescriptionSuccess = description => ({
  type: EXTENDED_DESCRIPTION_SUCCESS,
  description,
});

const fetchExtendedDescriptionFail = error => ({
  type: EXTENDED_DESCRIPTION_FAIL,
  error,
});
