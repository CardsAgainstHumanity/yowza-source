import api from '../api';

export const FETCH_CHALLENGE_REQUEST  = 'FETCH_CHALLENGE_REQUEST';
export const FETCH_CHALLENGE_SUCCESS  = 'FETCH_CHALLENGE_SUCCESS';
export const FETCH_CHALLENGE_FAIL     = 'FETCH_CHALLENGE_FAIL';
export const RESET_CHALLENGES  = 'RESET_CHALLENGES';
export const TOGGLE_CHALLENGE_RESULTS  = 'TOGGLE_CHALLENGE_RESULTS';

export const fetchChallenges = () => (dispatch, getState) => {
  dispatch(fetchChallengeRequest());
  api(getState).get('/api/v1/challenges').then(response => {
    dispatch(fetchChallengesSuccess(response.data));
  }).catch(() => {
    dispatch(fetchChallengeFail());
  });
}

export const fetchChallengeRequest = () => ({
  type: FETCH_CHALLENGE_REQUEST,
});

export const fetchChallengesSuccess = (data) => ({
  type: FETCH_CHALLENGE_SUCCESS,
  challenges: data
});

export const fetchChallengeFail = () => ({
  type: FETCH_CHALLENGE_FAIL,
});

export const resetChallenges = () => ({
  type: RESET_CHALLENGES,
});

export const toggleChallengeResults = (challengeId) => (dispatch, getState) => {

  const currentlyToggled = getState().getIn(['challenges', 'toggledChallenges', challengeId])
  dispatch({
    type: TOGGLE_CHALLENGE_RESULTS,
    challengeId: challengeId,
    newToggleState: !currentlyToggled,
  })
}
