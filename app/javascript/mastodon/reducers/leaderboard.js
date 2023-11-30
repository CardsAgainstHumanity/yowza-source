import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  FETCH_LEADERBOARD_FAIL,
  FETCH_LEADERBOARD_REQUEST,
  FETCH_LEADERBOARD_SUCCESS,
  FETCH_REFERRALS_FAIL,
  FETCH_REFERRALS_REQUEST,
  FETCH_REFERRALS_SUCCESS,
  RESET_LEADERBOARD
} from '../actions/leaderboard';

const initialState = ImmutableMap({
  page: 1,
  pageSize: 50,
  paidReferralsRemaining: null,
  leadersList: ImmutableList(),
  leaders: ImmutableMap(),
  loading: false,
  hasMore: false
});

export default function leaderboard(state = initialState, action) {
  switch(action.type) {
  case FETCH_REFERRALS_FAIL:
    return state;
  case FETCH_REFERRALS_REQUEST:
    return state;
  case FETCH_REFERRALS_SUCCESS:
    return state.set('paidReferralsRemaining', action.data.remaining_payable_referrals);
  case FETCH_LEADERBOARD_FAIL:
    return state.set('loading', false);
  case FETCH_LEADERBOARD_REQUEST:
    return state.set('loading', true);
  case FETCH_LEADERBOARD_SUCCESS:
    return state.withMutations((map) => {
      map.set('loading', false);
      map.set('page', action.page);
      map.set('hasMore', false);

      const mapObject = map.toObject();
      const newLeadersList = mapObject.leadersList.concat(action.leaders.map((l, index) => `${l.id}_${index}_${action.page}`));
      map.set('leadersList', newLeadersList);

      let leaders = mapObject.leaders;
      for(let i = 0; i < action.leaders.length; i++) {
        let leader = action.leaders[i];

        leaders = leaders.set(`${leader.id}_${i}_${action.page}`, fromJS(leader));
      }
      map.set('leaders', leaders);
    });
  case RESET_LEADERBOARD:
    return initialState;
  default:
    return state;
  }
}
