import api from '../api';

export const FETCH_LEADERBOARD_REQUEST  = 'FETCH_LEADERBOARD_REQUEST';
export const FETCH_LEADERBOARD_SUCCESS  = 'FETCH_LEADERBOARD_SUCCESS';
export const FETCH_LEADERBOARD_FAIL  = 'FETCH_LEADERBOARD_FAIL';
export const RESET_LEADERBOARD  = 'RESET_LEADERBOARD';
export const FETCH_REFERRALS_REQUEST  = 'FETCH_REFERRALS_REQUEST';
export const FETCH_REFERRALS_SUCCESS  = 'FETCH_REFERRALS_SUCCESS';
export const FETCH_REFERRALS_FAIL  = 'FETCH_REFERRALS_FAIL';

export const fetchLeaderboard = (page, pageSize) => (dispatch, getState) => {
  dispatch(fetchLeaderboardRequest(page, pageSize));
  api(getState).get('/api/v1/leaderboard', { params: { page: page, page_size: pageSize } }).then(response => {
    dispatch(fetchLeaderboardSuccess(page, response.data));
  }).catch(() => {
    dispatch(fetchLeaderboardFail());
  });
}

export const fetchReferrals = () => (dispatch, getState) => {
  dispatch(fetchReferralsRequest());
  api(getState).get('/api/v1/leaderboard/paid_referrals_remaining').then(response => {
    dispatch(fetchReferralsSuccess(response.data));
  }).catch(() => {
    dispatch(fetchReferralsFail());
  });
}

export const fetchLeaderboardRequest = (page, pageSize, reset) => ({
  type: FETCH_LEADERBOARD_REQUEST,
  page: page,
  pageSize: pageSize,
  reset
});

export const fetchReferralsRequest = () => ({
  type: FETCH_REFERRALS_REQUEST,
});

export const fetchReferralsSuccess = (data) => ({
  type: FETCH_REFERRALS_SUCCESS,
  data: data,
});

export const fetchReferralsFail = () => ({
  type: FETCH_REFERRALS_FAIL,
});

export const fetchLeaderboardSuccess = (page, data) => ({
  type: FETCH_LEADERBOARD_SUCCESS,
  leaders: data,
  page: page
});

export const fetchLeaderboardFail = () => ({
  type: FETCH_LEADERBOARD_FAIL
});

export const resetLeaderboard = () => ({
  type: RESET_LEADERBOARD
})
